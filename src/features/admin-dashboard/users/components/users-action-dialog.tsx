'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { userRoleIcons } from '../data/userRoleIcons'
import { UserService } from '@/core/services/users/user.service'
import type { CreateUserDto, UpdateUserDto, UserRole, UserStatus, UserResponseDto, PlanType } from '@/core/types/user.types'
import { toast } from 'sonner'

const formSchema = z
  .object({
    displayName: z.string().min(1, { message: 'Display Name is required.' }),
    photoURL: z.string().optional(),
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Email is invalid.' }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, { message: 'Role is required.' }),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    status: z.string().optional(),
    plan: z.string().min(1, { message: 'Plan is required.' }),
    isEdit: z.boolean(),
  })
  .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
    // Solo validar password si no estamos editando O si estamos editando y se proporcionó password
    if (!isEdit) {
      if (password === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required.',
          path: ['password'],
        })
      }
    }

    // Si se proporcionó password (crear o editar), validar formato
    if (password !== '') {
      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must be at least 8 characters long.',
          path: ['password'],
        })
      }

      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one lowercase letter.',
          path: ['password'],
        })
      }

      if (!password.match(/[A-Z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one uppercase letter.',
          path: ['password'],
        })
      }

      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one number.',
          path: ['password'],
        })
      }

      if (!password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one special character (!@#$%^&*...).',
          path: ['password'],
        })
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
          path: ['confirmPassword'],
        })
      }
    }
  })
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: UserResponseDto
  open: boolean
  onOpenChange: (open: boolean) => void
}

const allRoles: UserRole[] = ['listener', 'pro', 'creator', 'moderator', 'admin']
const allStatus: UserStatus[] = ['active', 'inactive', 'banned']
const allPlans: PlanType[] = ['free', 'pro', 'creator']

const getPasswordValidationStatus = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      photoURL: '',
      email: '',
      role: '',
      status: 'active',
      plan: 'free',
      password: '',
      confirmPassword: '',
      isEdit,
    },
  })

  // Resetear formulario cuando cambia currentRow
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        displayName: currentRow.displayName,
        photoURL: currentRow.photoURL || '',
        email: currentRow.email,
        role: currentRow.claims?.role ?? '',
        status: currentRow.status,
        plan: currentRow.claims?.plan ?? 'free',
        password: '',
        confirmPassword: '',
        isEdit: true,
      })
    } else {
      form.reset({
        displayName: '',
        photoURL: '',
        email: '',
        role: '',
        status: 'active',
        plan: 'free',
        password: '',
        confirmPassword: '',
        isEdit: false,
      })
    }
  }, [currentRow, isEdit, form])

  const onSubmit = async (values: UserForm) => {
    console.log('Form submitted with values:', values)
    try {
      if (isEdit && currentRow) {
        // Validar status
        const validStatuses = allStatus
        let statusValue = values.status
        console.log('Original status value:', statusValue)
        console.log('Valid statuses:', validStatuses)
        
        if (!statusValue || !validStatuses.includes(statusValue as UserStatus)) {
          console.log('Status is invalid, setting to active')
          statusValue = 'active'
        }
        
        console.log('Final status value:', statusValue)
        
        // Actualizar usuario existente
        const dto: UpdateUserDto = {
          displayName: values.displayName,
          role: values.role as UserRole,
          plan: values.plan as PlanType,
          status: statusValue as UserStatus,
        }
        console.log('Updating user with DTO:', dto)
        console.log('Request URL:', `${currentRow.id}`)
        console.log('Request body as JSON:', JSON.stringify(dto))
        await UserService.getInstance().updateUser(currentRow.id, dto)
        toast.success('Usuario actualizado correctamente')
        onOpenChange(false)
      } else {
        // Crear nuevo usuario
        const dto: CreateUserDto = {
          email: values.email,
          password: values.password,
          displayName: values.displayName,
          photoURL: values.photoURL || '',
          role: values.role as UserRole,
          plan: values.plan as PlanType,
        }
        console.log('Creating user with DTO:', dto)
        await UserService.getInstance().registerUser(dto)
        toast.success('Usuario registrado correctamente')
        form.reset()
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Error al registrar/actualizar usuario')
      console.error('Error al registrar/actualizar usuario:', error)
    }
  }

  const passwordValue = form.watch('password')
  const passwordValidation = getPasswordValidationStatus(passwordValue || '')
  const showPasswordRequirements = !!passwordValue && passwordValue.length > 0
  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          // Solo resetear cuando se cierra el modal
          form.reset()
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='displayName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Display Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
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
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Role
                    </FormLabel>
                    <SelectDropdown
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a role'
                      className='col-span-4'
                      items={allRoles.map((role) => ({
                        label: userRoleIcons[role]?.label ?? role,
                        value: role,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='plan'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Plan
                    </FormLabel>
                    <SelectDropdown
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a plan'
                      className='col-span-4'
                      items={allPlans.map((plan) => ({
                        label: plan.charAt(0).toUpperCase() + plan.slice(1),
                        value: plan,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {/* STATUS SELECT SOLO EN EDICIÓN */}
              {isEdit && (
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-right'>
                        Status
                      </FormLabel>
                      <SelectDropdown
                        value={field.value || ''}
                        onValueChange={field.onChange}
                        placeholder='Select a status'
                        className='col-span-4'
                        items={allStatus.map((status) => ({
                          label: status.charAt(0).toUpperCase() + status.slice(1),
                          value: status,
                        }))}
                      />
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Password
                    </FormLabel>
                    <div className='col-span-4 space-y-2'>
                      <FormControl>
                        <PasswordInput
                          placeholder='e.g., S3cur3P@ssw0rd'
                          {...field}
                        />
                      </FormControl>
                      {showPasswordRequirements && (
                        <div className='text-xs space-y-1'>
                          <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                            <span className='w-2 h-2 rounded-full bg-current'></span>
                            At least 8 characters
                          </div>
                          <div className={`flex items-center gap-2 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                            <span className='w-2 h-2 rounded-full bg-current'></span>
                            At least one lowercase letter
                          </div>
                          <div className={`flex items-center gap-2 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                            <span className='w-2 h-2 rounded-full bg-current'></span>
                            At least one uppercase letter
                          </div>
                          <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                            <span className='w-2 h-2 rounded-full bg-current'></span>
                            At least one number
                          </div>
                          <div className={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                            <span className='w-2 h-2 rounded-full bg-current'></span>
                            At least one special character (!@#$%...)
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <Button 
                type='submit' 
                className='w-full'
              >
                Save changes
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
