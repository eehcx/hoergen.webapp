import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search } from '@/components/search'
import { Footer } from '@/components/footer'

export default function AdminPanel() {
  return (
    <>
      <Header>
        <h1 className="text-xl font-semibold">Administration Panel</h1>
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Welcome, Administrator!</h2>
            <p className="text-muted-foreground">
              Manage the Hörgen platform from the main control panel
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350</div>
                <p className="text-xs text-muted-foreground">
                  +180 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Creators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">
                  +23 this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  -2 since yesterday
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 mt-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Administrative Actions</CardTitle>
                <CardDescription>
                  Main management tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-left">
                    Manage Users
                  </button>
                  <button className="px-4 py-2 border rounded-md text-left">
                    Review Content
                  </button>
                  <button className="px-4 py-2 border rounded-md text-left">
                    System Settings
                  </button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>New user registered</span>
                    <span className="text-muted-foreground">5 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Content flagged for review</span>
                    <span className="text-muted-foreground">12 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Station created</span>
                    <span className="text-muted-foreground">1 hour ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creator verified</span>
                    <span className="text-muted-foreground">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
      <Footer />
    </>
  )
}
