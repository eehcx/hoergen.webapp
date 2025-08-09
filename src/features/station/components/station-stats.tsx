import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalyticsByStation, useChatAnalytics } from '../hooks/useStations'

export function StationStats({
  stationId,
  chatId,
}: {
  stationId: string
  chatId: string | null
}) {
  const { data, isLoading } = useAnalyticsByStation(stationId)
  const { data: chatAnalytics, isLoading: isChatAnalyticsLoading } =
    useChatAnalytics(chatId)

  return (
    <div className='mt-4 w-full'>
      <Separator className='mb-6' />
      <div className='mb-4'>
        <span className='text-primary dark:text-primary-light text-lg font-bold md:text-xl'>
          Station Statistics
        </span>
      </div>
      {isLoading ? (
        <Skeleton className='h-32 w-full rounded-none' />
      ) : (
        <div className='grid gap-8 md:grid-cols-3'>
          {/* Genre Ranking */}
          <div>
            <div className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
              Genre Ranking
            </div>
            <div
              className='mb-1 text-4xl font-extrabold'
              style={{ color: '#26E056' }}
            >
              {data?.comparison?.stationRank
                ? `#${data.comparison.stationRank}`
                : 'N/A'}
            </div>
            <div className='text-muted-foreground text-xs'>
              {data?.comparison?.stationRank
                ? 'Current position in genre top'
                : 'No ranking available'}
            </div>
          </div>
          {/* Favorites */}
          <div>
            <div className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
              Favorites
            </div>
            <div className='text-primary dark:text-primary-light mb-1 text-4xl font-extrabold'>
              {data?.favorites ?? 0}
            </div>
            <div className='text-muted-foreground text-xs'>
              Average favorites in this genre is{' '}
              <span className='font-semibold'>
                {data?.comparison?.avgFavoritesInGenre ?? 0}
              </span>
            </div>
          </div>
          {/* Top stations in genre */}
          <div>
            <div className='mb-1 flex items-center'>
              <span className='text-muted-foreground mr-2 text-xs font-semibold tracking-wide uppercase'>
                Top 3 in Genre
              </span>
            </div>
            <ul className='space-y-1'>
              {data?.comparison?.topStations?.length ? (
                data.comparison.topStations
                  .slice(0, 3)
                  .map((station: any, idx: number) => (
                    <li
                      key={station.id}
                      className='flex items-center gap-2 rounded px-2 py-1'
                    >
                      <span className='w-5 text-center font-bold text-zinc-500 dark:text-zinc-400'>
                        {idx + 1}.
                      </span>
                      <span className='truncate text-base font-medium'>
                        {station.name}
                      </span>
                    </li>
                  ))
              ) : (
                <li className='text-muted-foreground text-xs'>No data</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Chat Moderation Analytics */}
      <div className='mt-10'>
        <Separator className='mb-6' />
        <div className='mb-4'>
          <span className='text-primary dark:text-primary-light text-lg font-bold md:text-xl'>
            Moderation Analytics
          </span>
        </div>
        {!chatId ? (
          <div className='py-8 text-center'>
            <div className='text-muted-foreground text-sm'>
              No chat analytics available for this station
            </div>
          </div>
        ) : isChatAnalyticsLoading ? (
          <Skeleton className='h-32 w-full rounded-none' />
        ) : chatAnalytics ? (
          <div className='space-y-6'>
            {/* Main Stats Grid */}
            <div className='grid gap-8 md:grid-cols-3'>
              {/* Total Messages */}
              <div>
                <div className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
                  Total Messages
                </div>
                <div className='text-primary dark:text-primary-light mb-1 text-4xl font-extrabold'>
                  {chatAnalytics.totalMessages ?? 0}
                </div>
                <div className='text-muted-foreground text-xs'>
                  Messages in chat history
                </div>
              </div>

              {/* Moderation Coverage */}
              <div>
                <div className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
                  Moderation Coverage
                </div>
                <div className='mb-1 text-4xl font-extrabold text-blue-500'>
                  {chatAnalytics.percentageWithModeration.toFixed(1) ?? 0}%
                </div>
                <div className='text-muted-foreground text-xs'>
                  {chatAnalytics.messagesWithModeration ?? 0} messages scanned
                </div>
              </div>

              {/* Toxicity Level */}
              <div>
                <div className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
                  Safety Score
                </div>
                <div
                  className='mb-1 text-4xl font-extrabold'
                  style={{
                    color:
                      (chatAnalytics.averageScores?.TOXICITY ?? 0) > 0.5
                        ? '#ef4444'
                        : (chatAnalytics.averageScores?.TOXICITY ?? 0) > 0.3
                          ? '#f59e0b'
                          : '#10b981',
                  }}
                >
                  {(
                    100 -
                    (chatAnalytics.averageScores?.TOXICITY ?? 0) * 100
                  ).toFixed(1)}
                  %
                </div>
                <div className='text-muted-foreground text-xs'>
                  Average safety rating
                </div>
              </div>
            </div>

            {/* Detailed Moderation Scores */}
            {chatAnalytics.averageScores && (
              <div className='rounded-xs border p-4'>
                <div className='text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase'>
                  Detailed Moderation Scores
                </div>
                <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3'>
                  {Object.entries(chatAnalytics.averageScores).map(
                    ([key, value]) => {
                      const percentage = (value * 100).toFixed(1)
                      const formatKey = key
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                      const getScoreColor = (score: number) => {
                        if (score > 0.5) return 'text-red-500'
                        if (score > 0.3) return 'text-amber-500'
                        return 'text-green-500'
                      }

                      return (
                        <div
                          key={key}
                          className='flex items-center justify-between'
                        >
                          <span className='text-sm'>{formatKey}:</span>
                          <span
                            className={`font-semibold ${getScoreColor(value)}`}
                          >
                            {percentage}%
                          </span>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            )}

            {/* System Actions & State Distribution
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='rounded-xs border p-4'>
                <div className='text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase'>
                  System Actions
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Flagged by system:</span>
                    <span className='font-medium text-red-500'>
                      {chatAnalytics.flaggedBySystemCount ?? 0}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Human reviewed:</span>
                    <span className='font-medium text-blue-500'>
                      {chatAnalytics.reviewedCount ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className='rounded-xs border p-4'>
                <div className='text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase'>
                  Message Status
                </div>
                <div className='space-y-2'>
                  {Object.entries(chatAnalytics.stateDistribution || {}).map(
                    ([state, count]) => {
                      const getStateColor = (state: string) => {
                        switch (state) {
                          case 'approved':
                            return 'text-green-500'
                          case 'pending':
                            return 'text-amber-500'
                          case 'hidden':
                            return 'text-red-500'
                          case 'deleted':
                            return 'text-red-600'
                          default:
                            return 'text-gray-500'
                        }
                      }

                      return (
                        <div
                          key={state}
                          className='flex items-center justify-between'
                        >
                          <span className='text-sm capitalize'>{state}:</span>
                          <span
                            className={`font-medium ${getStateColor(state)}`}
                          >
                            {count}
                          </span>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
              </div>*/}
          </div>
        ) : (
          <div className='py-8 text-center'>
            <div className='text-muted-foreground text-sm'>
              No chat analytics available for this station
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
