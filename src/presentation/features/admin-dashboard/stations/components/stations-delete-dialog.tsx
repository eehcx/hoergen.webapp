import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/presentation/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog.tsx'
import { useStationsContext } from '../context/stations-context.tsx'
import { StationService } from '@/core/services/stations/station.service.ts'
import { Input } from '@/presentation/components/ui/input.tsx'

export function StationsDeleteDialog() {
  const { open, setOpen, currentRow } = useStationsContext()
  const [isLoading, setIsLoading] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const queryClient = useQueryClient()

  const isOpen = open === 'delete'

  const deleteMutation = useMutation({
    mutationFn: (id: string) => StationService.getInstance().deleteStation(id),
  })

  const handleDelete = async () => {
    if (!currentRow) return
    if (confirmName !== currentRow.name) return

    setIsLoading(true)
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      queryClient.invalidateQueries({ queryKey: ['stations'] })
      setOpen(null)
    } catch (error) {
      console.error('Error deleting station:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentRow) return null

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Station</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{currentRow.name}"? This action cannot be undone.<br />
            Please type <b>{currentRow.name}</b> to confirm.
          </DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          value={confirmName}
          onChange={e => setConfirmName(e.target.value)}
          placeholder={`Type "${currentRow.name}" to confirm`}
          className='mb-4'
        />
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(null)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading || confirmName !== currentRow.name}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
