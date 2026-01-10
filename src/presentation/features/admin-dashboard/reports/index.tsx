import { Header } from '@/presentation/components/layout/header.tsx'
import { Main } from '@/presentation/components/layout/main.tsx'
import { TopNav } from '@/presentation/components/layout/top-nav.tsx'
import { ProfileDropdown } from '@/presentation/components/profile-dropdown.tsx'
import { Search } from '@/presentation/components/search.tsx'
import { ThemeSwitch } from '@/presentation/components/theme-switch.tsx'
import { columns } from './components/reports-columns.tsx'
import { ReportsDialogs } from './components/reports-dialogs.tsx'
import { ReportsPrimaryButtons } from './components/reports-primary-buttons.tsx'
import { ReportsTable } from './components/reports-table.tsx'
import { ReportsTableSkeleton } from './components/reports-skeleton.tsx'
import { useReports } from './hooks'
import ReportsProvider from './context/reports-context.tsx'

export default function Reports() {
  const { data: reportsList = [], isLoading, error } = useReports()

  return (
    <ReportsProvider>
      <Header fixed>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Reports List</h2>
            <p className='text-muted-foreground'>
              Manage user reports and moderation issues here.
            </p>
          </div>
          <ReportsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <ReportsTableSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">Error loading reports</h3>
                <p className="text-muted-foreground mt-2">
                  There was a problem loading the reports data. Please try again.
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <ReportsTable columns={columns} data={reportsList} />
          )}
        </div>
      </Main>
      <ReportsDialogs />
    </ReportsProvider>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: '/admin',
    isActive: false,
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