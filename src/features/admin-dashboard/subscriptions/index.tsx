import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/subscriptions-columns'
import { SubscriptionsDialogs } from './components/subscriptions-dialogs'
import { SubscriptionsPrimaryButtons } from './components/subscriptions-primary-buttons'
import { SubscriptionsTable } from './components/subscriptions-table'
import { SubscriptionsTableSkeleton } from './components/subscriptions-skeleton'
import { useProducts } from './hooks'
import SubscriptionsProvider from './context/subscriptions-context'

export default function Subscriptions() {
  const { data: productsList = [], isLoading, error } = useProducts()

  // Debug: Ver la estructura real de los datos
  console.log('🔍 productsList:', productsList)
  if (productsList.length > 0) {
    console.log('🔍 Primer producto:', productsList[0])
    console.log('🔍 Prices del primer producto:', productsList[0]?.prices)
  }

  return (
    <SubscriptionsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Subscription Plans</h2>
            <p className='text-muted-foreground'>
              Manage subscription plans and pricing from Stripe here.
            </p>
          </div>
          <SubscriptionsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <SubscriptionsTableSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">Error loading subscription plans</h3>
                <p className="text-muted-foreground mt-2">
                  There was a problem loading the subscription data. Please try again.
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : productsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">No subscription plans found</h3>
                <p className="text-muted-foreground mt-2">
                  There are no subscription plans to display at the moment.
                </p>
              </div>
            </div>
          ) : (
            <SubscriptionsTable data={productsList} columns={columns} />
          )}
        </div>
      </Main>

      <SubscriptionsDialogs />
    </SubscriptionsProvider>
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
    isActive: true,
    disabled: false,
  },
]