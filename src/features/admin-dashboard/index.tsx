import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  AnalyticsCustomers,
  AnalyticsReports,
  AnalyticsStations,
  AnalyticsModeration,
} from './analytics'

export default function AdminDashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Analytics</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='customers'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList className='rounded-none'>
              <TabsTrigger value='customers' className='rounded-none'>
                Customers
              </TabsTrigger>
              <TabsTrigger value='reports' className='rounded-none'>
                Reports
              </TabsTrigger>
              <TabsTrigger value='stations' className='rounded-none'>
                Stations
              </TabsTrigger>
              <TabsTrigger value='moderation' className='rounded-none'>
                Moderation
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='customers' className='space-y-4'>
            <AnalyticsCustomers />
          </TabsContent>
          <TabsContent value='reports' className='space-y-4'>
            <AnalyticsReports />
          </TabsContent>
          <TabsContent value='stations' className='space-y-4'>
            <AnalyticsStations />
          </TabsContent>
          <TabsContent value='moderation' className='space-y-4'>
            <AnalyticsModeration />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: '/admin',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Radios',
    href: '/admin/stations',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Moderation',
    href: '/creator',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Subscriptions',
    href: '/admin/subscriptions',
    isActive: false,
    disabled: false,
  },
]
