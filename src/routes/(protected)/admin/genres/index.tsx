import { createFileRoute } from '@tanstack/react-router'
import Genres from '@/presentation/features/console/genres'

export const Route = createFileRoute('/(protected)/admin/genres/')({
  component: Genres,
})
