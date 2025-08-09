import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const reportStatuses = [
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'resolved',
    label: 'Resolved',
  },
  {
    value: 'rejected',
    label: 'Rejected',
  },
]

const reportTypes = [
  {
    value: 'user',
    label: 'User',
  },
  {
    value: 'station',
    label: 'Station',
  },
  {
    value: 'comment',
    label: 'Comment',
  },
  {
    value: 'other',
    label: 'Other',
  },
]

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Filter reports...'
          value={(table.getColumn('reason')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('reason')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title='Status'
            options={reportStatuses}
          />
        )}
        {table.getColumn('targetType') && (
          <DataTableFacetedFilter
            column={table.getColumn('targetType')}
            title='Type'
            options={reportTypes}
          />
        )}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
