import { createFileRoute } from '@tanstack/react-router'
import Reports from '@/features/admin-dashboard/reports'

export const Route = createFileRoute('/_authenticated/admin/reports/')({
  component: Reports,
})