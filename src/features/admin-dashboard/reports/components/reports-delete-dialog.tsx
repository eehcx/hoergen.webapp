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
import { useReportsContext } from '../context/reports-context'

export function ReportsDeleteDialog() {
  const { open, setOpen, currentRow } = useReportsContext()
  const isOpen = open === 'delete'

  const handleDelete = async () => {
    if (!currentRow) return

    try {
      console.log('Deleting report:', currentRow.id)
      // TODO: Implement API call
      // await ReportService.deleteReport(currentRow.id)
      setOpen(null)
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the report
            "{currentRow?.reason}" and remove all its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className='bg-red-600 hover:bg-red-700'
          >
            Delete Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
