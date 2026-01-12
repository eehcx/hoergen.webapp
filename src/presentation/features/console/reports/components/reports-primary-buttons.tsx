import { Button } from '@/presentation/components/ui/button.tsx'
import { PlusIcon } from '@radix-ui/react-icons'
import { useReportsContext } from '../context/reports-context.tsx'

export function ReportsPrimaryButtons() {
  const { setOpen } = useReportsContext()

  return (
    <div className='flex gap-2'>
      <Button
        variant='default'
        size='sm'
        onClick={() => setOpen('add')}
        className='space-x-1'
      >
        <PlusIcon className='size-4' />
        <span>Add Report</span>
      </Button>
    </div>
  )
}
