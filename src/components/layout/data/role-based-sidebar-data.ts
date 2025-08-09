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

export function getNavGroupsByRole(role: string): NavGroup[] {
    const baseGroups: NavGroup[] = [
        {
            title: 'Overview',
            items: [
                {
                    title: 'Home',
                    url: '/admin',
                    icon: IconLayoutDashboard,
                }
            ]
        }
    ]

    // Para admins
    if (role === 'admin') {
        baseGroups.push({
            title: 'Content',
            items: [
                {
                    title: 'Stations',
                    url: '/admin/stations',
                    icon: IconRadio,
                },
                {
                    title: 'Genres',
                    url: '/admin/genres',
                    icon: IconMusic,
                }
            ],
        })

        baseGroups.push({
            title: 'Community',
            items: [
                {
                    title: 'Users',
                    url: '/admin/users',
                    icon: IconUsers,
                },
                {
                    title: 'Moderation',
                    url: '/creator',
                    icon: IconShieldLock,
                }
            ],
        })

        baseGroups.push({
            title: 'Monetization',
            items: [
                {
                    title: 'Subscriptions',
                    url: '/admin/subscriptions',
                    icon: IconCreditCard,
                }
            ],
        })

        baseGroups.push({
            title: 'Reports & Feedback',
            items: [
                {
                    title: 'Reports',
                    url: '/admin/reports',
                    icon: IconFlag,
                },
                {
                    title: 'Feedback',
                    url: '/admin/feedback',
                    icon: IconStars,
                }
            ],
        })

        // Settings de admin (avanzados)
        baseGroups.push({
            title: 'System',
            items: [
                {
                    title: 'Countries',
                    url: '/admin/countries',
                    icon: IconWorld,
                },
                {
                    title: 'Settings',
                    url: '/settings/account',
                    icon: IconSettings,
                }
            ],
        })
    }

    // Para creators (futuro)
    if (role === 'creator') {
        baseGroups.push({
            title: 'Creator Tools',
            items: [
                {
                    title: 'My Stations',
                    url: '/creator/stations',
                    icon: IconRadio,
                },
                {
                    title: 'Analytics',
                    url: '/creator/analytics',
                    icon: IconChartBar,
                },
            ],
        })

        // Settings básicos para creators
        baseGroups.push({
            title: 'Settings',
            items: [
                {
                    title: 'Profile',
                    url: '/user-settings',
                    icon: IconUserCog,
                },
                {
                    title: 'Preferences',
                    url: '/user-settings/preferences',
                    icon: IconHeadphones,
                },
            ],
        })
    }

    return baseGroups
}
