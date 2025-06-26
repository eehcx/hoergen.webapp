import { createFileRoute } from '@tanstack/react-router'
import Browse from '@/features/browse'

export const Route = createFileRoute('/_authenticated/browse')({
  component: Browse
})