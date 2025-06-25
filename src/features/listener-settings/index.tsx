import { Outlet, Link } from '@tanstack/react-router'
import {
  IconHeadphones,
  IconUser,
  IconVolume,
  IconSearch,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import SidebarNav from '@/features/listener-settings/components/sidebar-nav'

export default function ListenerSettings() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Navigation - fijo en el top */}
      <header className="top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
        <div className="container flex h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 select-none">
            <h1 className="text-xl font-bold tracking-widest font-[Orbitron]">Hörgen</h1>
          </Link>
          
          {/* Navigation */}
          <nav className="ml-8 flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild className="font-medium text-sm h-9 px-4 rounded-xs">
              <Link to="/">Radio</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="font-medium text-sm h-9 px-4 rounded-xs">
              <Link to="/browse">Browse</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="font-medium text-sm h-9 px-4 rounded-xs">
              <Link to="/library">Library</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="font-medium text-sm h-9 px-4 rounded-xs">
              <Link to="/search">Search</Link>
            </Button>
            <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs bg-primary text-primary-foreground">
              Settings
            </Button>
          </nav>
          
          {/* Search */}
          <div className="ml-8 flex-1 max-w-md relative">
            <div className="relative">
              <IconSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search artists, stations, podcasts..."
                className="pl-12 h-11 bg-muted/50 border-0 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/30 text-sm"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="ml-6 flex items-center space-x-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </header>

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
