import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app/admin/analytics')({
  component: AdminAnalyticsPage,
})

function AdminAnalyticsPage() {
  return (
    <div className="container space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Platform analytics and insights
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">Active Stations</h3>
          <p className="text-3xl font-bold">567</p>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">Total Listens</h3>
          <p className="text-3xl font-bold">45.6K</p>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold">$12.3K</p>
        </div>
      </div>
    </div>
  )
}
