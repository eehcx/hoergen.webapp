import { createFileRoute } from '@tanstack/react-router'
import SettingsNotifications from '@/presentation/features/settings/notifications'

export const Route = createFileRoute('/(protected)/settings/notifications')({
  component: SettingsNotifications,
})