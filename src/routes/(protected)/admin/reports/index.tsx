import { createFileRoute } from '@tanstack/react-router'
import Reports from '@/presentation/features/console/reports'

export const Route = createFileRoute('/(protected)/admin/reports/')({
  component: Reports,
})