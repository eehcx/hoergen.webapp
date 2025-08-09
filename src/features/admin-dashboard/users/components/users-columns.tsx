import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { userRoleIcons } from '../data/userRoleIcons'
import type { UserResponseDto, UserRole } from '@/core/types/user.types'
import { callTypes } from '../utils/callTypes'

function isFirebaseTimestamp(obj: any): obj is { _seconds: number; _nanoseconds: number } {
  return obj && typeof obj === 'object' && typeof obj._seconds === 'number' && typeof obj._nanoseconds === 'number';
}

// Define los posibles status según el DTO real
/*const userStatusOptions = [
  'active',
  'inactive',
  'banned',
] as const*/

export const columns: ColumnDef<UserResponseDto>[] = [
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
    accessorKey: 'displayName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('displayName')}</LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      // El status real está en claims, si existe
      const status = (row.original.claims as any)?.status || row.getValue('status')
      const badgeColor = callTypes.get(status)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {status}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      // El status real está en claims
      const status = (row.original.claims as any)?.status || row.getValue(id)
      return value.includes(status)
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt')
      let d: Date | null = null
      if (!date) return null
      if (date instanceof Date) {
        d = date
      } else if (typeof date === 'string') {
        d = new Date(date)
      } else if (isFirebaseTimestamp(date)) {
        d = new Date(date._seconds * 1000)
      }
      return d ? <span className='text-xs text-muted-foreground'>{d.toLocaleDateString()}</span> : null
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      // El role real está en claims
      const role = (row.original.claims as any)?.role as UserRole || row.getValue('role')
      const roleData = userRoleIcons[role]
      return (
        <div className='flex items-center gap-x-2'>
          {roleData?.icon && (
            <roleData.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-sm capitalize'>{roleData?.label || role}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const role = (row.original.claims as any)?.role as UserRole || row.getValue(id)
      return value.includes(role)
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'plan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Plan' />
    ),
    cell: ({ row }) => {
      // El plan real está en claims
      const plan = (row.original.claims as any)?.plan || row.getValue('plan')
      return (
        <span className='text-sm capitalize'>{plan}</span>
      )
    },
    filterFn: (row, id, value) => {
      const plan = (row.original.claims as any)?.plan || row.getValue(id)
      return value.includes(plan)
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: (ctx) => <DataTableRowActions row={ctx.row} />, // Fix for correct row prop
  },
]
