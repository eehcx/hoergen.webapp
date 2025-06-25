import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import SettingsAppearance from '@/features/settings/appearance'

export const Route = createFileRoute('/_authenticated/settings/appearance')({
  component: SettingsAppearanceRouter,
})

function SettingsAppearanceRouter() {
  const { claims } = useAuth()
  
  // Solo admins pueden acceder a esta ruta
  if (claims?.role !== 'admin') {
    return <div>Access denied. Admin only.</div>
  }
  
  return <SettingsAppearance />
}
