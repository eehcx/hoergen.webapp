import {
    Card,
    CardContent,
    //CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { 
    IconFileAnalytics,
    IconClock,
    IconAlertCircle, 
    IconTarget
} from '@tabler/icons-react'
import { 
    useTotalReports,
    useAverageResolutionTime,
    useReportsByReason,
    useReportsByTargetType,
} from './hooks'
import { Trends } from './components'
import { useStaticTranslation } from '@/hooks/useTranslation'

export function AnalyticsReports() {
    const { data: totals, isLoading: loadingTotals } = useTotalReports()
    const { data: avgResolution, isLoading: loadingAvg } = useAverageResolutionTime()
    const { data: reasons, isLoading: loadingReasons } = useReportsByReason()
    const { data: targets, isLoading: loadingTargets } = useReportsByTargetType()
    const { t } = useStaticTranslation()

    // Most common reason
    const mostCommonReason = reasons
        ? Object.entries(reasons as Record<string, number>).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
        : ''

    // Most reported target type
    const mostReportedTarget = targets
        ? Object.entries(targets as Record<string, number>).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
        : ''

    return (
        <>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <Card className='rounded-none'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'> 
                        <CardTitle className='text-sm font-medium'>{t('analytics.reports.totalReports')}</CardTitle>
                        <IconFileAnalytics size={18} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {loadingTotals ? '...' : totals?.totalReports ?? 0}
                        </div>
                        <p className='text-muted-foreground text-xs'>
                            {loadingTotals ? '' : `${totals?.resolved ?? 0} ${t('analytics.reports.resolved')}, ${totals?.pending ?? 0} ${t('analytics.reports.pending')}`}
                        </p>
                    </CardContent>
                </Card>
                <Card className='rounded-none'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>{t('analytics.reports.averageResolutionTime')}</CardTitle>
                        <IconClock size={18} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {loadingAvg ? '...' : `${avgResolution?.averageTimeInHours?.toFixed(1) ?? 0}h`}
                        </div>
                        <p className='text-muted-foreground text-xs'>
                            {loadingAvg ? '' : t('analytics.reports.averageTimeToResolve')}
                        </p>
                    </CardContent>
                </Card>
                <Card className='rounded-none'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>{t('analytics.reports.mostCommonReason')}</CardTitle>
                        <IconAlertCircle size={18} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {loadingReasons ? '...' : mostCommonReason}
                        </div>
                        <p className='text-muted-foreground text-xs'>
                            {loadingReasons ? '' : t('analytics.reports.mostFrequentReportReason')}
                        </p>
                    </CardContent>
                </Card>
                {/* Most Reported Target Type */}
                <Card className='rounded-none'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>{t('analytics.reports.mostReportedTarget')}</CardTitle>
                        <IconTarget size={18} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {loadingTargets ? '...' : mostReportedTarget}
                        </div>
                        <p className='text-muted-foreground text-xs'>
                            {loadingTargets ? '' : t('analytics.reports.mostFrequentTargetType')}
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Card className='w-full rounded-none lg:col-span-4 mt-4'>
                <CardHeader>
                    <CardTitle>{t('analytics.reports.trends')}</CardTitle>
                </CardHeader>
                <CardContent className='px-4'>
                    <Trends />
                </CardContent>
            </Card>
        </>
    )
}