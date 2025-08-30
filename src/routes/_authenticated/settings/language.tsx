import { createFileRoute } from '@tanstack/react-router'
import SettingsLanguage from '@/features/settings/language'

export const Route = createFileRoute('/_authenticated/settings/language')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SettingsLanguage />
}
