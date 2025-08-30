import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ModerationScoresOverview,
  //MessageStatesDistribution,
} from './components'
import { useChatsPlatformAnalytics } from './hooks'
import { useStaticTranslation } from '@/hooks/useTranslation'

export function AnalyticsModeration() {
  const { data: analytics, isLoading } = useChatsPlatformAnalytics()
  const { t } = useStaticTranslation()

  const getSafetyGrade = (toxicityScore: number) => {
    if (toxicityScore < 0.3)
      return { grade: 'A', color: '#10b981', label: t('analytics.moderation.excellent') }
    if (toxicityScore < 0.5)
      return { grade: 'B', color: '#f59e0b', label: t('analytics.moderation.good') }
    if (toxicityScore < 0.7)
      return { grade: 'C', color: '#ef4444', label: t('analytics.moderation.fair') }
    return { grade: 'D', color: '#dc2626', label: t('analytics.moderation.poor') }
  }

  const safetyInfo = analytics?.averageScores?.TOXICITY
    ? getSafetyGrade(analytics.averageScores.TOXICITY)
    : { grade: 'N/A', color: '#6b7280', label: t('analytics.moderation.unknown') }

  return (
    <>
      {/* Main Statistics Cards */}
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='rounded-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('analytics.moderation.totalMessages')}
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {isLoading
                ? '...'
                : (analytics?.totalMessages?.toLocaleString() ?? '0')}
            </div>
            <p className='text-muted-foreground text-xs'>
              {t('analytics.moderation.acrossTotalChats').replace('{count}', (analytics?.totalChats ?? 0).toString())}
            </p>
          </CardContent>
        </Card>

        <Card className='rounded-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('analytics.moderation.moderationCoverage')}
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-500'>
              {isLoading
                ? '...'
                : `${analytics?.percentageWithModeration?.toFixed(1) ?? '0'}%`}
            </div>
            <p className='text-muted-foreground text-xs'>
              {t('analytics.moderation.messagesScanned').replace('{count}', (analytics?.messagesWithModeration ?? 0).toString())}
            </p>
          </CardContent>
        </Card>

        <Card className='rounded-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('analytics.moderation.safetyGrade')}</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
            </svg>
          </CardHeader>
          <CardContent>
            <div
              className='text-2xl font-bold'
              style={{ color: safetyInfo.color }}
            >
              {isLoading ? '...' : safetyInfo.grade}
            </div>
            <p className='text-muted-foreground text-xs'>
              {t('analytics.moderation.safetyRating').replace('{grade}', isLoading ? '...' : safetyInfo.label)}
            </p>
          </CardContent>
        </Card>

        <Card className='rounded-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('analytics.moderation.activeChats')}</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-500'>
              {isLoading ? '...' : (analytics?.chatsWithMessages ?? '0')}
            </div>
            <p className='text-muted-foreground text-xs'>
              {t('analytics.moderation.messagesPerChat').replace('{count}', analytics?.averageMessagesPerChat?.toFixed(1) ?? '0')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 gap-4'>
        <Card className='col-span-1 rounded-none'>
          <CardHeader>
            <CardTitle>{t('analytics.moderation.moderationScores')}</CardTitle>
            <CardDescription>
              {t('analytics.moderation.averageToxicityScores')}
            </CardDescription>
          </CardHeader>
          <CardContent className='pl-2'>
            <ModerationScoresOverview />
          </CardContent>
        </Card>

        {/* 
        <Card className='col-span-1 rounded-none lg:col-span-3'>
          <CardHeader>
            <CardTitle>{t('analytics.moderation.messageStatusDistribution')}</CardTitle>
            <CardDescription>
              {t('analytics.moderation.currentStateModeratedMessages')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MessageStatesDistribution />
          </CardContent>
        </Card>
        */}
      </div>

      {/* Additional Statistics
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Card className='rounded-none'>
          <CardHeader>
            <CardTitle className='text-lg'>{t('analytics.moderation.systemActions')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div>
                <p className='font-medium'>{t('analytics.moderation.messagesFlaggedBySystem')}</p>
                <p className='text-muted-foreground text-sm'>
                  {t('analytics.moderation.automaticallyDetectedIssues')}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-2xl font-bold text-red-500'>
                  {isLoading ? '...' : (analytics?.flaggedBySystemCount ?? '0')}
                </p>
                <p className='text-muted-foreground text-xs'>{t('analytics.moderation.flags')}</p>
              </div>
            </div>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div>
                <p className='font-medium'>{t('analytics.moderation.humanReviewed')}</p>
                <p className='text-muted-foreground text-sm'>
                  {t('analytics.moderation.manuallyReviewedMessages')}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-2xl font-bold text-blue-500'>
                  {isLoading ? '...' : (analytics?.reviewedCount ?? '0')}
                </p>
                <p className='text-muted-foreground text-xs'>{t('analytics.moderation.reviews')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-none'>
          <CardHeader>
            <CardTitle className='text-lg'>{t('analytics.moderation.messageStatesBreakdown')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {Object.entries(analytics?.stateDistribution ?? {}).map(
              ([state, count]) => {
                const getStateColor = (state: string) => {
                  switch (state) {
                    case 'approved':
                      return 'text-green-500'
                    case 'pending':
                      return 'text-yellow-500'
                    case 'hidden':
                      return 'text-red-500'
                    case 'deleted':
                      return 'text-gray-500'
                    default:
                      return 'text-gray-400'
                  }
                }

                const getStateIcon = (state: string) => {
                  switch (state) {
                    case 'approved':
                      return (
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                      )
                    case 'pending':
                      return (
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      )
                    case 'hidden':
                      return (
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                          />
                        </svg>
                      )
                    case 'deleted':
                      return (
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      )
                    default:
                      return null
                  }
                }

                return (
                  <div
                    key={state}
                    className='flex items-center justify-between rounded border p-2'
                  >
                    <div className='flex items-center space-x-2'>
                      <span className={getStateColor(state)}>
                        {getStateIcon(state)}
                      </span>
                      <span className='font-medium capitalize'>{state}</span>
                    </div>
                    <span className={`font-bold ${getStateColor(state)}`}>
                      {isLoading ? '...' : count}
                    </span>
                  </div>
                )
              }
            )}
          </CardContent>
        </Card>
        </div>*/}
    </>
  )
}
