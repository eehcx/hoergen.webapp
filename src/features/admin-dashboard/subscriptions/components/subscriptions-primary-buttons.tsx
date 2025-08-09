import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSubscriptionsContext } from '../context/subscriptions-context'

export function SubscriptionsPrimaryButtons() {
  const { setOpen } = useSubscriptionsContext()

  return (
    <div className='flex items-center space-x-2'>
      <Button size='sm' onClick={() => setOpen('add')} className='relative'>
        <Plus className='mr-2 h-4 w-4' />
        Add Plan
      </Button>
    </div>
  )
}
