import { createFileRoute } from '@tanstack/react-router'
import Browse from '@/presentation/features/listener/browse'

export const Route = createFileRoute('/(guest)/browse/')({
  component: Browse
})