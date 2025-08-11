import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { IconBrandGoogle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { signIn, signInWithGoogle } from '@/lib/auth'
import { useTranslation } from 'react-i18next'

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

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  //const { redirect = '/' } = useSearch({ strict: false })
  const search = useSearch({ strict: false }) as { redirect?: string }
  const redirect = search.redirect ?? '/'

  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: t('forms.validation.pleaseEnterEmail') })
      .email({ message: t('forms.validation.invalidEmail') }),
    password: z
      .string()
      .min(1, {
        message: t('forms.validation.pleaseEnterPassword'),
      })
      .min(7, {
        message: t('forms.validation.passwordTooShort'),
      }),
  })

  type FormValues = z.infer<typeof formSchema>

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
      toast.success(t('auth.loginSuccess'))
      
      // Navigate to redirect route or dashboard by default
      navigate({ to: redirect as string })
    } catch (error: any) {
      // Manejar errores específicos
      let errorMessage = t('auth.loginError')
      
      // Capturar errores comunes de Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = t('auth.userNotFound')
          break
        case 'auth/wrong-password':
          errorMessage = t('auth.wrongPassword')
          break
        case 'auth/too-many-requests':
          errorMessage = t('auth.tooManyRequests')
          break
        case 'auth/invalid-credential':
          errorMessage = t('auth.invalidCredentials')
          break
        default:
          errorMessage = error.message || t('auth.loginError')
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
      toast.success(t('auth.googleLoginSuccess'));
      navigate({ to: redirect as string });
    } catch (error: any) {
      let errorMessage = t('auth.googleLoginError');

      // Manejar errores específicos de Firebase
      switch (error.code || error.name) {
        // Errores específicos de Google Auth
        case 'auth/popup-closed-by-user':
          errorMessage = t('auth.popupClosedByUser')
          break
        case 'auth/cancelled-popup-request':
          errorMessage = t('auth.operationCancelled')
          break
        case 'auth/account-exists-with-different-credential':
          errorMessage = t('auth.accountExistsWithDifferentCredential')
          break
        case 'auth/popup-blocked':
          errorMessage = t('auth.popupBlocked')
          break
        case 'auth/unauthorized-domain':
          errorMessage = t('auth.unauthorizedDomain')
          break
        case 'auth/user-not-registered':
          errorMessage = t('auth.userNotRegistered')
          break
        
        // Errores generales que también aplican a Google
        case 'auth/too-many-requests':
          errorMessage = t('auth.tooManyRequests')
          break
        case 'auth/invalid-credential':
          errorMessage = t('auth.invalidCredentials')
          break
        default:
          errorMessage = error.message || t('auth.googleLoginError')
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
          className
        )}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.email')}</FormLabel>
              <FormControl>
                <Input placeholder={t('auth.emailPlaceholder')} className='placeholder:font-[Orbitron] placeholder:tracking-wide' {...field} />
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
              <FormLabel>{t('common.password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder={t('auth.passwordPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                {t('auth.forgotPassword')}
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {t('common.login')}
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              {t('auth.orContinueWith')}
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1'>
          <Button variant='outline' type='button' disabled={isLoading} onClick={handleGoogleSignIn}>
            <IconBrandGoogle className='h-4 w-4' /> {t('auth.google')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
