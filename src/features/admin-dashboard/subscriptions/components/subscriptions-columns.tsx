import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import type { ProductWithPriceResponse } from '@/core/types/product.types'

export const columns: ColumnDef<ProductWithPriceResponse>[] = [
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
	},
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Product Name' />,
		cell: ({ row }) => <span>{row.original.name}</span>,
	},
	{
		accessorKey: 'description',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
		cell: ({ row }) => <LongText>{row.original.description}</LongText>,
	},
	{
		accessorKey: 'stripe_metadata_access_level',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Access Level' />,
		cell: ({ row }) => <Badge>{row.original.stripe_metadata_access_level}</Badge>,
	},
	{
		accessorKey: 'active',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
		cell: ({ row }) => <Badge>{row.original.active ? 'Active' : 'Inactive'}</Badge>,
	},
	{
		id: 'price',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
		cell: ({ row }) => {
			const price = row.original.prices?.[0]
			return price
				? `${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()}`
				: '—'
		},
	},
	{
		id: 'interval',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Interval' />,
		cell: ({ row }) => {
			const price = row.original.prices?.[0]
			return price?.interval ?? '—'
		},
	},
	{
		id: 'role',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
		cell: ({ row }) => {
			const price = row.original.prices?.[0]
			return price?.metadata?.role ?? '—'
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
]
