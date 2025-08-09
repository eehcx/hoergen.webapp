import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useFeedbackContext } from '../context/feedback-context'
import { 
  IconDeviceLaptop,
  IconDeviceMobile,
  IconBrandApple
} from '@tabler/icons-react'

function isFirebaseTimestamp(obj: any): obj is { _seconds: number; _nanoseconds: number } {
  return obj && typeof obj === 'object' && typeof obj._seconds === 'number' && typeof obj._nanoseconds === 'number';
}

const platformIcons = {
  'web': IconDeviceLaptop,
  'android': IconDeviceMobile,
  'ios': IconBrandApple
}

const platformColors = {
  'web': 'bg-blue-100 text-blue-800 border-blue-300',
  'android': 'bg-green-100 text-green-800 border-green-300',
  'ios': 'bg-gray-100 text-gray-800 border-gray-300'
}

export function FeedbackViewDialog() {
  const { open, setOpen, currentRow } = useFeedbackContext()

  if (!currentRow) return null

  const isOpen = open === 'view'
  
  const Icon = platformIcons[currentRow.appPlatform] || IconDeviceLaptop
  const platformColorClass = platformColors[currentRow.appPlatform] || 'bg-gray-100 text-gray-800 border-gray-300'
  
  let createdAtString = 'Invalid date'
  if (isFirebaseTimestamp(currentRow.createdAt)) {
    const date = new Date(currentRow.createdAt._seconds * 1000)
    createdAtString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  } else if (currentRow.createdAt instanceof Date) {
    createdAtString = `${currentRow.createdAt.toLocaleDateString()} ${currentRow.createdAt.toLocaleTimeString()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpen(null)}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogDescription>
            View detailed information about this feedback submission.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Platform</Label>
                <div className='flex items-center space-x-2'>
                  <Icon className='h-4 w-4 text-muted-foreground' />
                  <Badge variant='outline' className={platformColorClass}>
                    {currentRow.appPlatform.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Created At</Label>
                <p className='text-sm text-muted-foreground'>{createdAtString}</p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>User ID</Label>
                <p className='text-sm text-muted-foreground font-mono'>
                  {currentRow.userId || 'Anonymous'}
                </p>
              </div>
              
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Email</Label>
                <p className='text-sm text-muted-foreground'>
                  {currentRow.email || 'Not provided'}
                </p>
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Message</Label>
              <div className='rounded-md border p-3 bg-muted/50'>
                <p className='text-sm whitespace-pre-wrap'>
                  {currentRow.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
