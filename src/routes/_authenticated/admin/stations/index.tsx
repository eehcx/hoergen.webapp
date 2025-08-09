import { createFileRoute } from '@tanstack/react-router'
import Stations from '@/features/admin-dashboard/stations'

export const Route = createFileRoute('/_authenticated/admin/stations/')({
  component: Stations,
})
