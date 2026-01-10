import { Link, useRouter } from '@tanstack/react-router'
// Icons 
import { IconSearch, IconPlus } from '@tabler/icons-react'
import { Menu } from 'lucide-react'
// Shadcn components
import { ProfileDropdown } from '@/presentation/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/presentation/components/theme-switch.tsx'
import { Button } from '@/presentation/components/ui/button.tsx'
import { Input } from '@/presentation/components/ui/input.tsx'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/presentation/components/ui/sheet.tsx'
// Hooks
import { usePermissions } from '@/presentation/hooks/auth/usePermissions.ts'
import { useStaticTranslation } from '@/presentation/hooks/useTranslation.ts'
//import { useIsMobile } from '@/hooks/use-mobile'

export default function HeaderNavbar({ sticky = false }: { sticky?: boolean }) {
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const { canCreateStation } = usePermissions();
  const { t } = useStaticTranslation();
  //const isMobile = useIsMobile();

  // Helper para saber si la ruta está activa
  const isActive = (path: string) => currentPath === path;

  // Navegación para el menú móvil
  const navItems = [
    { path: "/", label: t('navigation.radio') },
    { path: "/browse", label: t('navigation.browse') },
    { path: "/you/library", label: t('navigation.library') },
  ];

  return (
    <header className={`top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90${sticky ? ' sticky' : ''}`}>
      <div className="container flex h-16 md:h-20 items-center px-4 md:px-0">
        {/* Logo
        className="flex items-baseline space-x-2 select-none md:mr-8 mx-auto md:mx-0"
        */}
        <Link
          to="/"
          className="flex items-baseline space-x-2 select-none"
        >
          <h1 className="text-xl font-bold tracking-widest font-[Orbitron]">Hörgen</h1>
          <span className="text-sm font-[Inter] text-zinc-400 hidden md:inline">
            v0.1.4
          </span>
        </Link>

        {/* Menú Hamburguesa (Mobile) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-auto"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4 sm:max-w-sm">
            <div className="flex flex-col h-full">
              {/* Logo en el menú */}
              <div className="p-4 border-b">
                <ProfileDropdown />
              </div>

              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="lg"
                      asChild
                      className={`w-full justify-start font-medium ${isActive(item.path) ? 'text-white dark:text-[#111]' : ''}`}
                    >
                      <Link to={item.path}>{item.label}</Link>
                    </Button>
                  ))}
                </div>
              </nav>

              <div className="p-4 border-t space-y-4">
                {canCreateStation && (
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="w-full justify-start"
                  >
                    <Link to="/s/new" className="flex items-center gap-3">
                      <IconPlus className="h-4 w-4" />
                      <span>{t('navigation.createRadio')}</span>
                    </Link>
                  </Button>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('common.theme')}</span>
                  <ThemeSwitch />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex ml-8 items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              size="sm"
              asChild
              className={`font-medium text-sm h-9 px-4 rounded-xs ${isActive(item.path) ? 'text-white dark:text-[#111]' : ''}`}
            >
              <Link to={item.path}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        {/* Search (Desktop only) */}
        <div className="hidden md:flex ml-8 flex-1 max-w-md relative">
          <div className="relative w-full">
            <IconSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('navigation.searchPlaceholder')}
              className="pl-12 h-11 bg-muted/50 border-0 rounded-xs focus-visible:ring-2 focus-visible:ring-primary/30 text-sm w-full"
              onFocus={() => {
                if (currentPath !== '/browse') {
                  router.navigate({ to: '/browse' });
                }
              }}
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4 md:ml-6">
          {canCreateStation && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden md:flex h-9 px-3 rounded-none border-foreground transition-colors"
            >
              <Link to="/s/new" className="flex items-center gap-2">
                <IconPlus className="h-4 w-4" />
                <span>{t('navigation.createRadio')}</span>
              </Link>
            </Button>
          )}
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}
