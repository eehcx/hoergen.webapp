import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { useStaticTranslation } from '@/hooks/useTranslation'

export default function SignIn() {
  const { t } = useStaticTranslation()

  return (
    <AuthLayout>
      <Card className='gap-4 rounded-[0.3rem]'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>{t('auth.login')}</CardTitle>
          <CardDescription>
            {t('auth.enterEmailPassword')} <br />
            <Link
              to='/sign-up'
              className='underline hover:text-white'
            >
              {t('auth.signup')}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm/>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className='text-muted-foreground px-8 text-center text-sm'>
            {t('auth.agreeToTerms')}{' '}
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.hoergen.com/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              {t('auth.termsOfService')}
            </a>{' '}
            {t('common.and')}{' '}
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.hoergen.com/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              {t('auth.privacyPolicy')}
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
