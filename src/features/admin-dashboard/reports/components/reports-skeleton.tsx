import { Skeleton } from '@/components/ui/skeleton'

export function ReportsTableSkeleton() {
  return (
    <div className='space-y-4'>
      {/* Toolbar skeleton */}
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          <Skeleton className='h-8 w-[250px]' />
          <Skeleton className='h-8 w-[100px]' />
          <Skeleton className='h-8 w-[100px]' />
          <Skeleton className='h-8 w-[100px]' />
        </div>
        <Skeleton className='h-8 w-[70px]' />
      </div>

      {/* Table skeleton */}
      <div className='rounded-md border'>
        <div className='p-4'>
          {/* Header skeleton */}
          <div className='flex space-x-4 pb-4'>
            <Skeleton className='h-4 w-[50px]' />
            <Skeleton className='h-4 w-[200px]' />
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[150px]' />
            <Skeleton className='h-4 w-[150px]' />
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[50px]' />
          </div>

          {/* Rows skeleton */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='flex space-x-4 py-3'>
              <Skeleton className='h-4 w-[50px]' />
              <Skeleton className='h-4 w-[200px]' />
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-4 w-[150px]' />
              <Skeleton className='h-4 w-[150px]' />
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-4 w-[50px]' />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className='flex items-center justify-between'>
        <Skeleton className='h-8 w-[200px]' />
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-8 w-[70px]' />
          <Skeleton className='h-8 w-[100px]' />
          <Skeleton className='h-8 w-[70px]' />
        </div>
      </div>
    </div>
  )
}
