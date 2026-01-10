import { createFileRoute } from '@tanstack/react-router'
import Subscriptions from '@/presentation/features/admin-dashboard/subscriptions'

export const Route = createFileRoute('/_authenticated/admin/subscriptions/')({
  component: Subscriptions,
})
