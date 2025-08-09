import { createFileRoute } from '@tanstack/react-router'
import Countries from '@/features/admin-dashboard/countries'

export const Route = createFileRoute('/_authenticated/admin/countries/')({
  component: Countries,
})
