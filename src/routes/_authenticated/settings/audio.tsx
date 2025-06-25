import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import ListenerAudio from '@/features/listener-settings/audio'

export const Route = createFileRoute('/_authenticated/settings/audio')({
  component: SettingsAudioRouter,
})

function SettingsAudioRouter() {
  const { claims } = useAuth()
  
  // Solo listeners pueden acceder a esta ruta
  if (claims?.role === 'admin') {
    // Redirect admins to their account settings instead
    return <div>Admin audio settings not available</div>
  }
  
  return <ListenerAudio />
}
