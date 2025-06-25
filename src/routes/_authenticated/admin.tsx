import { createFileRoute, Outlet } from '@tanstack/react-router'
import { RoleGuard } from '@/components/auth/roleGuard'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <RoleGuard roles={['admin']}>
      <div className="container space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage the platform and users
          </p>
        </div>
        <Outlet />
      </div>
    </RoleGuard>
  )
}
