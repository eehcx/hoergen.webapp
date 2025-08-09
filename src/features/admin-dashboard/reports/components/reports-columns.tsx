import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import type { ResponseReportDto } from '@/core/types'
import { 
  IconFlag,
  IconUser,
  IconRadio,
  IconMessageCircle
} from '@tabler/icons-react'

function isFirebaseTimestamp(obj: any): obj is { _seconds: number; _nanoseconds: number } {
  return obj && typeof obj === 'object' && typeof obj._seconds === 'number' && typeof obj._nanoseconds === 'number';
}

const reportTypeIcons = {
  'user': IconUser,
  'station': IconRadio,
  'comment': IconMessageCircle,
  'other': IconFlag
}

const reportStatusColors = {
  'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'resolved': 'bg-green-100 text-green-800 border-green-300',
  'rejected': 'bg-red-100 text-red-800 border-red-300'
}

export const columns: ColumnDef<ResponseReportDto>[] = [
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
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
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
    accessorKey: 'reason',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reason' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 font-medium'>{row.getValue('reason') || 'No reason provided'}</LongText>
    ),
    meta: { className: 'w-48' },
  },
  {
    accessorKey: 'targetType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Target Type' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('targetType') as keyof typeof reportTypeIcons
      const Icon = reportTypeIcons[type] || IconFlag // Fallback icon
      return (
        <div className='flex items-center space-x-2'>
          <Icon className='h-4 w-4 text-muted-foreground' />
          <span className='capitalize'>{type}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof reportStatusColors
      const colorClass = reportStatusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300' // Fallback
      return (
        <Badge variant='outline' className={cn('capitalize', colorClass)}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'details',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Details' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('details') || 'No details provided'}</LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'targetId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Target ID' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap font-mono text-sm'>{row.getValue('targetId') || 'N/A'}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date | { _seconds: number; _nanoseconds: number }
      
      let displayDate: Date
      if (isFirebaseTimestamp(date)) {
        displayDate = new Date(date._seconds * 1000)
      } else {
        displayDate = new Date(date)
      }

      return (
        <div className='w-fit text-nowrap'>
          {displayDate.toLocaleDateString()}
        </div>
      )
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    meta: {
      className: cn(
        'sticky right-0 z-10 rounded-tr',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
