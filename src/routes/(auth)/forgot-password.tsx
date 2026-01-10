import { createFileRoute } from '@tanstack/react-router'
import ForgotPassword from '@/presentation/features/auth/forgot-password'

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPassword,
})
