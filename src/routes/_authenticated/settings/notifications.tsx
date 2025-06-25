import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import SettingsNotifications from '@/features/settings/notifications'

export const Route = createFileRoute('/_authenticated/settings/notifications')({
  component: SettingsNotificationsRouter,
})

function SettingsNotificationsRouter() {
  const { claims } = useAuth()
  
  // Solo admins pueden acceder a esta ruta
  if (claims?.role !== 'admin') {
    return <div>Access denied. Admin only.</div>
  }
  
  return <SettingsNotifications />
}
