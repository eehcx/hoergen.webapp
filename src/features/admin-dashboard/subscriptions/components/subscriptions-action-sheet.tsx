import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { ProductService } from '@/core/services/products/product.service'
import { ProductWithPrice, ProductWithPriceResponse } from '@/core/types/product.types'
import { UserRole } from '@/core/types/user.types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { useCountryCurrencies } from '../hooks'
useCountryCurrencies

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ProductWithPriceResponse | null // <-- Usar el DTO de response
}

const recurringIntervals = ['month', 'year', 'quarter', 'week']
const accessLevels = ['1', '2', '3', '4']
const roles: UserRole[] = ['listener', 'pro', 'creator', 'moderator', 'admin']

export function SubscriptionsActionSheet({ open, onOpenChange, currentRow }: Props) {
  const isEdit = !!currentRow
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, watch, setValue } = useForm<ProductWithPrice>({
    defaultValues: currentRow
      ? {
          product: {
            name: currentRow.name,
            description: currentRow.description,
            images: currentRow.images,
            metadata: {
              accessLevel: Number(currentRow.stripe_metadata_access_level),
              createdFrom: currentRow.stripe_metadata_created_from,
              features: currentRow.stripe_metadata_features,
            },
            status: currentRow.active ? 'active' : 'inactive',
          },
          price: (() => {
            const activePrice = currentRow.prices?.find(p => p.active)
            return activePrice
              ? {
                  type: activePrice.type,
                  currency: activePrice.currency,
                  unitAmount: activePrice.unit_amount,
                  recurringInterval: activePrice.interval,
                  intervalCount: activePrice.interval_count,
                  metadata: activePrice.metadata,
                }
              : {
                  type: 'recurring',
                  currency: 'mxn',
                  unitAmount: 0,
                  recurringInterval: 'month',
                  intervalCount: 1,
                  metadata: { role: 'listener', accessLevel: 1 },
                }
          })(),
        }
      : {
          product: {
            name: '',
            description: '',
            images: [],
            metadata: { accessLevel: 1, createdFrom: 'web', features: '' },
            status: 'active',
          },
          price: {
            type: 'recurring',
            currency: 'mxn',
            unitAmount: 0,
            recurringInterval: 'month',
            intervalCount: 1,
            metadata: { role: 'listener', accessLevel: 1 },
          },
        },
  })

  // Forzar createdFrom a 'web' siempre
  useEffect(() => {
    setValue('product.metadata.createdFrom', 'web')
  }, [setValue])

  const [tab, setTab] = useState('product')
  const { data: currencies = [], isLoading: loadingCurrencies } = useCountryCurrencies()

  // Set default currency to MXN if available
  useEffect(() => {
    if (currencies.length > 0 && !watch('price.currency')) {
      const defaultCurrency = currencies.includes('mxn') ? 'mxn' : (currencies.includes('MXN') ? 'MXN' : currencies[0])
      setValue('price.currency', defaultCurrency)
    }
  }, [currencies, setValue, watch])

  useEffect(() => {
    if (currentRow) {
      // Mapear el response a ProductWithPrice antes de reset
      const mapped: ProductWithPrice = {
        product: {
          name: currentRow.name,
          description: currentRow.description,
          images: currentRow.images,
          metadata: {
            accessLevel: Number(currentRow.stripe_metadata_access_level),
            createdFrom: currentRow.stripe_metadata_created_from,
            features: currentRow.stripe_metadata_features,
          },
          status: currentRow.active ? 'active' : 'inactive',
        },
        price: (() => {
          const activePrice = currentRow.prices?.find(p => p.active)
          return activePrice
            ? {
                type: activePrice.type,
                currency: activePrice.currency,
                unitAmount: activePrice.unit_amount,
                recurringInterval: activePrice.interval,
                intervalCount: activePrice.interval_count,
                metadata: activePrice.metadata,
              }
            : {
                type: 'recurring',
                currency: 'mxn',
                unitAmount: 0,
                recurringInterval: 'month',
                intervalCount: 1,
                metadata: { role: 'listener', accessLevel: 1 },
              }
        })(),
      }
      reset(mapped)
    } else {
      reset({
        product: {
          name: '',
          description: '',
          images: [],
          metadata: { accessLevel: 1, createdFrom: 'web', features: '' },
          status: 'active',
        },
        price: {
          type: 'recurring',
          currency: 'mxn',
          unitAmount: 0,
          recurringInterval: 'month',
          intervalCount: 1,
          metadata: { role: 'listener', accessLevel: 1 },
        },
      })
    }
  }, [currentRow, reset])

  // Sincronizar accessLevel de price con el de product
  useEffect(() => {
    setValue('price.metadata.accessLevel', watch('product.metadata.accessLevel') ?? 1)
  }, [watch('product.metadata.accessLevel'), setValue])

  const onSubmit = async (data: ProductWithPrice) => {
    try {
      if (!isEdit) {
        await ProductService.getInstance().create(data)
      } else if (tab === 'product' && currentRow) {
        await ProductService.getInstance().update(currentRow.id, data.product)
      } else if (tab === 'price' && currentRow) {
        const activePrice = currentRow.prices?.find(p => p.active)
        if (activePrice) {
          await ProductService.getInstance().updatePrice(activePrice.product, data.price.metadata)
        }
      }
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col h-full p-0'>
        <SheetHeader className='px-6 pt-6'>
          <SheetTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</SheetTitle>
          <SheetDescription>
            {isEdit ? 'Update the product details and pricing below.' : 'Fill out the product information and set its price.'}
          </SheetDescription>
        </SheetHeader>
        <Tabs value={tab} onValueChange={setTab} className='flex-1 flex flex-col overflow-hidden px-6'>
          <TabsList className='mb-4 w-full flex justify-center rounded-none border-b border-border'>
            <TabsTrigger value='product' className='rounded-none'>Product</TabsTrigger>
            <TabsTrigger value='price' className='rounded-none'>Price</TabsTrigger>
          </TabsList>
          <div className='flex-1 overflow-y-auto pb-24'>
            <TabsContent value='product'>
              <form className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>Product Name</label>
                  <Input {...register('product.name')} placeholder='E.g. Pro Plan, Creator Plan' required />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Description</label>
                  <Textarea {...register('product.description')} placeholder='Describe the product features, target users, etc.' />
                </div>
                {/* El campo Created From es automático y no editable */}
                <input type='hidden' {...register('product.metadata.createdFrom')} value='web' />
                <div>
                  <label className='block text-sm font-medium mb-1'>Features (comma separated)</label>
                  <Input {...register('product.metadata.features')} placeholder='E.g. analytics, support, integrations' />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Access Level</label>
                  <SelectDropdown
                    value={String(watch('product.metadata.accessLevel'))}
                    onValueChange={val => setValue('product.metadata.accessLevel', Number(val))}
                    items={accessLevels.map(lvl => ({ label: `Level ${lvl}`, value: lvl }))}
                    placeholder='Select access level'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Status</label>
                  <SelectDropdown
                    value={watch('product.status')}
                    onValueChange={val => setValue('product.status', val)}
                    items={[{ label: 'Active (visible)', value: 'active' }, { label: 'Inactive (hidden)', value: 'inactive' }]}
                    placeholder='Select status'
                  />
                </div>
              </form>
            </TabsContent>
            <TabsContent value='price'>
              <form className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>Amount</label>
                  <Input {...register('price.unitAmount')} type='number' placeholder='E.g. 9.99' required />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Currency</label>
                  <SelectDropdown
                    value={watch('price.currency')}
                    onValueChange={val => setValue('price.currency', val)}
                    items={currencies.map(cur => ({ label: cur.toUpperCase(), value: cur }))}
                    placeholder={loadingCurrencies ? 'Loading...' : 'Select currency'}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Recurring Interval</label>
                  <SelectDropdown
                    value={watch('price.recurringInterval')}
                    onValueChange={val => setValue('price.recurringInterval', val)}
                    items={recurringIntervals.map(interval => ({ label: interval.charAt(0).toUpperCase() + interval.slice(1), value: interval }))}
                    placeholder='Select interval'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Interval Count</label>
                  <Input {...register('price.intervalCount')} type='number' placeholder='E.g. 1 (every month)' />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Role (who can buy this price)</label>
                  <SelectDropdown
                    value={watch('price.metadata.role')}
                    onValueChange={val => setValue('price.metadata.role', val as UserRole)}
                    items={roles.map(role => ({ label: role.charAt(0).toUpperCase() + role.slice(1), value: role }))}
                    placeholder='Select role'
                  />
                </div>
              </form>
            </TabsContent>
          </div>
        </Tabs>
        <div className='sticky bottom-0 left-0 w-full bg-background px-6 py-4 border-t flex justify-between items-center'>
          <div>
            <h3 className='font-bold'>Preview</h3>
            <p>{watch('product.name')} - {watch('price.unitAmount')}{watch('price.currency')}</p>
          </div>
          <Button type='button' onClick={handleSubmit(onSubmit)}>
            {isEdit ? (tab === 'product' ? 'Save Product' : 'Save Price') : 'Add product'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
