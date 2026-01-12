import { createFileRoute } from '@tanstack/react-router'
import Subscriptions from '@/presentation/features/console/subscriptions'

export const Route = createFileRoute('/(protected)/admin/subscriptions/')({
  component: Subscriptions,
})
