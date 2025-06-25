import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search } from '@/components/search'
import { Footer } from '@/components/footer'

export default function CreatorPanel() {
  
  return (
    <>
      <Header>
        <h1 className="text-xl font-semibold">Creator Panel</h1>
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Welcome, Creator!</h2>
            <p className="text-muted-foreground">
              Manage your radio stations and create amazing content
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  +1 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Listeners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,204</div>
                <p className="text-xs text-muted-foreground">
                  +15% desde la semana pasada
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Content Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45.2h</div>
                <p className="text-xs text-muted-foreground">
                  +2.1h this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$324</div>
                <p className="text-xs text-muted-foreground">
                  +8% since last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your content and stations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                    New Station
                  </button>
                  <button className="px-4 py-2 border rounded-md">
                    Upload Content
                  </button>
                  <button className="px-4 py-2 border rounded-md">
                    View Statistics
                  </button>
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
