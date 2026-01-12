import { createFileRoute } from '@tanstack/react-router'
import Stations from '@/presentation/features/console/stations'

export const Route = createFileRoute('/(protected)/admin/stations/')({
  component: Stations,
})
