import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import type { ResponseFeedbackDto } from '@/core/types'
import { 
  IconDeviceLaptop,
  IconDeviceMobile,
  IconBrandApple
} from '@tabler/icons-react'
import { DataTableRowActions } from './data-table-row-actions'

function isFirebaseTimestamp(obj: any): obj is { _seconds: number; _nanoseconds: number } {
  return obj && typeof obj === 'object' && typeof obj._seconds === 'number' && typeof obj._nanoseconds === 'number';
}

const platformIcons = {
  'web': IconDeviceLaptop,
  'android': IconDeviceMobile,
  'ios': IconBrandApple
}

const platformColors = {
  'web': 'bg-blue-100 text-blue-800 border-blue-300',
  'android': 'bg-green-100 text-green-800 border-green-300',
  'ios': 'bg-gray-100 text-gray-800 border-gray-300'
}

export const columns: ColumnDef<ResponseFeedbackDto>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'message',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Message' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64 font-medium'>{row.getValue('message') || 'No message'}</LongText>
    ),
  },
  {
    accessorKey: 'appPlatform',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Platform' />
    ),
    cell: ({ row }) => {
      const platform = row.getValue('appPlatform') as keyof typeof platformIcons
      const Icon = platformIcons[platform] || IconDeviceLaptop // Fallback icon
      const colorClass = platformColors[platform] || 'bg-gray-100 text-gray-800 border-gray-300' // Fallback
      
      return (
        <div className='flex items-center space-x-2'>
          <Icon className='h-4 w-4 text-muted-foreground' />
          <Badge variant='outline' className={colorClass}>
            {platform ? platform.toUpperCase() : 'UNKNOWN'}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      const email = row.getValue('email') as string | undefined
      return (
        <div className='w-fit text-nowrap'>
          {email || <span className='text-muted-foreground'>Not provided</span>}
        </div>
      )
    },
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User ID' />
    ),
    cell: ({ row }) => {
      const userId = row.getValue('userId') as string | undefined
      return (
        <div className='w-fit text-nowrap font-mono text-sm'>
          {userId || <span className='text-muted-foreground'>Anonymous</span>}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt')
      let date: Date
      
      if (isFirebaseTimestamp(createdAt)) {
        date = new Date(createdAt._seconds * 1000)
      } else if (createdAt instanceof Date) {
        date = createdAt
      } else {
        return <span className='text-muted-foreground'>Invalid date</span>
      }

      return (
        <div className='w-fit text-nowrap'>
          {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
