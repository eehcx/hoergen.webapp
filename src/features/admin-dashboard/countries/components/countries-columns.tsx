import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import type { CountryResponseDto } from '@/core/types/country.types'

function isFirebaseTimestamp(obj: any): obj is { _seconds: number; _nanoseconds: number } {
  return obj && typeof obj === 'object' && typeof obj._seconds === 'number' && typeof obj._nanoseconds === 'number';
}

export const columns: ColumnDef<CountryResponseDto>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Country Name' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center space-x-3'>
        <div className='text-xl'>{row.original.isoCode}</div>
        <div>
          <LongText className='max-w-48 font-medium'>{row.getValue('name')}</LongText>
          <div className='text-sm text-muted-foreground'>{row.original.localName}</div>
        </div>
      </div>
    ),
    meta: { className: 'w-64' },
  },
  {
    accessorKey: 'continent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Continent' />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className='text-xs'>
        {row.getValue('continent')}
      </Badge>
    ),
  },
  {
    accessorKey: 'capital',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Capital' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.getValue('capital')}</span>
    ),
  },
  {
    accessorKey: 'stationCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stations' />
    ),
    cell: ({ row }) => (
      <div className='text-center font-mono text-sm'>
        {row.getValue('stationCount') || 0}
      </div>
    ),
  },
  {
    accessorKey: 'languages',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Languages' />
    ),
    cell: ({ row }) => {
      const languages = row.getValue('languages') as string[]
      return (
        <div className='flex flex-wrap gap-1'>
          {languages?.slice(0, 2).map((lang, index) => (
            <Badge key={index} variant="secondary" className='text-xs'>
              {lang}
            </Badge>
          ))}
          {languages?.length > 2 && (
            <Badge variant="outline" className='text-xs'>
              +{languages.length - 2}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt')
      let date: Date | null = null
      
      if (createdAt instanceof Date) {
        date = createdAt
      } else if (typeof createdAt === 'string') {
        date = new Date(createdAt)
      } else if (isFirebaseTimestamp(createdAt)) {
        date = new Date(createdAt._seconds * 1000)
      }
      
      return date ? (
        <div className='text-sm text-muted-foreground'>
          {date.toLocaleDateString()}
        </div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    id: 'actions',
    meta: {
      className: cn(
        'sticky right-0 z-10 bg-background transition-colors duration-200',
        'group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
