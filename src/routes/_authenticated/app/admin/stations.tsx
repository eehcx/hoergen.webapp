import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app/admin/stations')({
  component: AdminStationsPage,
})

function AdminStationsPage() {
  return (
    <div className="container space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Manage Stations</h1>
        <p className="text-muted-foreground">
          Administer radio stations across the platform
        </p>
      </div>
      
      <div className="rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Station Management</h3>
        <p className="text-muted-foreground">Station administration features will be implemented here.</p>
      </div>
    </div>
  )
}
