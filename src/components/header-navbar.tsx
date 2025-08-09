import { Link, useRouter } from '@tanstack/react-router'
// Icons 
import { IconSearch, IconPlus } from '@tabler/icons-react'
// Shadcn components
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// Hooks
import { usePermissions } from '@/hooks/auth/usePermissions'

export default function HeaderNavbar({ sticky = false }: { sticky?: boolean }) {
    const router = useRouter();
    const currentPath = router.state.location.pathname;
    const { canCreateStation } = usePermissions();
    
    // Helper para saber si la ruta está activa
    const isActive = (path: string) => currentPath === path;
    return (
        <header className={`top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90${sticky ? ' sticky' : ''}`}>
            <div className="container flex h-20 items-center">
                {/* Logo */}
                <Link to="/" className="flex items-baseline space-x-2 select-none">
                    <h1 className="text-xl font-bold tracking-widest font-[Orbitron]">Hörgen</h1>
                    <span className="text-sm font-[Inter] text-zinc-400">
                        v0.1.4
                    </span>
                </Link>
                
                {/* Navigation */}
                <nav className="ml-8 flex items-center space-x-1">
                    <Button
                        variant={isActive("/") ? "default" : "ghost"}
                        size="sm"
                        asChild
                        className={`font-medium text-sm h-9 px-4 rounded-xs${isActive("/") ? ' text-white dark:text-[#111]' : ''}`}
                    >
                        <Link to="/">Radio</Link>
                    </Button>
                    <Button
                        variant={isActive("/browse") ? "default" : "ghost"}
                        size="sm"
                        asChild
                        className={`font-medium text-sm h-9 px-4 rounded-xs${isActive("/browse") ? ' text-white dark:text-[#111]' : ''}`}
                    >
                        <Link to="/browse">Browse</Link>
                    </Button>
                    <Button
                        variant={isActive("/you/library") ? "default" : "ghost"}
                        size="sm"
                        asChild
                        className={`font-medium text-sm h-9 px-4 rounded-xs${isActive("/you/library") ? ' text-white dark:text-[#111]' : ''}`}
                    >
                        <Link to="/you/library">Library</Link>
                    </Button>
                </nav>
                
                {/* Search */}
                <div className="ml-8 flex-1 max-w-md relative">
                    <div className="relative">
                    <IconSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search radio stations around the world..."
                        className="pl-12 h-11 bg-muted/50 border-0 rounded-xs focus-visible:ring-2 focus-visible:ring-primary/30 text-sm"
                        onFocus={() => {
                            if (currentPath !== '/browse') {
                                router.navigate({ to: '/browse' });
                            }
                        }}
                    />
                    </div>
                </div>

                {/* User Actions */}
                <div className="ml-6 flex items-center space-x-4">
                    {/* Create Station Button - Solo para creators y admins */}
                    {canCreateStation && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-9 px-3 rounded-none border-foreground transition-colors"
                        >
                            <Link to="/s/new" className="flex items-center gap-2">
                                <IconPlus className="h-4 w-4" />
                                <span className="hidden sm:inline">Create Radio</span>
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