import { IconUser, IconStar, IconCrown, IconShield, IconUserCheck } from '@tabler/icons-react'
import type { UserRole } from '@/core/types/user.types'

export const userRoleIcons: Record<UserRole, { icon: any, label: string }> = {
    listener: { icon: IconUser, label: 'Listener' },
    pro: { icon: IconStar, label: 'Pro' },
    creator: { icon: IconCrown, label: 'Creator' },
    moderator: { icon: IconUserCheck, label: 'Moderator' },
    admin: { icon: IconShield, label: 'Admin' },
}
