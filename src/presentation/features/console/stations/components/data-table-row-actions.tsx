import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/presentation/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu.tsx'

import { useStationsContext } from '../context/stations-context.tsx'
import type { ResponseStationDto } from '@/core/types/station.types.ts'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { setOpen, setCurrentRow } = useStationsContext()
  const station = row.original as ResponseStationDto

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(station)
            setOpen('edit')
          }}
        >
          Edit Station
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(station)
            setOpen('delete')
          }}
          className='text-red-600'
        >
          Delete Station
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
