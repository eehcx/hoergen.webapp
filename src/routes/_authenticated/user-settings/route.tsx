import { createFileRoute } from '@tanstack/react-router'
import { RoleGuard } from '@/components/auth/roleGuard'
import ListenerSettings from '@/features/listener-settings'

export const Route = createFileRoute('/_authenticated/user-settings')({
  component: UserSettingsLayout,
})

function UserSettingsLayout() {
  return (
    <RoleGuard roles={['listener']}>
      <ListenerSettings />
    </RoleGuard>
  )
}
