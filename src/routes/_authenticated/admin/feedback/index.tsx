import { createFileRoute } from '@tanstack/react-router'
import Feedback from '@/presentation/features/admin-dashboard/feedback'

export const Route = createFileRoute('/_authenticated/admin/feedback/')({
  component: Feedback,
})