import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStationsContext } from '../context/stations-context'

export function StationsPrimaryButtons() {
  const { setOpen } = useStationsContext()

  return (
    <div className='flex items-center space-x-2'>
      <Button
        size='sm'
        onClick={() => setOpen('add')}
        className='relative'
      >
        <Plus className='mr-2 h-4 w-4' />
        Add Station
      </Button>
    </div>
  )
}
