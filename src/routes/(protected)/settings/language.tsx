import { createFileRoute } from '@tanstack/react-router'
import SettingsLanguage from '@/presentation/features/settings/language'

export const Route = createFileRoute('/(protected)/settings/language')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SettingsLanguage />
}
