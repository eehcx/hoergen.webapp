import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useReportsContext } from '../context/reports-context'
import { ReportService } from '@/core/services/reports/report.service'

const reportFormSchema = z.object({
  targetType: z.enum(['user', 'station', 'comment', 'other']),
  targetId: z.string().min(1, 'Target ID is required'),
  reason: z.string().min(1, 'Reason is required'),
  details: z.string().optional(),
  status: z.enum(['pending', 'resolved', 'rejected']),
})

type ReportFormValues = z.infer<typeof reportFormSchema>

export function ReportsActionDialog() {
  const { open, setOpen, currentRow } = useReportsContext()
  const queryClient = useQueryClient()
  const isOpen = open === 'add' || open === 'edit'
  const isEditing = open === 'edit'

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      targetType: 'other',
      targetId: '',
      reason: '',
      details: '',
      status: 'pending',
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: ReportFormValues) => {
      const reportService = ReportService.getInstance()
      return reportService.createReport({
        userId: '', // TODO: Get from auth context
        targetType: data.targetType,
        targetId: data.targetId,
        reason: data.reason,
        details: data.details,
        status: data.status,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      setOpen(null)
      form.reset()
    },
    onError: (error) => {
      console.error('Error creating report:', error)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ReportFormValues> }) => {
      const reportService = ReportService.getInstance()
      return reportService.updateReport(id, {
        targetType: data.targetType,
        targetId: data.targetId,
        reason: data.reason,
        details: data.details,
        status: data.status!,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      setOpen(null)
      form.reset()
    },
    onError: (error) => {
      console.error('Error updating report:', error)
    },
  })

  const onSubmit = async (data: ReportFormValues) => {
    if (isEditing && currentRow) {
      updateMutation.mutate({ id: currentRow.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  // Reset form when dialog opens/closes or currentRow changes
  React.useEffect(() => {
    if (isOpen && currentRow && isEditing) {
      form.reset({
        targetType: currentRow.targetType,
        targetId: currentRow.targetId,
        reason: currentRow.reason,
        details: currentRow.details || '',
        status: currentRow.status,
      })
    } else if (isOpen && !isEditing) {
      form.reset({
        targetType: 'other',
        targetId: '',
        reason: '',
        details: '',
        status: 'pending',
      })
    }
  }, [isOpen, currentRow, isEditing, form])

  const getDialogTitle = () => {
    if (isEditing) return 'Edit Report'
    return 'Add New Report'
  }

  const getDialogDescription = () => {
    if (isEditing) return 'Update the report information.'
    return 'Create a new report in the system.'
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setOpen(null)}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='reason'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input placeholder='Report reason' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='targetType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='user'>User</SelectItem>
                        <SelectItem value='station'>Station</SelectItem>
                        <SelectItem value='comment'>Comment</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='targetId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target ID</FormLabel>
                    <FormControl>
                      <Input placeholder='ID of reported item' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='resolved'>Resolved</SelectItem>
                        <SelectItem value='rejected'>Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='details'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='Additional details about the report...' 
                      className='min-h-[100px]'
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(null)}
              >
                Cancel
              </Button>
              <Button 
                type='submit' 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
