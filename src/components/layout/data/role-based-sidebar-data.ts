// src/components/layout/data/role-based-sidebar-data.ts
import {
    IconLayoutDashboard,
    IconUserCog,
    IconRadio,
    IconChartBar,
    IconHeadphones,
    IconSettings,
    IconMusic,
    IconWorld,
    IconFlag,
    IconStars,
    IconUsers,
    IconCreditCard,
    IconShieldLock,
} from '@tabler/icons-react'
import { type NavGroup } from '../types'

export function getNavGroupsByRole(role: string, t: (key: string) => string): NavGroup[] {
    const baseGroups: NavGroup[] = [
        {
            title: t('sidebar.overview'),
            items: [
                {
                    title: t('sidebar.home'),
                    url: '/admin',
                    icon: IconLayoutDashboard,
                }
            ]
        }
    ]

    // Para admins
    if (role === 'admin') {
        baseGroups.push({
            title: t('sidebar.content'),
            items: [
                {
                    title: t('sidebar.stations'),
                    url: '/admin/stations',
                    icon: IconRadio,
                },
                {
                    title: t('sidebar.genres'),
                    url: '/admin/genres',
                    icon: IconMusic,
                }
            ],
        })

        baseGroups.push({
            title: t('sidebar.community'),
            items: [
                {
                    title: t('sidebar.users'),
                    url: '/admin/users',
                    icon: IconUsers,
                },
                {
                    title: t('sidebar.moderation'),
                    url: '/creator',
                    icon: IconShieldLock,
                }
            ],
        })

        baseGroups.push({
            title: t('sidebar.monetization'),
            items: [
                {
                    title: t('sidebar.subscriptions'),
                    url: '/admin/subscriptions',
                    icon: IconCreditCard,
                }
            ],
        })

        baseGroups.push({
            title: t('sidebar.reportsAndFeedback'),
            items: [
                {
                    title: t('sidebar.reports'),
                    url: '/admin/reports',
                    icon: IconFlag,
                },
                {
                    title: t('sidebar.feedback'),
                    url: '/admin/feedback',
                    icon: IconStars,
                }
            ],
        })

        // Settings de admin (avanzados)
        baseGroups.push({
            title: t('sidebar.system'),
            items: [
                {
                    title: t('sidebar.countries'),
                    url: '/admin/countries',
                    icon: IconWorld,
                },
                {
                    title: t('sidebar.settings'),
                    url: '/settings/account',
                    icon: IconSettings,
                }
            ],
        })
    }

    // Para creators (futuro)
    if (role === 'creator') {
        baseGroups.push({
            title: t('sidebar.creatorTools'),
            items: [
                {
                    title: t('sidebar.myStations'),
                    url: '/creator/stations',
                    icon: IconRadio,
                },
                {
                    title: t('sidebar.analytics'),
                    url: '/creator/analytics',
                    icon: IconChartBar,
                },
            ],
        })

        // Settings básicos para creators
        baseGroups.push({
            title: t('sidebar.settings'),
            items: [
                {
                    title: t('sidebar.profile'),
                    url: '/user-settings',
                    icon: IconUserCog,
                },
                {
                    title: t('sidebar.preferences'),
                    url: '/user-settings/preferences',
                    icon: IconHeadphones,
                },
            ],
        })
    }

    return baseGroups
}
