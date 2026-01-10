import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/presentation/components/layout/admin-layout'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminLayout,
})
