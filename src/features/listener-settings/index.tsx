import { Outlet } from '@tanstack/react-router'
import {
  IconHeadphones,
  IconUser,
  IconVolume,
} from '@tabler/icons-react'
// Shadcn components
import { Separator } from '@/components/ui/separator'
// Local Reusables components
import SidebarNav from '@/features/listener-settings/components/sidebar-nav'
import HeaderNavbar from '@/components/header-navbar'
import { Footer } from '@/components/footer'

export default function ListenerSettings() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Navigation - fijo en el top */}
      <HeaderNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-background pt-10">
        <div className="container space-y-8 p-6 max-w-7xl mx-auto">
          <div className='space-y-0.5'>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              Settings
            </h1>
            <p className='text-muted-foreground'>
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
          <Separator className='my-4 lg:my-6' />
          <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
            <aside className='top-0 lg:sticky lg:w-1/5'>
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className='flex w-full overflow-y-hidden p-1'>
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '/settings',
    description: 'Manage your profile and account',
  },
  {
    title: 'Audio',
    icon: <IconVolume size={18} />,
    href: '/settings/audio',
    description: 'Audio quality and playback settings',
  },
  {
    title: 'Listening',
    icon: <IconHeadphones size={18} />,
    href: '/settings/preferences',
    description: 'Your listening preferences and favorites',
  },
]
