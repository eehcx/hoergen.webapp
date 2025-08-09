import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCountriesContext } from '../context/countries-context'
import type { CountryResponseDto } from '@/core/types/country.types'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { setOpen, setCurrentRow } = useCountriesContext()
  const country = row.original as CountryResponseDto

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
            setCurrentRow(country)
            setOpen('edit')
          }}
        >
          Edit Country
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(country)
            setOpen('delete')
          }}
          className='text-red-600'
        >
          Delete Country
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
