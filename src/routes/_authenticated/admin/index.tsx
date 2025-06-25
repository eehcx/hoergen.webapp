import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { IconRadio, IconUsers, IconChartBar } from '@tabler/icons-react'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconRadio className="h-5 w-5" />
            Stations Management
          </CardTitle>
          <CardDescription>
            Manage radio stations, approve new submissions, and moderate content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/admin/stations">
            <Button className="w-full">Manage Stations</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            View and manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/admin/users">
            <Button className="w-full">Manage Users</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconChartBar className="h-5 w-5" />
            Analytics
          </CardTitle>
          <CardDescription>
            View platform statistics, user engagement, and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/admin/analytics">
            <Button className="w-full">View Analytics</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
