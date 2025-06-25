import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import SettingsAccount from '@/features/settings/account'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: SettingsAccountRouter,
})

function SettingsAccountRouter() {
  const { claims } = useAuth()
  
  // Solo admins pueden acceder a esta ruta
  if (claims?.role !== 'admin') {
    return <div>Access denied. Admin only.</div>
  }
  
  return <SettingsAccount />
}
