import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import type { GenreResponseDto } from '@/core/types/genre.types'

function isFirebaseTimestamp(obj: any): obj is { _seconds: number; _nanoseconds: number } {
  return obj && typeof obj === 'object' && typeof obj._seconds === 'number' && typeof obj._nanoseconds === 'number';
}

export const columns: ColumnDef<GenreResponseDto>[] = [
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
      <DataTableColumnHeader column={column} title='Genre Name' />
    ),
    cell: ({ row }) => (
      <div>
        <LongText className='max-w-48 font-medium'>{row.getValue('name')}</LongText>
        <div className='text-sm text-muted-foreground'>{row.original.canonicalName}</div>
      </div>
    ),
    meta: { className: 'w-48' },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64 text-sm text-muted-foreground'>
        {row.getValue('description')}
      </LongText>
    ),
  },
  {
    accessorKey: 'aliases',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Aliases' />
    ),
    cell: ({ row }) => {
      const aliases = row.getValue('aliases') as string[]
      return (
        <div className='flex flex-wrap gap-1'>
          {aliases?.slice(0, 3).map((alias, index) => (
            <Badge key={index} variant="secondary" className='text-xs'>
              {alias}
            </Badge>
          ))}
          {aliases?.length > 3 && (
            <Badge variant="outline" className='text-xs'>
              +{aliases.length - 3}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'tags',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tags' />
    ),
    cell: ({ row }) => {
      const tags = row.getValue('tags') as string[]
      return (
        <div className='flex flex-wrap gap-1'>
          {tags?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className='text-xs'>
              {tag}
            </Badge>
          ))}
          {tags?.length > 2 && (
            <Badge variant="outline" className='text-xs'>
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'searchTerms',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Search Terms' />
    ),
    cell: ({ row }) => {
      const searchTerms = row.getValue('searchTerms') as string[]
      return searchTerms?.length > 0 ? (
        <div className='flex flex-wrap gap-1'>
          {searchTerms.slice(0, 2).map((term, index) => (
            <Badge key={index} variant="outline" className='text-xs'>
              {term}
            </Badge>
          ))}
          {searchTerms.length > 2 && (
            <Badge variant="outline" className='text-xs'>
              +{searchTerms.length - 2}
            </Badge>
          )}
        </div>
      ) : (
        <span className='text-muted-foreground text-sm'>-</span>
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
