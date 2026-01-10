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
import { useCountriesContext } from '../context/countries-context.tsx'
import { CountryService } from '@/core/services/countries/country.service.ts'

export function CountriesDeleteDialog() {
  const { open, setOpen, currentRow } = useCountriesContext()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const isOpen = open === 'delete'

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CountryService.getInstance().deleteCountry(id),
  })

  const handleDelete = async () => {
    if (!currentRow) return

    setIsLoading(true)
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      queryClient.invalidateQueries({ queryKey: ['countries'] })
      setOpen(null)
    } catch (error) {
      console.error('Error deleting country:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentRow) return null

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Country</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{currentRow.name}"? This action cannot be undone and will affect all associated stations.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(null)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
