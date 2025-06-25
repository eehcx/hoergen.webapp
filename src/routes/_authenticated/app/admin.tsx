import { createFileRoute, Outlet } from '@tanstack/react-router'
import { RoleGuard } from '@/components/auth/roleGuard'

export const Route = createFileRoute('/_authenticated/app/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <RoleGuard roles={['admin']}>
      <Outlet />
    </RoleGuard>
  )
}
