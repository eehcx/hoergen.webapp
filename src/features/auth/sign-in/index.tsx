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

export default function SignIn() {
  return (
    <AuthLayout>
      <Card className='gap-4 rounded-[0.3rem]'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Login</CardTitle>
          <CardDescription>
            Enter your email and password below to <br />
            log into your account or {' '}
            <Link
              to='/sign-up'
              className='underline hover:text-white'
            >
              Sign Up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm/>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking login, you agree to our{' '}
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.hoergen.com/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.hoergen.com/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
