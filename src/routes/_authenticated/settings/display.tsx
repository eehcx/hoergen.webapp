import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import SettingsDisplay from '@/features/settings/display'

export const Route = createFileRoute('/_authenticated/settings/display')({
  component: SettingsDisplayRouter,
})

function SettingsDisplayRouter() {
  const { claims } = useAuth()
  
  // Solo admins pueden acceder a esta ruta
  if (claims?.role !== 'admin') {
    return <div>Access denied. Admin only.</div>
  }
  
  return <SettingsDisplay />
}
