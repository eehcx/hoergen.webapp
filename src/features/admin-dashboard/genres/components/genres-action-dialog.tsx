'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { GenreService } from '@/core/services/genres/genre.service'
import type { CreateGenreDto, GenreResponseDto } from '@/core/types/genre.types'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  canonicalName: z.string().min(1, { message: 'Canonical name is required.' }),
  aliases: z.string().optional(),
  tags: z.string().optional(),
  searchTerms: z.string().optional(),
})

type GenreForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: GenreResponseDto
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GenresActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const queryClient = useQueryClient()
  
  const form = useForm<GenreForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      canonicalName: '',
      aliases: '',
      tags: '',
      searchTerms: '',
    },
  })

  useEffect(() => {
    if (currentRow && isEdit) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description,
        canonicalName: currentRow.canonicalName,
        aliases: currentRow.aliases?.join(', ') || '',
        tags: currentRow.tags?.join(', ') || '',
        searchTerms: currentRow.searchTerms?.join(', ') || '',
      })
    } else {
      form.reset({
        name: '',
        description: '',
        canonicalName: '',
        aliases: '',
        tags: '',
        searchTerms: '',
      })
    }
  }, [currentRow, isEdit, form])

  const onSubmit = async (values: GenreForm) => {
    try {
      const dto: CreateGenreDto = {
        name: values.name,
        description: values.description,
        canonicalName: values.canonicalName,
        aliases: values.aliases ? values.aliases.split(',').map(s => s.trim()).filter(Boolean) : [],
        tags: values.tags ? values.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        searchTerms: values.searchTerms ? values.searchTerms.split(',').map(s => s.trim()).filter(Boolean) : [],
      }

      if (isEdit && currentRow) {
        await GenreService.getInstance().updateGenre(currentRow.id, dto)
      } else {
        await GenreService.getInstance().createGenre(dto)
      }

      // Invalidate queries to refetch data
      await queryClient.invalidateQueries({ queryKey: ['genres'] })
      
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving genre:', error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset()
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit Genre' : 'Add New Genre'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the genre here. ' : 'Create new genre here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='genre-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Rock'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Rock music genre description...'
                        className='col-span-4 min-h-[80px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='canonicalName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Canonical Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='rock'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='aliases'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Aliases
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='rock music, rock and roll'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tags'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Tags
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='music, rock, genre'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='searchTerms'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Search Terms
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='rock, hard rock, classic rock'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='genre-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
