import { createFileRoute } from '@tanstack/react-router'
import Browse from '@/features/listener/browse'

export const Route = createFileRoute('/_authenticated/browse/')({
  component: Browse
})