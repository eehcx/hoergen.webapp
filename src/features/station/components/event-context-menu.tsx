import React, { useState } from 'react'
import {
  IconEdit,
  IconTrash,
  IconCirclePlus,
  IconDotsVertical,
} from '@tabler/icons-react'
import { EventService } from '@/core/services/events/event.service'
import { useIsElectron } from '@/hooks'
import { useStaticTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

interface EventContextMenuProps {
  eventId: string
  event: { title: string; description: string }
  onEdit: () => void
  onAdd: () => void
  onDeleted: () => void
  children: React.ReactNode
}

export const EventContextMenu: React.FC<EventContextMenuProps> = ({
  eventId,
  event,
  onEdit,
  onAdd,
  onDeleted,
  children,
}) => {
  const { t } = useStaticTranslation()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const isElectron = useIsElectron()

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')
    try {
      await EventService.getInstance().deleteEvent(eventId)
      setShowDeleteDialog(false)
      onDeleted()
    } catch (_err) {
      setError(t('eventContextMenu.errorDeletingEvent'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {isElectron ? (
        // Versión para Electron usando DropdownMenu
        <div className='relative'>
          <div className='group relative'>
            {children}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='absolute top-1 right-1 h-6 w-6 p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
                  style={{ borderRadius: 0 }}
                >
                  <IconDotsVertical size={12} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='rounded-none' align='end'>
                <DropdownMenuItem
                  onClick={onEdit}
                  className='flex cursor-pointer items-center gap-2 rounded-none'
                >
                  <IconEdit size={16} />
                  {t('eventContextMenu.editEvent')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className='text-destructive flex cursor-pointer items-center gap-2 rounded-none'
                >
                  <IconTrash size={16} />
                  {t('eventContextMenu.deleteEvent')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onAdd}
                  className='flex cursor-pointer items-center gap-2 rounded-none'
                >
                  <IconCirclePlus size={16} />
                  {t('eventContextMenu.addNewEvent')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        // Versión para Web usando ContextMenu
        <ContextMenu>
          <ContextMenuTrigger>{children}</ContextMenuTrigger>
          <ContextMenuContent className='rounded-none'>
            <ContextMenuItem
              onClick={onEdit}
              className='flex cursor-pointer items-center gap-2 rounded-none'
            >
              <IconEdit size={16} />
              {t('eventContextMenu.editEvent')}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className='text-destructive flex cursor-pointer items-center gap-2 rounded-none'
            >
              <IconTrash size={16} />
              {t('eventContextMenu.deleteEvent')}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={onAdd}
              className='flex cursor-pointer items-center gap-2 rounded-none'
            >
              <IconCirclePlus size={16} />
              {t('eventContextMenu.addNewEvent')}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}

      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className='border-0 p-0' style={{ borderRadius: 0 }}>
            <DialogTitle className='border-border border-b px-6 pt-6 pb-2 text-lg font-bold'>
              {t('eventContextMenu.confirmDeletion')}
            </DialogTitle>
            <form
              className='flex flex-col gap-3 px-6 py-6'
              onSubmit={(e) => {
                e.preventDefault()
                if (confirmText === event.title) {
                  handleDelete()
                }
              }}
            >
              <div className='mb-2 text-sm'>
                {t('eventContextMenu.typeToConfirm')}{' '}
                <span className='text-primary font-bold'>{event.title}</span>{' '}
                {t('eventContextMenu.toConfirmDeletion')}
              </div>
              <Input
                required
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type "${event.title}"`}
                className='border-border border'
                style={{ borderRadius: 0 }}
              />
              <div className='mt-4 flex justify-end gap-2'>
                <button
                  type='button'
                  className='bg-secondary text-secondary-foreground hover:bg-secondary/80 border-0 px-4 py-2 font-bold shadow transition-colors'
                  style={{ borderRadius: 0 }}
                  onClick={() => setShowDeleteDialog(false)}
                >
                  {t('eventContextMenu.cancel')}
                </button>
                <button
                  type='submit'
                  className='bg-destructive hover:bg-destructive/90 border-0 px-4 py-2 font-bold text-white shadow transition-colors'
                  style={{ borderRadius: 0 }}
                  disabled={isDeleting || confirmText !== event.title}
                >
                  {isDeleting ? t('eventContextMenu.deleting') : t('eventContextMenu.delete')}
                </button>
              </div>
              {error && (
                <div className='mt-1 text-xs text-red-500'>{error}</div>
              )}
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
