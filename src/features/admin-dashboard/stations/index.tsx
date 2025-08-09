import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  StationsDialogs,
  StationsPrimaryButtons,
  StationsTable,
  StationsTableSkeleton,
} from './components'
import { columns } from './components/stations-columns'
import StationsProvider from './context/stations-context'
import { useStations } from './hooks/useStations'

export default function Stations() {
  const { data: stationList = [], isLoading, error } = useStations()

  return (
    <StationsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Station List</h2>
            <p className='text-muted-foreground'>
              Manage your radio stations and their details here.
            </p>
          </div>
          <StationsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <StationsTableSkeleton />
          ) : error ? (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
              <div className='text-center'>
                <h3 className='text-foreground text-lg font-semibold'>
                  Error loading stations
                </h3>
                <p className='text-muted-foreground mt-2'>
                  There was a problem loading the station data. Please try
                  again.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors'
              >
                Retry
              </button>
            </div>
          ) : stationList.length === 0 ? (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
              <div className='text-center'>
                <h3 className='text-foreground text-lg font-semibold'>
                  No stations found
                </h3>
                <p className='text-muted-foreground mt-2'>
                  There are no stations to display at the moment.
                </p>
              </div>
            </div>
          ) : (
            <StationsTable data={stationList} columns={columns} />
          )}
        </div>
      </Main>

      <StationsDialogs />
    </StationsProvider>
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
    isActive: true,
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
