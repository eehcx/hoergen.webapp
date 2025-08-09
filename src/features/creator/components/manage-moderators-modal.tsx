import { useState } from 'react'
import React from 'react'
import { IconTrash, IconUser, IconMail } from '@tabler/icons-react'
import type { ResponseStationDto } from '@/core/types/station.types'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAddModerators,
  useRemoveModerators,
  useMultipleUsersData,
} from '../hooks'

interface ManageModeratorsModalProps {
  station: ResponseStationDto
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageModeratorsModal({
  station,
  open,
  onOpenChange,
}: ManageModeratorsModalProps) {
  const [newModeratorEmail, setNewModeratorEmail] = useState('')
  const [isAddingModerator, setIsAddingModerator] = useState(false)

  // Estado local para actualizaciones optimistas
  const [optimisticModerators, setOptimisticModerators] = useState<string[]>([])
  const [removingModerators, setRemovingModerators] = useState<Set<string>>(
    new Set()
  )

  const addModerators = useAddModerators(
    (data) => {
      toast.success('Moderator added successfully')
      setNewModeratorEmail('')
      setIsAddingModerator(false)

      // Actualizar estado optimista con la respuesta real del servidor
      if (data && data.data && Array.isArray(data.data.moderators)) {
        setOptimisticModerators(data.data.moderators)
      }
    },
    (error) => {
      toast.error('Failed to add moderator')
      console.error('Error adding moderator:', error)
      setIsAddingModerator(false)

      // Revertir estado optimista en caso de error
      setOptimisticModerators(currentModerators)
    }
  )

  const removeModerators = useRemoveModerators(
    (data) => {
      toast.success('Moderator removed successfully')

      // Limpiar estado de "removiendo" y actualizar lista optimista
      setRemovingModerators(new Set())
      if (data && data.data && Array.isArray(data.data.moderators)) {
        setOptimisticModerators(data.data.moderators)
      }
    },
    (error) => {
      toast.error('Failed to remove moderator')
      console.error('Error removing moderator:', error)

      // Revertir estado optimista en caso de error
      setRemovingModerators(new Set())
      setOptimisticModerators(currentModerators)
    }
  )

  const actualModerators = (() => {
    if (!station) {
      console.warn('Station is null when trying to get moderators')
      return []
    }

    if (!station.moderators) {
      console.log('Station has no moderators property or it is null/undefined')
      return []
    }

    if (!Array.isArray(station.moderators)) {
      console.error(
        'Station moderators is not an array:',
        typeof station.moderators,
        station.moderators
      )
      return []
    }

    console.log('Actual moderators:', station.moderators)
    return station.moderators
  })()

  // Usar estado optimista si existe, sino usar datos reales
  const currentModerators =
    optimisticModerators.length > 0 ? optimisticModerators : actualModerators

  // Actualizar estado optimista cuando cambien los datos reales
  React.useEffect(() => {
    if (actualModerators.length > 0 && optimisticModerators.length === 0) {
      setOptimisticModerators(actualModerators)
    }
  }, [actualModerators, optimisticModerators.length])

  // Los moderadores vienen como IDs, necesitamos obtener datos de usuarios
  const { data: moderatorsData, isLoading: isLoadingModerators } =
    useMultipleUsersData(currentModerators)

  // Verificación de seguridad para station null/undefined
  if (!station) {
    console.warn('ManageModeratorsModal: station is null or undefined')
    return null
  }

  console.log('ManageModeratorsModal: station loaded', {
    stationId: station.id,
    stationName: station.name,
    moderators: station.moderators,
  })

  const handleAddModerator = async () => {
    if (!newModeratorEmail.trim()) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!station || !station.id) {
      toast.error('Station information is not available')
      return
    }

    setIsAddingModerator(true)

    try {
      // Validar formato de email básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(newModeratorEmail.trim())) {
        toast.error('Please enter a valid email address')
        setIsAddingModerator(false)
        return
      }

      // Verificar si el email ya está en la lista de moderadores
      if (currentModerators.includes(newModeratorEmail.trim())) {
        toast.error('This user is already a moderator')
        setIsAddingModerator(false)
        return
      }

      // Actualización optimista: agregar temporalmente un ID fake
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setOptimisticModerators([...currentModerators, tempId])

      // Enviar email directamente al backend
      addModerators.mutate({
        stationId: station.id,
        moderators: [newModeratorEmail.trim()],
      })
    } catch (error) {
      console.error('Error in handleAddModerator:', error)
      toast.error('An error occurred while adding the moderator')
      setIsAddingModerator(false)
    }
  }

  const handleRemoveModerator = (moderatorId: string) => {
    if (!station || !station.id) {
      console.error('Cannot remove moderator: station or station.id is missing')
      toast.error('Station information is not available')
      return
    }

    console.log('Removing moderator:', { moderatorId, stationId: station.id })

    // Actualización optimista: marcar como "removiendo" y ocultar de la lista
    setRemovingModerators((prev) => new Set([...prev, moderatorId]))
    setOptimisticModerators((prev) => prev.filter((id) => id !== moderatorId))

    removeModerators.mutate({
      stationId: station.id,
      moderators: [moderatorId],
    })
  }
  const isLoading = addModerators.isPending || removeModerators.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl rounded-none'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            <IconUser size={24} />
            Manage Moderators
          </DialogTitle>
          <DialogDescription>
            Add or remove moderators for "{station.name}". Moderators can help
            manage the station's content and community.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Add New Moderator Section */}
          <div className='space-y-4'>
            {/*
              <div className='flex items-center gap-2'>
                <IconPlus size={20} className='text-primary' />
                <h3 className='font-semibold'>Add New Moderator</h3>
              </div>
              */}

            <div className='flex gap-2'>
              <div className='flex-1'>
                <Input
                  type='email'
                  placeholder='Enter email address'
                  value={newModeratorEmail}
                  onChange={(e) => setNewModeratorEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddModerator()
                    }
                  }}
                  className='rounded-none'
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleAddModerator}
                disabled={isLoading || !newModeratorEmail.trim()}
                className='rounded-none'
              >
                {isAddingModerator ? 'Adding...' : 'Add'}
              </Button>
            </div>

            <p className='text-muted-foreground text-sm'>
              Enter the email address of the user you want to add as a
              moderator.
            </p>
          </div>

          <Separator />

          {/* Current Moderators Section */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Current Moderators</h3>
              <Badge variant='secondary' className='rounded-none'>
                {currentModerators.length} moderator
                {currentModerators.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {!currentModerators || currentModerators.length === 0 ? (
              <div className='text-muted-foreground py-8 text-center'>
                <IconUser size={48} className='mx-auto mb-4 opacity-50' />
                <p className='text-lg font-medium'>No moderators yet</p>
                <p className='text-sm'>
                  Add moderators to help manage your station's content and
                  community.
                </p>
              </div>
            ) : (
              <div className='max-h-60 space-y-2 overflow-y-auto'>
                {isLoadingModerators
                  ? // Skeleton loading para moderadores
                    Array.from({ length: currentModerators.length || 2 }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between rounded-none border p-3'
                        >
                          <div className='flex items-center gap-3'>
                            <Skeleton className='size-10 rounded-full' />
                            <div className='min-w-0 flex-1'>
                              <Skeleton className='mb-1 h-4 w-24' />
                              <Skeleton className='h-3 w-32' />
                            </div>
                            <Skeleton className='h-5 w-16' />
                          </div>
                          <Skeleton className='h-8 w-8' />
                        </div>
                      )
                    )
                  : currentModerators &&
                    currentModerators.map((moderatorId, _index) => {
                      const userData = moderatorsData?.find(
                        (user) => user.id === moderatorId
                      )
                      const isBeingRemoved = removingModerators.has(moderatorId)
                      const isTemporary = moderatorId.startsWith('temp_')

                      return (
                        <ModeratorItem
                          key={moderatorId}
                          moderatorId={moderatorId}
                          userData={userData}
                          onRemove={() => handleRemoveModerator(moderatorId)}
                          isRemoving={isBeingRemoved}
                          isTemporary={isTemporary}
                        />
                      )
                    })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-2 border-t pt-4'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='rounded-none'
            disabled={isLoading}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente para cada item de moderador
interface ModeratorItemProps {
  moderatorId: string
  userData?: {
    id: string
    email: string
    displayName: string
    photoURL?: string | null
  }
  onRemove: () => void
  isRemoving: boolean
  isTemporary?: boolean
}

function ModeratorItem({
  moderatorId,
  userData,
  onRemove,
  isRemoving,
  isTemporary = false,
}: ModeratorItemProps) {
  // Usar datos reales del usuario o fallback
  const moderatorData = {
    id: moderatorId,
    name:
      userData?.displayName ||
      (isTemporary ? 'Adding...' : `User ${moderatorId.slice(0, 8)}`),
    email:
      userData?.email ||
      (isTemporary
        ? 'Loading...'
        : `user${moderatorId.slice(0, 4)}@unknown.com`),
    avatar: userData?.photoURL || null,
  }

  return (
    <div
      className={`hover:bg-muted/50 flex items-center justify-between rounded-none border p-3 transition-colors ${
        isRemoving ? 'pointer-events-none opacity-50' : ''
      } ${isTemporary ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50' : ''}`}
    >
      <div className='flex items-center gap-3'>
        <Avatar className='size-10'>
          <AvatarImage
            src={moderatorData.avatar || undefined}
            alt={moderatorData.name}
          />
          <AvatarFallback
            className={isTemporary ? 'bg-blue-100 dark:bg-blue-900' : ''}
          >
            {isTemporary ? '...' : moderatorData.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className='min-w-0 flex-1'>
          <p
            className='truncate text-sm font-medium'
            title={moderatorData.name}
          >
            {moderatorData.name}
          </p>
          <div className='text-muted-foreground flex items-center gap-1 text-xs'>
            <IconMail size={14} />
            <span className='truncate' title={moderatorData.email}>
              {moderatorData.email}
            </span>
          </div>
        </div>

        <Badge
          variant={isTemporary ? 'default' : 'outline'}
          className={`rounded-none text-xs ${
            isTemporary ? 'bg-blue-500 text-white' : ''
          }`}
        >
          {isTemporary ? 'Adding...' : 'Moderator'}
        </Badge>
      </div>

      <Button
        variant='ghost'
        size='sm'
        onClick={onRemove}
        disabled={isRemoving || isTemporary}
        className='text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none'
      >
        {isRemoving ? (
          <div className='border-destructive h-4 w-4 animate-spin rounded-full border-b-2'></div>
        ) : (
          <IconTrash size={16} />
        )}
      </Button>
    </div>
  )
}
