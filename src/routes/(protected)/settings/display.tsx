import { createFileRoute } from '@tanstack/react-router'
import SettingsDisplay from '@/presentation/features/settings/display'

export const Route = createFileRoute('/(protected)/settings/display')({
  component: SettingsDisplay,
})
