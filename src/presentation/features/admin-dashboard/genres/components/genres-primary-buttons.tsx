import { Plus } from 'lucide-react'

import { Button } from '@/presentation/components/ui/button.tsx'
import { useGenresContext } from '../context/genres-context.tsx'

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
