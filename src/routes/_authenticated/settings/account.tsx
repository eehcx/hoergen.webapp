import { createFileRoute } from '@tanstack/react-router'
import SettingsAccount from '@/presentation/features/settings/account'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: SettingsAccount,
})
