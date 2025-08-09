import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useFeedbackContext } from '../context/feedback-context'
import { useFeedbackMutations } from '../hooks/useFeedback'
import { toast } from 'sonner'

export function FeedbackDeleteDialog() {
  const { open, setOpen, currentRow } = useFeedbackContext()
  const { deleteFeedback } = useFeedbackMutations()

  if (!currentRow) return null

  const isOpen = open === 'delete'

  const handleDelete = async () => {
    try {
      await deleteFeedback.mutateAsync(currentRow.id)
      toast.success('Feedback deleted successfully')
      setOpen(null)
    } catch (error) {
      toast.error('Failed to delete feedback')
      console.error('Delete feedback error:', error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this feedback? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className='my-4'>
          <div className='rounded-md border p-3 bg-muted/50'>
            <p className='text-sm text-muted-foreground'>
              <strong>Message:</strong> {currentRow.message.substring(0, 100)}
              {currentRow.message.length > 100 ? '...' : ''}
            </p>
            <p className='text-sm text-muted-foreground mt-1'>
              <strong>Platform:</strong> {currentRow.appPlatform.toUpperCase()}
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteFeedback.isPending}
            className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
          >
            {deleteFeedback.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
