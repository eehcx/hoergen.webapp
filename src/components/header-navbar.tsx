import { Link } from '@tanstack/react-router'
// Icons 
import { IconSearch } from '@tabler/icons-react'
// Shadcn components
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function HeaderNavbar() {
    return (
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
                {/*
                <Button variant="ghost" size="sm" asChild className="font-medium text-sm h-9 px-4 rounded-xs">
                    <Link to="/search">Search</Link>
                </Button>
                <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs bg-primary text-primary-foreground">
                Settings
                </Button>
                */}
            </nav>
            
            {/* Search */}
            <div className="ml-8 flex-1 max-w-md relative">
                <div className="relative">
                <IconSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search radio stations around the world..."
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
    )
}