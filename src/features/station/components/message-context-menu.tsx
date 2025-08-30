import React from 'react'
import { IconTrash, IconTrashX, IconDotsVertical } from '@tabler/icons-react'
import type { ModerationResult } from '@/core/types/chat.types'
import { useIsElectron } from '@/hooks'
import { useStaticTranslation } from '@/hooks/useTranslation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuLabel,
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

interface MessageContextMenuProps {
  messageId: string
  message: string
  moderationResult?: ModerationResult
  onDelete: () => void
  onClearChat: () => void
  children: React.ReactNode
}

export const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  message,
  moderationResult,
  onDelete,
  onClearChat,
  children,
}) => {
  const { t } = useStaticTranslation()
  const isElectron = useIsElectron()

  // Formatear el porcentaje para mostrar
  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`
  }

  // Determinar el color del badge según el nivel de toxicidad
  const getBadgeVariant = (value: number) => {
    if (value >= 0.8) return 'destructive'
    if (value >= 0.6) return 'secondary'
    if (value >= 0.3) return 'outline'
    return 'default'
  }

  // Componente para renderizar la información de moderación
  const ModerationInfo = () => (
    <>
      {moderationResult && (
        <>
          <DropdownMenuLabel className='px-2 py-1.5'>
            <div className='text-muted-foreground mb-1.5 text-xs font-semibold'>
              {t('messageContextMenu.moderationAnalysis')}
            </div>
            <div className='grid grid-cols-1 gap-0.5 text-xs'>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.toxicity')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.TOXICITY)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.TOXICITY)}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.insult')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.INSULT)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.INSULT)}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.profanity')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.PROFANITY)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.PROFANITY)}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.threat')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.THREAT)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.THREAT)}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.identity')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.IDENTITY_ATTACK)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.IDENTITY_ATTACK)}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.severe')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.SEVERE_TOXICITY)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.SEVERE_TOXICITY)}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </>
      )}
    </>
  )

  // Componente para información de moderación en ContextMenu
  const ContextModerationInfo = () => (
    <>
      {moderationResult && (
        <>
          <ContextMenuLabel className='px-2 py-1.5'>
            <div className='text-muted-foreground mb-1.5 text-xs font-semibold'>
              {t('messageContextMenu.moderationAnalysis')}
            </div>
            <div className='grid grid-cols-1 gap-0.5 text-xs'>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.toxicity')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.TOXICITY)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.TOXICITY)}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.insult')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.INSULT)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.INSULT)}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.profanity')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.PROFANITY)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.PROFANITY)}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.threat')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.THREAT)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.THREAT)}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.identity')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.IDENTITY_ATTACK)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.IDENTITY_ATTACK)}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs'>{t('messageContextMenu.severe')}:</span>
                <Badge
                  variant={getBadgeVariant(moderationResult.SEVERE_TOXICITY)}
                  className='h-4 px-1.5 py-0 text-xs'
                >
                  {formatPercentage(moderationResult.SEVERE_TOXICITY)}
                </Badge>
              </div>
            </div>
          </ContextMenuLabel>
          <ContextMenuSeparator />
        </>
      )}
    </>
  )

  return (
    <>
      {isElectron ? (
        // Versión para Electron usando DropdownMenu
        <div className='relative'>
          <div className='group relative'>
            {children}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='absolute top-1 right-1 h-6 w-6 p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
                  style={{ borderRadius: 0 }}
                >
                  <IconDotsVertical size={12} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='min-w-[240px] rounded-none'
                align='end'
              >
                {/* Header con información del mensaje */}
                <DropdownMenuLabel className='border-border border-b px-2 py-1.5'>
                  <div className='text-muted-foreground mb-1 text-xs font-semibold'>
                    {t('messageContextMenu.messagePreview')}
                  </div>
                  <div className='text-foreground max-w-[200px] truncate text-sm'>
                    "
                    {message.length > 35
                      ? message.slice(0, 35) + '...'
                      : message}
                    "
                  </div>
                </DropdownMenuLabel>

                {/* Moderation Results si existen */}
                <ModerationInfo />

                {/* Actions */}
                <DropdownMenuLabel className='text-muted-foreground px-2 py-1 text-xs font-semibold'>
                  {t('messageContextMenu.messageActions')}
                </DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={onDelete}
                  className='text-destructive flex cursor-pointer items-center gap-2 rounded-none'
                >
                  <IconTrash size={16} />
                  {t('messageContextMenu.deleteThisMessage')}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className='text-muted-foreground px-2 py-1 text-xs font-semibold'>
                  {t('messageContextMenu.chatActions')}
                </DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={onClearChat}
                  className='text-destructive flex cursor-pointer items-center gap-2 rounded-none'
                >
                  <IconTrashX size={16} />
                  {t('messageContextMenu.clearEntireChat')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        // Versión para Web usando ContextMenu
        <ContextMenu>
          <ContextMenuTrigger>{children}</ContextMenuTrigger>
          <ContextMenuContent className='min-w-[240px] rounded-none'>
            {/* Header con información del mensaje */}
            <ContextMenuLabel className='border-border border-b px-2 py-1.5'>
              <div className='text-muted-foreground mb-1 text-xs font-semibold'>
                {t('messageContextMenu.messagePreview')}
              </div>
              <div className='text-foreground max-w-[200px] truncate text-sm'>
                "{message.length > 35 ? message.slice(0, 35) + '...' : message}"
              </div>
            </ContextMenuLabel>

            {/* Moderation Results si existen */}
            <ContextModerationInfo />

            {/* Actions */}
            <ContextMenuLabel className='text-muted-foreground px-2 py-1 text-xs font-semibold'>
              {t('messageContextMenu.messageActions')}
            </ContextMenuLabel>

            <ContextMenuItem
              onClick={onDelete}
              className='text-destructive flex cursor-pointer items-center gap-2 rounded-none'
            >
              <IconTrash size={16} />
              {t('messageContextMenu.deleteThisMessage')}
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuLabel className='text-muted-foreground px-2 py-1 text-xs font-semibold'>
              {t('messageContextMenu.chatActions')}
            </ContextMenuLabel>

            <ContextMenuItem
              onClick={onClearChat}
              className='text-destructive flex cursor-pointer items-center gap-2 rounded-none'
            >
              <IconTrashX size={16} />
              {t('messageContextMenu.clearEntireChat')}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </>
  )
}
