import { Header } from '@/presentation/components/layout/header.tsx'
import { Main } from '@/presentation/components/layout/main.tsx'
import { TopNav } from '@/presentation/components/layout/top-nav.tsx'
import { ProfileDropdown } from '@/presentation/components/profile-dropdown.tsx'
import { Search } from '@/presentation/components/search.tsx'
import { ThemeSwitch } from '@/presentation/components/theme-switch.tsx'
import { columns } from './components/feedback-columns.tsx'
import { FeedbackDialogs } from './components/feedback-dialogs.tsx'
import { FeedbackPrimaryButtons } from './components/feedback-primary-buttons.tsx'
import { FeedbackTable } from './components/feedback-table.tsx'
import { FeedbackTableSkeleton } from './components/feedback-skeleton.tsx'
import { useFeedback } from './hooks/index.ts'
import FeedbackProvider from './context/feedback-context.tsx'

export default function Feedback() {
  const { data: feedbackList = [], isLoading, error } = useFeedback()

  return (
    <FeedbackProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Feedback List</h2>
            <p className='text-muted-foreground'>
              Manage user feedback and feature requests here.
            </p>
          </div>
          <FeedbackPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <FeedbackTableSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">Error loading feedback</h3>
                <p className="text-muted-foreground mt-2">
                  There was a problem loading the feedback data. Please try again.
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
            <FeedbackTable columns={columns} data={feedbackList} />
          )}
        </div>
      </Main>
      <FeedbackDialogs />
    </FeedbackProvider>
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
