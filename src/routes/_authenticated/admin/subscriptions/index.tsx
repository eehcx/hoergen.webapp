import { createFileRoute } from '@tanstack/react-router'
import Subscriptions from '@/features/admin-dashboard/subscriptions'

export const Route = createFileRoute('/_authenticated/admin/subscriptions/')({
  component: Subscriptions,
})
