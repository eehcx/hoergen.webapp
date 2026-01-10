import { createFileRoute } from '@tanstack/react-router'
import Genres from '@/presentation/features/admin-dashboard/genres'

export const Route = createFileRoute('/_authenticated/admin/genres/')({
  component: Genres,
})
