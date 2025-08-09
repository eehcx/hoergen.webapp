import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function GenresTableSkeleton() {
  return (
    <div className='space-y-4'>
      {/* Toolbar skeleton */}
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          <Skeleton className='h-8 w-[250px]' />
          <Skeleton className='h-8 w-[70px]' />
        </div>
        <Skeleton className='h-8 w-[70px]' />
      </div>

      {/* Table skeleton */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>
                <Skeleton className='h-4 w-[50px]' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-[100px]' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-[150px]' />
              </TableHead>
              <TableHead className='text-right'>
                <Skeleton className='h-4 w-[50px] ml-auto' />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className='h-4 w-[50px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[100px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[150px]' />
                </TableCell>
                <TableCell className='text-right'>
                  <Skeleton className='h-8 w-[70px] ml-auto' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className='flex items-center justify-between px-2'>
        <Skeleton className='h-4 w-[100px]' />
        <div className='flex items-center space-x-6 lg:space-x-8'>
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-8 w-[70px]' />
          </div>
          <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
            <Skeleton className='h-4 w-[100px]' />
          </div>
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-8' />
          </div>
        </div>
      </div>
    </div>
  )
}
