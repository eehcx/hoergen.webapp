import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface SidebarNavProps {
  items: {
    title: string
    icon: React.ReactNode
    href: string
    description?: string
  }[]
}

export default function SidebarNav({ items }: SidebarNavProps) {
  const location = useLocation()

  return (
    <nav className="space-y-2">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Settings
        </h4>
      </div>
      {items.map((item) => {
        const isActive = location.pathname === item.href
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full justify-start h-auto p-3 text-left',
              isActive 
                ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                : 'hover:bg-muted/50'
            )}
          >
            <div className="flex items-start space-x-3 w-full">
              <div className="mt-0.5 flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">
                  {item.title}
                </div>
                {item.description && (
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
