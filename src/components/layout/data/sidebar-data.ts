import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
    user: {
        name: 'guest',
        email: 'guest@hoergen.com',
        avatar: '/avatars/guest.jpg',
    },
    teams: [
        {
            name: 'Hörgen',
            logo: Command,
            plan: 'Free',
        },
    ],
    navGroups: [],
}