import { Link, useNavigate } from '@tanstack/react-router'
//import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/hooks'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { signOut } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ProfileDropdown() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { hasRole, hasAnyRole } = usePermissions()
  //const { user } = useAuth()

  // User data
  //const displayName = 'User Name'
  //const email = 'User Email'
  //const photoURL = '/avatars/01.png'

  /*const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)*/

  const displayName = user?.displayName || 'User'
  const email = user?.email || 'No email provided'
  const photoURL = user?.photoURL || '/avatars/01.png'

  // Crea iniciales para el fallback del avatar
  const initials = displayName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('You have been logged out successfully.')
      navigate({ to: '/sign-in' })
    } catch (error) {
      toast.error('Failed to log out. Please try again.')
      console.error('Logout error:', error)
    }
  }

  return (
    <DropdownMenu modal={false}>
      {hasAnyRole(['listener', 'pro']) && (
        <>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={photoURL} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-56 rounded-xs'
            align='end'
            forceMount
          >
            <DropdownMenuLabel className='cursor-default font-normal select-none'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {displayName.length > 23
                    ? displayName.slice(0, 23) + '...'
                    : displayName}
                </p>
                <p className='text-muted-foreground text-xs leading-none'>
                  {email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className='cursor-pointer rounded-xs' asChild>
                <Link to='/settings'>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer rounded-xs' asChild>
                <Link to='/settings/notifications'>
                  Notifications
                  <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer rounded-xs' asChild>
                <Link to='/subscriptions'>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleSignOut}
              className='cursor-pointer rounded-xs'
            >
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      )}

      {hasRole('creator') && (
        <>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={photoURL} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-56 rounded-xs'
            align='end'
            forceMount
          >
            <DropdownMenuLabel className='font-normal'>
              <Button
                variant='ghost'
                className='hover:bg-muted/70 w-full justify-start rounded-none px-3 py-2 text-left'
                onClick={() => navigate({ to: '/creator' })}
              >
                <div className='flex w-full flex-col items-start'>
                  <p className='text-muted-foreground w-full truncate text-xs font-medium'>
                    {email.length > 25 ? email.slice(0, 25) + '...' : email}
                  </p>
                  <span className='text-primary mt-1 text-xs font-normal'>
                    Go to Creator Panel
                  </span>
                </div>
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className='rounded-xs' asChild>
                <Link to='/settings'>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='rounded-xs' asChild>
                <Link to='/settings/notifications'>
                  Analytics
                  <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='rounded-xs' asChild>
                <Link to='/subscriptions'>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleSignOut}
              className='cursor-pointer rounded-xs'
            >
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      )}

      {hasRole('moderator') && (
        <>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={photoURL} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-56 rounded-xs'
            align='end'
            forceMount
          >
            <DropdownMenuLabel className='cursor-default font-normal select-none'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {displayName.length > 23
                    ? displayName.slice(0, 23) + '...'
                    : displayName}
                </p>
                <p className='text-muted-foreground text-xs leading-none'>
                  {email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className='cursor-pointer rounded-xs' asChild>
                <Link to='/settings'>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer rounded-xs' asChild>
                <Link to='/subscriptions'>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleSignOut}
              className='cursor-pointer rounded-xs'
            >
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      )}

      {hasRole('admin') && (
        <>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={photoURL} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-56 rounded-xs'
            align='end'
            forceMount
          >
            <DropdownMenuLabel className='font-normal'>
              <Button
                variant='ghost'
                className='hover:bg-muted/70 w-full justify-start rounded-none px-3 py-2 text-left'
                onClick={() => navigate({ to: '/admin' })}
              >
                <div className='flex w-full flex-col items-start'>
                  <p className='text-muted-foreground w-full truncate text-xs font-medium'>
                    {email.length > 25 ? email.slice(0, 25) + '...' : email}
                  </p>
                  <span className='text-primary mt-1 text-xs font-normal'>
                    Go to Admin Dashboard
                  </span>
                </div>
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className='cursor-pointer rounded-xs' asChild>
                <Link to='/settings'>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer rounded-xs' asChild>
                <Link to='/creator'>
                  Creator
                  <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer rounded-xs' asChild>
                <Link to='/subscriptions'>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleSignOut}
              className='cursor-pointer rounded-xs'
            >
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      )}
    </DropdownMenu>
  )
}
