import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandGoogle } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/core/firebase'
import { signIn } from '@/lib/auth'
import { UserService } from '@/core/services/users/user.service'
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
import { PasswordInput } from '@/components/password-input'

type SignUpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z
  .object({
    displayName: z
      .string()
      .min(1, { message: 'Please enter your display name' })
      .min(2, { message: 'Display name must be at least 2 characters long' }),
    email: z
      .string()
      .min(1, { message: 'Please enter your email' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(1, {
        message: 'Please enter your password',
      })
      .min(7, {
        message: 'Password must be at least 7 characters long',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const userService = UserService.getInstance()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // 1. Registrar usuario con endpoint tradicional (Auth + Firestore)
      await userService.registerUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        photoURL: '',
        role: 'listener',
        plan: 'free'
      })

      // 2. Login manual después del registro
      await signIn(data.email, data.password)

      toast.success('Account created successfully')
      navigate({ to: '/' })

    } catch (error: any) {
      console.error('Sign-Up Error:', error)
      
      let errorMessage = 'Error creating account'
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered'
          break
        case 'auth/weak-password':
          errorMessage = 'Password is too weak'
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address'
          break
        default:
          errorMessage = error.message || 'Error creating account'
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignUp() {
    setIsLoading(true)
    try {
      // 1. Autenticación con Google
      const userCredential = await signInWithPopup(auth, googleProvider)
      const user = userCredential.user

      // 2. Registrar en Firestore usando Firebase SDK
      await userService.registerUserFirestore({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      })

      // 3. Establecer custom claims
      await userService.updateClaims(user.uid, {
        role: 'listener',
        plan: 'free'
      })

      toast.success('Account created successfully with Google')
      navigate({ to: '/' })

    } catch (error: any) {
      console.error('Google Sign-Up Error:', error)
      
      let errorMessage = 'Error creating account with Google'
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-up cancelled'
          break
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked by browser'
          break
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Account already exists with different login method'
          break
        default:
          errorMessage = error.message || 'Error creating account with Google'
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='displayName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Type your username' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>              
              <FormControl>
                <Input placeholder='you@hoergen.com' className='placeholder:font-[Orbitron] placeholder:tracking-wide' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Create Account
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1'>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
            onClick={handleGoogleSignUp}
          >
            <IconBrandGoogle className='h-4 w-4' /> 
            Google
          </Button>
        </div>
      </form>
    </Form>
  )
}
