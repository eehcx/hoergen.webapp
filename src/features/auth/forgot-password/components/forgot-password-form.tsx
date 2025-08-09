import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/core/firebase'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type ForgotFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
})

export function ForgotPasswordForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {

      // Si el usuario existe, enviar el email de recuperación
      await sendPasswordResetEmail(auth, data.email)
      
      toast.success('Reset email sent! Check your inbox.')
      form.reset()
      
    } catch (error: any) {
      let message = 'Something went wrong. Try again.'
      
      // Manejar errores específicos de Firebase
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Invalid email address.'
          break
        case 'auth/too-many-requests':
          message = 'Too many attempts. Try again later.'
          break
        case 'auth/network-request-failed':
          message = 'Connection error. Check your network.'
          break
      }
      
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder='you@hoergen.com' 
                  className='placeholder:font-[Orbitron] placeholder:tracking-wide' 
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          className='mt-2' 
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? 'Sending...' : 'Send Reset Email'}
        </Button>
      </form>
    </Form>
  )
}
