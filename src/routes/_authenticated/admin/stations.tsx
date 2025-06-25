import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/stations')({
  component: AdminStationsPage,
})

function AdminStationsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Station Management</h2>
      <div className="rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Manage Stations</h3>
        <p className="text-muted-foreground">Station administration features will be implemented here.</p>
      </div>
    </div>
  )
}
