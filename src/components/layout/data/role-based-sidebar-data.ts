// src/components/layout/data/role-based-sidebar-data.ts
import {
    IconLayoutDashboard,
    IconUserCog,
    IconPalette,
    IconNotification,
    IconRadio,
    IconChartBar,
    IconHeadphones,
    IconVolume,
    IconSettings,
    IconSearch,
    IconHeart,
    IconClock,
    IconUsers,
    IconShieldCheck,
} from '@tabler/icons-react'
import { type NavGroup } from '../types'

export function getNavGroupsByRole(role: string): NavGroup[] {
    const baseGroups: NavGroup[] = [
        {
        title: 'Main',
        items: [
            {
            title: 'Home',
            url: '/',
            icon: IconLayoutDashboard,
            },
            {
            title: 'Browse',
            url: '/browse',
            icon: IconSearch,
            },
        ],
        },
    ]

    // Agregar secciones específicas para listeners
    if (role === 'listener' || role === 'user') {
        baseGroups.push({
            title: 'Your Library',
            items: [
                {
                    title: 'Favorites',
                    url: '/library/favorites',
                    icon: IconHeart,
                },
                {
                    title: 'History',
                    url: '/library/history',
                    icon: IconClock,
                },
                {
                    title: 'Following',
                    url: '/library/following',
                    icon: IconRadio,
                },
            ],
        })

        // Settings específicos para listeners
        baseGroups.push({
            title: 'Settings',
            items: [
                {
                    title: 'Profile',
                    url: '/user-settings',
                    icon: IconUserCog,
                },
                {
                    title: 'Audio',
                    url: '/user-settings/audio',
                    icon: IconVolume,
                },
                {
                    title: 'Preferences',
                    url: '/user-settings/preferences',
                    icon: IconHeadphones,
                },
            ],
        })
    }

    // Para admins
    if (role === 'admin') {
        baseGroups.push({
            title: 'Admin',
            items: [
                {
                    title: 'Admin Panel',
                    url: '/admin',
                    icon: IconShieldCheck,
                },
                {
                    title: 'Users',
                    url: '/admin/users',
                    icon: IconUsers,
                },
                {
                    title: 'Stations',
                    url: '/admin/stations',
                    icon: IconRadio,
                },
            ],
        })

        // Settings de admin (avanzados)
        baseGroups.push({
            title: 'Admin Settings',
            items: [
                {
                    title: 'System Settings',
                    url: '/settings',
                    icon: IconSettings,
                },
                {
                    title: 'Appearance',
                    url: '/settings/appearance',
                    icon: IconPalette,
                },
                {
                    title: 'Notifications',
                    url: '/settings/notifications',
                    icon: IconNotification,
                },
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