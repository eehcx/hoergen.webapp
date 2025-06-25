import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import Settings from '@/features/settings'
import ListenerSettings from '@/features/listener-settings'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsRouter,
})

function SettingsRouter() {
  const { claims } = useAuth()
  
  // Si es admin, muestra el panel de admin settings
  if (claims?.role === 'admin') {
    return <Settings />
  }
  
  // Por defecto, muestra settings para listeners
  return <ListenerSettings />
}
