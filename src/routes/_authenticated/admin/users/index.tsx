import { createFileRoute } from '@tanstack/react-router'
import Users from '@/presentation/features/admin-dashboard/users'

export const Route = createFileRoute('/_authenticated/admin/users/')({
  component: Users,
})