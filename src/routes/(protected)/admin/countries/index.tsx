import { createFileRoute } from '@tanstack/react-router'
import Countries from '@/presentation/features/console/countries'

export const Route = createFileRoute('/(protected)/admin/countries/')({
  component: Countries,
})
