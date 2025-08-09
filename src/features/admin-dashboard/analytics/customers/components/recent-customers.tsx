import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useCustomers } from '../hooks'

export function RecentCustomers() {
  const { data, isLoading } = useCustomers()

  // Helper to get initials from email
  function getInitials(email: string) {
    return email ? email.slice(0, 2).toUpperCase() : 'CU'
  }

  return (
    <div className='space-y-8'>
      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex items-center gap-4'>
              <Skeleton className='h-9 w-9 rounded-full' />
              <div className='flex flex-1 flex-wrap items-center justify-between'>
                <div className='space-y-1'>
                  <Skeleton className='h-4 w-32 mb-2' />
                  <Skeleton className='h-3 w-40' />
                </div>
                <Skeleton className='h-4 w-16' />
              </div>
            </div>
          ))
        : data?.map((customer: any) => (
            <div key={customer.id} className='flex items-center gap-4'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src={`/avatars/${customer.id}.png`} alt='Avatar' />
                <AvatarFallback>{getInitials(customer.email)}</AvatarFallback>
              </Avatar>
              <div className='flex flex-1 flex-wrap items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm leading-none font-medium'>
                    {customer.email}
                  </p>
                  <a
                    href={customer.stripeLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-muted-foreground text-xs underline hover:text-primary'
                  >
                    Stripe dashboard
                  </a>
                </div>
                {/* You can show more info here if available */}
              </div>
            </div>
          ))}
    </div>
  )
}
