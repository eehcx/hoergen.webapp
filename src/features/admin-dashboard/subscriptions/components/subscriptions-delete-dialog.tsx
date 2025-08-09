'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Input } from '@/components/ui/input'
import type { ProductWithPriceResponse } from '@/core/types/product.types'
import { ProductService } from '@/core/services/products/product.service'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: ProductWithPriceResponse
}

export function SubscriptionsDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')
  const queryClient = useQueryClient()

  const getName = () => {
    return currentRow.name || ''
  }

  const handleDelete = async () => {
    if (value.trim() !== getName()) return
    try {
      await ProductService.getInstance().delete(currentRow.name)
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      setValue('')
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting subscription:', error)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          setValue('')
        }
        onOpenChange(state)
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== getName()}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{' '}
          Delete Subscription
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{String(getName())}</span>?
            <br />
            This action will permanently remove the subscription plan and all its associated data.
          </p>
          <div className=''>
            <Label htmlFor='delete-confirm' className='mb-5'>Name:</Label>
            <Input
              id='delete-confirm'
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={getName()}
              autoFocus
            />
          </div>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
