import { useSubscriptionsContext } from '../context/subscriptions-context.tsx'
import { SubscriptionsActionSheet } from './subscriptions-action-sheet.tsx'
import { SubscriptionsDeleteDialog } from './subscriptions-delete-dialog.tsx'
import type { ProductWithPriceResponse } from '@/core/types/product.types.ts'

export function SubscriptionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSubscriptionsContext()
  return (
    <>
      <SubscriptionsActionSheet
        key='subscription-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <SubscriptionsActionSheet
            key={`subscription-edit-${currentRow.name ?? ''}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow as ProductWithPriceResponse}
          />

          <SubscriptionsDeleteDialog
            key={`subscription-delete-${currentRow.name ?? ''}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow as ProductWithPriceResponse}
          />
        </>
      )}
    </>
  )
}
