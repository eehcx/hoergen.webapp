import { createFileRoute } from '@tanstack/react-router'
import Feedback from '@/presentation/features/console/feedback'

export const Route = createFileRoute('/(protected)/admin/feedback/')({
  component: Feedback,
})