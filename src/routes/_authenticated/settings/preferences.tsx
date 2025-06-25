import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import ListenerPreferences from '@/features/listener-settings/preferences'

export const Route = createFileRoute('/_authenticated/settings/preferences')({
  component: SettingsPreferencesRouter,
})

function SettingsPreferencesRouter() {
  const { claims } = useAuth()
  
  // Solo listeners pueden acceder a esta ruta
  if (claims?.role === 'admin') {
    // Redirect admins to their account settings instead
    return <div>Admin preferences not available</div>
  }
  
  return <ListenerPreferences />
}
