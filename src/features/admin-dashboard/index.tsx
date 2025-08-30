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
import { useStaticTranslation } from '@/hooks/useTranslation'

export default function AdminDashboard() {
  const { t } = useStaticTranslation()

  const topNav = [
    {
      title: t('admin.overview'),
      href: '/admin',
      isActive: true,
      disabled: false,
    },
    {
      title: t('admin.radios'),
      href: '/admin/stations',
      isActive: false,
      disabled: false,
    },
    {
      title: t('admin.moderation'),
      href: '/creator',
      isActive: false,
      disabled: false,
    },
    {
      title: t('admin.subscriptions'),
      href: '/admin/subscriptions',
      isActive: false,
      disabled: false,
    },
  ]

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
          <h1 className='text-2xl font-bold tracking-tight'>{t('admin.analytics')}</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='customers'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList className='rounded-none'>
              <TabsTrigger value='customers' className='rounded-none'>
                {t('admin.customers')}
              </TabsTrigger>
              <TabsTrigger value='reports' className='rounded-none'>
                {t('admin.reports')}
              </TabsTrigger>
              <TabsTrigger value='stations' className='rounded-none'>
                {t('admin.stations')}
              </TabsTrigger>
              <TabsTrigger value='moderation' className='rounded-none'>
                {t('admin.moderation')}
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
