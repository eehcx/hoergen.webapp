import { createFileRoute } from '@tanstack/react-router'
import AdminDashboard from '@/presentation/features/console'

export const Route = createFileRoute('/(protected)/admin/')({
  component: AdminDashboard,
})
