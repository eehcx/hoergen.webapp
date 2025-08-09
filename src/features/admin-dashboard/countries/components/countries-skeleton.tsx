import { Skeleton } from '@/components/ui/skeleton'

export function CountriesTableSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-48' />
        </div>
        <Skeleton className='h-9 w-24' />
      </div>
      <div className='rounded-md border'>
        <div className='flex items-center space-x-4 border-b p-4'>
          <Skeleton className='h-4 w-4' />
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-20' />
        </div>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className='flex items-center space-x-4 border-b p-4 last:border-b-0'>
            <Skeleton className='h-4 w-4' />
            <div className='flex items-center space-x-2'>
              <Skeleton className='h-6 w-6' />
              <div className='space-y-1'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-24' />
              </div>
            </div>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-8 w-8' />
          </div>
        ))}
      </div>
    </div>
  )
}
