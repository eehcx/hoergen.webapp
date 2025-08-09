import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import type { ResponseStationDto } from '@/core/types/station.types'
import { getFlagEmojiFromIsoCode } from '@/utils/flagUtils'

function isFirebaseTimestamp(obj: any): obj is { _seconds: number; _nanoseconds: number } {
  return obj && typeof obj === 'object' && typeof obj._seconds === 'number' && typeof obj._nanoseconds === 'number';
}

// Extiende el DTO para la tabla, agregando genreNames solo para UI
export type StationTableRow = ResponseStationDto & {
  genreNames?: string[]
}

export const columns: ColumnDef<StationTableRow>[] = [
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
      <DataTableColumnHeader column={column} title='Station Name' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center space-x-3'>
        {row.original.coverImage && (
          <img 
            src={row.original.coverImage} 
            alt={row.getValue('name')} 
            className='w-8 h-8 rounded object-cover'
          />
        )}
        <LongText className='max-w-48 font-medium'>{row.getValue('name')}</LongText>
      </div>
    ),
    meta: { className: 'w-64' },
  },
  {
    accessorKey: 'streamUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stream URL' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64 text-sm text-muted-foreground font-mono'>
        {row.getValue('streamUrl')}
      </LongText>
    ),
  },
  {
    accessorKey: 'countryId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Country' />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className='text-xs flex items-center gap-1'>
        <span>{getFlagEmojiFromIsoCode(row.getValue('countryId'))}</span>
        <span>{row.getValue('countryId')}</span>
      </Badge>
    ),
  },
  {
    accessorKey: 'genreNames',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Genres' />
    ),
    cell: ({ row }) => {
      const genreNames = row.original.genreNames as string[] | undefined
      return (
        <div className='flex flex-wrap gap-1'>
          {genreNames && genreNames.length > 0
            ? genreNames.slice(0, 3).map((name, index) => (
                <Badge key={index} variant="secondary" className='text-xs'>
                  {name}
                </Badge>
              ))
            : <span className='text-muted-foreground text-sm'>-</span>
          }
          {genreNames && genreNames.length > 3 && (
            <Badge variant="outline" className='text-xs'>
              +{genreNames.length - 3}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'favoritesCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Favorites' />
    ),
    cell: ({ row }) => (
      <div className='text-center font-mono text-sm'>
        {row.getValue('favoritesCount') || 0}
      </div>
    ),
  },
  {
    accessorKey: 'liveInfo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Live Info' />
    ),
    cell: ({ row }) => {
      const liveInfo = row.getValue('liveInfo') as string
      return liveInfo ? (
        <LongText className='max-w-32 text-sm text-muted-foreground'>
          {liveInfo}
        </LongText>
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
