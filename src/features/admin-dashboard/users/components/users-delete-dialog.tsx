'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
//import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Input } from '@/components/ui/input'
import type { UserResponseDto } from '@/core/types/user.types'
import { UserService } from '@/core/services/users/user.service'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: UserResponseDto
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')

  const getDisplayName = () => {
    if ('displayName' in currentRow && currentRow.displayName) return currentRow.displayName
    return ''
  }

  const getRole = () => {
    if (currentRow.claims && currentRow.claims.role) return currentRow.claims.role.toUpperCase()
    return 'NO ROLE'
  }

  const handleDelete = async () => {
    if (value.trim() !== getDisplayName()) return
    try {
      await UserService.getInstance().deleteUser(currentRow.id)
      onOpenChange(false)
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== getDisplayName()}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{String(getDisplayName())}</span>?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className='font-bold'>
              {getRole()}
            </span>{' '}
          </p>
          <div className=''>
            <Label htmlFor='delete-confirm' className='mb-5'>Name:</Label>
            <Input
              id='delete-confirm'
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={getDisplayName()}
              autoFocus
            />
          </div>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
