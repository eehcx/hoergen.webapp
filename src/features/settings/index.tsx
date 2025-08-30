import { Outlet, useRouterState } from '@tanstack/react-router'
import {
  IconBrowserCheck,
  IconNotification,
  IconPalette,
  IconTool,
  IconLanguage,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { useStaticTranslation } from '@/hooks/useTranslation'
import SidebarNav from './components/sidebar-nav'
import SettingsAccount from './account'

export default function Settings() {
  const { t } = useStaticTranslation()
  const { location } = useRouterState()
  // Detecta si estamos en la ruta padre exacta
  const isRoot =
    location.pathname === '/_authenticated/settings' ||
    location.pathname === '/_authenticated/settings/'

  const sidebarNavItems = [
    /*{
      title: 'Profile',
      icon: <IconUser size={18} />,
      href: '/settings',
    },*/
    {
      title: t('settings.account'),
      icon: <IconTool size={18} />,
      href: '/settings/account',
    },
    {
      title: t('settings.appearance'),
      icon: <IconPalette size={18} />,
      href: '/settings/appearance',
    },
    {
      title: t('settings.notifications'),
      icon: <IconNotification size={18} />,
      href: '/settings/notifications',
    },
    {
      title: t('settings.display'),
      icon: <IconBrowserCheck size={18} />,
      href: '/settings/display',
    },
    {
      title: t('settings.language'),
      icon: <IconLanguage size={18} />,
      href: '/settings/language',
    },
  ]

  return (
    <>
      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('settings.title')}
          </h1>
          <p className='text-muted-foreground'>
            {t('settings.description')}
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>
            {isRoot ? <SettingsAccount /> : <Outlet />}
          </div>
        </div>
      </Main>
    </>
  )
}
