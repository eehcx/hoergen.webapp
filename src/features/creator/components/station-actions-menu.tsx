import {
  IconDotsVertical,
  IconUsers,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react'
import type { ResponseStationDto } from '@/core/types/station.types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface StationActionsMenuProps {
  station: ResponseStationDto
  onEdit: (station: ResponseStationDto) => void
  onDelete: (station: ResponseStationDto) => void
  onManageModerators?: (station: ResponseStationDto) => void
}

export function StationActionsMenu({
  station,
  onEdit,
  onDelete,
  onManageModerators,
}: StationActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full p-2'>
          <IconDotsVertical className='size-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='rounded-none'>
        <DropdownMenuItem
          className='flex cursor-pointer items-center gap-2 rounded-none'
          onClick={() => onEdit(station)}
        >
          <IconEdit size={16} />
          Edit
        </DropdownMenuItem>
        {onManageModerators && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='flex cursor-pointer items-center gap-2 rounded-none'
              onClick={() => onManageModerators(station)}
            >
              <IconUsers size={16} />
              Manage Moderators
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='flex cursor-pointer items-center gap-2 rounded-none'
          variant='destructive'
          onClick={() => onDelete(station)}
        >
          <IconTrash size={16} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
