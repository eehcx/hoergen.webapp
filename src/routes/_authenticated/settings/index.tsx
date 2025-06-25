import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import SettingsProfile from '@/features/settings/profile'
import ListenerProfile from '@/features/listener-settings/profile'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsIndexRouter,
})

function SettingsIndexRouter() {
  const { claims } = useAuth()
  
  // Si es admin, muestra el perfil de admin settings
  if (claims?.role === 'admin') {
    return <SettingsProfile />
  }
  
  // Por defecto, muestra perfil para listeners
  return <ListenerProfile />
}
