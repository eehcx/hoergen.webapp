import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/presentation/components/layout/admin-layout'

export const Route = createFileRoute('/(protected)/admin')({
  component: AdminLayout,
})
