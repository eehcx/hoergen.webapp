import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useGenresContext } from '../context/genres-context'

export function GenresPrimaryButtons() {
  const { setOpen } = useGenresContext()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setOpen('add')} size='sm' className='h-8'>
        <Plus className='mr-2 h-4 w-4' />
        Add Genre
      </Button>
    </div>
  )
}
