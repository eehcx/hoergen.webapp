import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Overview, RecentCustomers } from './components'
import { useSubscriptions, useGeneralCustomers } from './hooks'
import { useStaticTranslation } from '@/hooks/useTranslation'

export function AnalyticsCustomers() {
    const { data: subscriptions, isLoading: loadingSubscriptions } = useSubscriptions()
    const { data: general, isLoading: loadingGeneralCustomers } = useGeneralCustomers()
    const { t } = useStaticTranslation()

    return (
        <>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                <Card className='rounded-none'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            {t('analytics.customers.totalRevenue')}
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
                            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            ${loadingSubscriptions
                                ? '...'
                                : subscriptions?.totalRevenue
                                    ? Number(subscriptions.totalRevenue).toFixed(2)
                                    : '0.00'
                            }
                        </div>
                        <p className='text-muted-foreground text-xs'>
                            {loadingSubscriptions
                                ? '...'
                                : `${t('analytics.customers.amountIn')} ${subscriptions?.currency ? subscriptions.currency.toUpperCase() : 'MXN'}`
                            }
                        </p>
                    </CardContent>
                </Card>
                <Card className='rounded-none'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        {t('analytics.customers.checkoutSessions')}
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
                        <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                        <circle cx='9' cy='7' r='4' />
                        <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                    </svg>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            +{loadingGeneralCustomers
                                ? '...'
                                : general?.totalCheckoutSessions ?? 0
                            }
                        </div>
                        <p className='text-muted-foreground text-xs'>
                            {t('analytics.customers.totalCheckoutSessions')}
                        </p>
                    </CardContent>
                </Card>
                <Card className='rounded-none'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        {t('analytics.customers.activeSubscriptions')}
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
                        <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                    </svg>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            +{ loadingSubscriptions
                                ? '...'
                                : subscriptions?.active ?? 0
                            }
                            </div>
                        <p className='text-muted-foreground text-xs'>
                            { loadingSubscriptions
                                ? '...'
                                : `${subscriptions?.canceled ?? 0} ${t('analytics.customers.subscriptionsCanceled')}`
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                <Card className='col-span-1 lg:col-span-4 rounded-none'>
                    <CardHeader>
                        <CardTitle>{t('analytics.customers.subscriptions')}</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                        <Overview />
                    </CardContent>
                </Card>
                <Card className='col-span-1 lg:col-span-3 rounded-none'>
                    <CardHeader>
                        <CardTitle>{t('analytics.customers.recentCustomers')}</CardTitle>
                        <CardDescription>
                            {loadingGeneralCustomers
                                ? '...'
                                : t('analytics.customers.newCustomers').replace('{count}', (general?.totalCustomers ?? 0).toString())
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentCustomers />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}