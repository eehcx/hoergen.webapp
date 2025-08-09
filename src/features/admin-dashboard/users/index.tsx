import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import { UsersTableSkeleton } from './components/users-skeleton'
import { useUsers } from './hooks'
import UsersProvider from './context/users-context'

export default function Users() {
  const { data: userList = [], isLoading, error } = useUsers()

  return (
    <UsersProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <UsersTableSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">Error loading users</h3>
                <p className="text-muted-foreground mt-2">
                  There was a problem loading the user data. Please try again.
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : userList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">No users found</h3>
                <p className="text-muted-foreground mt-2">
                  There are no users to display at the moment.
                </p>
              </div>
            </div>
          ) : (
            <UsersTable data={userList} columns={columns} />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
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
