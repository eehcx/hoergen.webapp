import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/_authenticated/app/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user, claims } = useAuth()
  
  return (
    <div className="container space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {user?.displayName || 'User'}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Badge variant="secondary">{claims?.role || 'listener'}</Badge>
              </div>
            </div>
            
            <div className="pt-4">
              <Button>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Your listening stats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">24</div>
                <div className="text-xs text-muted-foreground">Stations Played</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">12h</div>
                <div className="text-xs text-muted-foreground">Total Listen Time</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">8</div>
                <div className="text-xs text-muted-foreground">Favorites</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-muted-foreground">Subscriptions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">Change Password</Button>
              <Button variant="outline">Download Data</Button>
              <Button variant="outline">Privacy Settings</Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
