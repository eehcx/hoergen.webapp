import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { IconBrandGoogle, IconBrandApple } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { signIn, signInWithGoogle } from '@/lib/auth'

// UI components
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

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
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
})

type FormValues = z.infer<typeof formSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  //const { redirect = '/' } = useSearch({ strict: false })
  const search = useSearch({ strict: false }) as { redirect?: string }
  const redirect = search.redirect ?? '/'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    
    try {
      await signIn(values.email, values.password)
      toast.success('Inicio de sesión exitoso')
      
      // Navegar a la ruta de redirección o al dashboard por defecto
      navigate({ to: redirect as string })
    } catch (error: any) {
      // Manejar errores específicos
      let errorMessage = 'Error al iniciar sesión'
      
      // Capturar errores comunes de Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado'
          break
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde'
          break
        case 'auth/invalid-credential':
          errorMessage = 'Credenciales inválidas'
          break
        default:
          errorMessage = error.message || 'Error al iniciar sesión'
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)

    try {
      await signInWithGoogle();
      toast.success('Inicio de sesión con Google exitoso');
      navigate({ to: redirect as string });
    } catch (error: any) {
      let errorMessage = 'Error al iniciar sesión con Google';

      // Manejar errores específicos de Firebase
      switch (error.code) {
        // Errores específicos de Google Auth
        case 'auth/popup-closed-by-user':
          errorMessage = 'Ventana cerrada. Intenta de nuevo'
          break
        case 'auth/cancelled-popup-request':
          errorMessage = 'Operación cancelada'
          break
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Ya existe una cuenta con este email usando otro método de inicio de sesión'
          break
        case 'auth/popup-blocked':
          errorMessage = 'Ventana emergente bloqueada por el navegador'
          break
        case 'auth/unauthorized-domain':
          errorMessage = 'Este dominio no está autorizado para operaciones de autenticación'
          break
        
        // Errores generales que también aplican a Google
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde'
          break
        case 'auth/invalid-credential':
          errorMessage = 'Credenciales inválidas'
          break
        default:
          errorMessage = error.message || 'Error al iniciar sesión con Google'
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'grid gap-3', 
          '[&_button]:rounded-[0.15rem] [&_input]:rounded-[0.15rem]',
          className
        )}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='you@hoergen.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Login
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

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading} onClick={handleGoogleSignIn}>
            <IconBrandGoogle className='h-4 w-4' /> Google
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandApple className='h-4 w-4' /> Apple
          </Button>
        </div>
      </form>
    </Form>
  )
}
