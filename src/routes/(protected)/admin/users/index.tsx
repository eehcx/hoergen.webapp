import { createFileRoute } from '@tanstack/react-router'
import Users from '@/presentation/features/console/users'

export const Route = createFileRoute('/(protected)/admin/users/')({
  component: Users,
})