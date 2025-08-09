import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCountriesContext } from '../context/countries-context'

export function CountriesPrimaryButtons() {
  const { setOpen } = useCountriesContext()

  return (
    <div className='flex items-center space-x-2'>
      <Button size='sm' onClick={() => setOpen('add')} className='relative'>
        <Plus className='mr-2 h-4 w-4' />
        Add Country
      </Button>
    </div>
  )
}
