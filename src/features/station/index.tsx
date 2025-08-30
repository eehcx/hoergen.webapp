import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
  useCallback,
} from 'react'
import {
  useQueries,
  //useQuery,
  // useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  IconHeart,
  IconPlayerPlay,
  IconPlayerPause,
  IconLayoutDashboard,
  IconMaximize,
  IconFlag,
  IconEye,
  IconEyeOff,
  IconMoodSmile,
  //IconHammer,
  IconCirclePlus,
  IconLink,
  //IconTrash
} from '@tabler/icons-react'
// Utilities, contexts, hooks and services
import { UserService, ChatService } from '@/core/services'
import { EventService } from '@/core/services/events/event.service'
import { ReportService } from '@/core/services/reports/report.service'
// Colletions types
import { ResponseStationDto, MessageResponseDto } from '@/core/types'
import {
  useAuth,
  usePermissions,
  useGenreNames,
  useAddFavorite,
  useRemoveFavorite,
  useFavoriteIds,
} from '@/hooks'
import { useStaticTranslation } from '@/hooks/useTranslation'
import { EmojiPicker } from '@ferrucc-io/emoji-picker'
// External libraries
import ColorThief from 'colorthief'
import { toast } from 'sonner'
import { getUserColor } from '@/lib/utils/chatUserHighlight'
import { withImageProxy } from '@/lib/utils/image'
import { getFlagEmojiFromIsoCode } from '@/utils/flagUtils'
import { useMiniPlayer } from '@/context/mini-player-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import LongText from '@/components/long-text'
import { CreateEventDialog } from './components/create-event-dialog'
import { EditEventDialog } from './components/edit-event-dialog'
import { EventContextMenu } from './components/event-context-menu'
import { EventMarqueeText } from './components/event-text'
import { MessageContextMenu } from './components/message-context-menu'
import { ReportDialog } from './components/report-dialog'
import { StationStats } from './components/station-stats'
import { useStationEvents, useCreateStationEvent } from './hooks'
import { useDeleteMessage } from './hooks/useChat'

const chatService = ChatService.getInstance()
const reportService = ReportService.getInstance()

export default function Station({ station }: { station: ResponseStationDto }) {
  const { t } = useStaticTranslation()
  // Función para ajustar colores según el tema
  const adjustColorForTheme = (
    r: number,
    g: number,
    b: number,
    isDark: boolean
  ) => {
    // Convertir RGB a HSL para manipular saturación y brillo
    const toHsl = (r: number, g: number, b: number) => {
      r /= 255
      g /= 255
      b /= 255
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b)
      let h = 0,
        s = 0
      const l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
          case g:
            h = (b - r) / d + 2
            break
          case b:
            h = (r - g) / d + 4
            break
        }
        h /= 6
      }
      return { h: h * 360, s: s * 100, l: l * 100 }
    }

    const toRgb = (h: number, s: number, l: number) => {
      h /= 360
      s /= 100
      l /= 100
      const a = s * Math.min(l, 1 - l)
      const f = (n: number) => {
        const k = (n + h * 12) % 12
        return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      }
      return {
        r: Math.round(f(0) * 255),
        g: Math.round(f(8) * 255),
        b: Math.round(f(4) * 255),
      }
    }

    const hsl = toHsl(r, g, b)

    if (isDark) {
      // En tema oscuro: aumentar saturación y ajustar brillo
      const newS = Math.min(hsl.s * 1.2, 85)
      const newL = Math.max(Math.min(hsl.l * 1.1, 65), 35)
      return toRgb(hsl.h, newS, newL)
    } else {
      // En tema claro: reducir saturación y aumentar brillo
      const newS = Math.max(hsl.s * 0.7, 25)
      const newL = Math.max(Math.min(hsl.l * 1.3, 75), 45)
      return toRgb(hsl.h, newS, newL)
    }
  }

  // User data
  const { hasRole, hasAnyRole } = usePermissions()

  // Function to determine if a message should be blurred based on toxicity and user role
  const shouldBlurMessage = (message: MessageResponseDto): boolean => {
    // Only apply filtering for listener and pro users
    const shouldApplyFilter = hasAnyRole(['listener', 'pro'])
    if (!shouldApplyFilter) return false

    return (message.moderationResult?.TOXICITY ?? 0) >= 0.85
  }
  // Chat hooks
  const [chatMessages, setChatMessages] = useState<MessageResponseDto[]>([])
  const [chatId, setChatId] = useState<string | null>(null)
  const [revealedMessages, setRevealedMessages] = useState<Set<number>>(
    new Set()
  )
  const { user } = useAuth()
  const { data: favoriteIds, isLoading: isLoadingFavorites } = useFavoriteIds(
    user?.uid || ''
  )
  const queryClient = useQueryClient()
  const addFavorite = useAddFavorite()
  const removeFavorite = useRemoveFavorite()

  // Estado local para actualización optimista de favoritos
  const [optimisticFavoriteState, setOptimisticFavoriteState] = useState<{
    isFavorited: boolean
    count: number
  } | null>(null)

  // Usar estado optimista si existe, sino el estado real
  const isFavorited =
    optimisticFavoriteState?.isFavorited ??
    !!(favoriteIds && favoriteIds.includes(station.id))
  const isFavoriteLoading =
    addFavorite.isPending || removeFavorite.isPending || isLoadingFavorites
  const favoritesCount =
    optimisticFavoriteState?.count ?? station.favoritesCount
  //const unsubscribeRef = useRef<() => void>()

  // Función para manejar toggle de favoritos con actualización optimista
  const handleFavoriteToggle = async () => {
    if (!user) return

    const currentlyFavorited =
      optimisticFavoriteState?.isFavorited ??
      !!(favoriteIds && favoriteIds.includes(station.id))
    const currentCount =
      optimisticFavoriteState?.count ?? station.favoritesCount

    // Actualización optimista inmediata
    setOptimisticFavoriteState({
      isFavorited: !currentlyFavorited,
      count: currentlyFavorited ? currentCount - 1 : currentCount + 1,
    })

    try {
      if (!currentlyFavorited) {
        await addFavorite.mutateAsync({
          userId: user.uid,
          stationId: station.id,
        })
      } else {
        await removeFavorite.mutateAsync({
          userId: user.uid,
          stationId: station.id,
        })
      }

      // Invalidar queries para sincronizar con el servidor
      await queryClient.invalidateQueries({
        queryKey: ['favoriteIds', user.uid],
      })
      await queryClient.invalidateQueries({ queryKey: ['station', station.id] })

      // No limpiar el estado optimista automáticamente - dejar que el efecto lo maneje
      // cuando los datos reales se actualicen correctamente
    } catch (error) {
      // Revertir cambio optimista en caso de error
      setOptimisticFavoriteState({
        isFavorited: currentlyFavorited,
        count: currentCount,
      })

      // Limpiar estado optimista después de mostrar el error
      setTimeout(() => setOptimisticFavoriteState(null), 2000)

      console.error('Error toggling favorite:', error)
    }
  }

  // Efecto para sincronizar estado optimista con datos reales
  useEffect(() => {
    if (optimisticFavoriteState && !isFavoriteLoading) {
      const realIsFavorited = !!(
        favoriteIds && favoriteIds.includes(station.id)
      )

      // Solo limpiar si el estado real de favoritos coincide con el optimista
      if (optimisticFavoriteState.isFavorited === realIsFavorited) {
        // Para el conteo, mantener el estado optimista si es mayor que el real
        // Esto asegura que la suma persista visualmente
        const shouldKeepOptimisticCount = 
          optimisticFavoriteState.isFavorited && 
          optimisticFavoriteState.count > station.favoritesCount

        if (!shouldKeepOptimisticCount) {
          // Solo limpiar después de más tiempo para asegurar propagación
          const timeoutId = setTimeout(() => {
            setOptimisticFavoriteState(null)
          }, 3000)
          
          return () => clearTimeout(timeoutId)
        }
      }
    }
  }, [
    favoriteIds,
    optimisticFavoriteState,
    isFavoriteLoading,
    station.id,
    station.favoritesCount,
  ])

  // Function to toggle message visibility
  const toggleMessageVisibility = (index: number) => {
    setRevealedMessages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const ownerId = station?.ownerId
  const stationuuid = station?.id
  
  // Debug: verificar permisos al cargar el componente
  useEffect(() => {
    console.log('Station component permissions debug:', {
      hasRoleAdmin: hasRole('admin'),
      hasRoleCreator: hasRole('creator'),
      hasRoleModerator: hasRole('moderator'),
      hasAnyRoleAdminCreator: hasAnyRole(['admin', 'creator']),
      user: user?.uid,
      ownerId,
      stationModerators: station.moderators
    });
  }, [hasRole, hasAnyRole, user?.uid, ownerId, station.moderators]);
  
  // Debug: verificar permisos al cargar el componente
  useEffect(() => {
    console.log('Station component permissions debug:', {
      hasRoleAdmin: hasRole('admin'),
      hasRoleCreator: hasRole('creator'),
      hasRoleModerator: hasRole('moderator'),
      hasAnyRoleAdminCreator: hasAnyRole(['admin', 'creator']),
      user: user?.uid,
      ownerId,
      stationModerators: station.moderators
    });
  }, [hasRole, hasAnyRole, user?.uid, ownerId, station.moderators]);

  const onMessagesUpdate = useCallback((msgs: any) => setChatMessages(msgs), [])

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let cancelled = false

    async function subscribe() {
      if (!stationuuid) return

      // Si es RadioBrowser
      if (ownerId === 'radiobrowser') {
        try {
          const id = await chatService.createEphemeralChat(stationuuid)
          if (!id) throw new Error('No se pudo crear el chat efímero')
          setChatId(id)
          if (!cancelled) {
            unsubscribe = chatService.subscribeToMessages(id, onMessagesUpdate)
          }
        } catch (err) {
          console.error('Error creando/suscribiendo chat efímero:', err)
        }
      } else {
        const id = await chatService.getChatIdByStationId(stationuuid)
        setChatId(id)
        if (id) {
          unsubscribe = chatService.subscribeToMessages(id, onMessagesUpdate)
        }
      }
    }

    subscribe()

    return () => {
      cancelled = true
      if (unsubscribe) unsubscribe()
    }
  }, [stationuuid, ownerId, chatId])

  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Color extraction for gradient background
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [gradientColors, setGradientColors] = useState<string[]>([
    'rgba(0,122,77,0.15)',
    'rgba(0,122,77,0.05)',
  ])
  const [, setDominantColor] = useState<string>('rgba(0,122,77,0.8)')

  // Mini player context
  const { play, player, pause } = useMiniPlayer()
  // Obtener referencia al audio del mini player
  const miniPlayerAudioRef =
    player?.station &&
    (document.querySelector('.rhap_container audio') as HTMLAudioElement | null)

  // Determinar si la estación actual está sonando
  const isCurrentStationPlaying =
    player && player.station?.id === station.id && player.isPlaying

  // Manejo de errores de audio
  const [, setAudioError] = useState<string | null>(null)

  const handleSend = async () => {
    if (!chatInput.trim() || !chatId || !user) return

    const messageData = {
      userId: user.uid,
      message: chatInput.trim(),
    }

    try {
      if (station.ownerId === 'radiobrowser') {
        await chatService.sendMessageToFirestore(chatId, messageData)
      } else {
        await chatService.addMessage(chatId, messageData)
      }
      setChatInput('')
    } catch (err) {
      console.error('Error enviando mensaje:', err)
    }
  }

  const genreNames = useGenreNames(station.genreIds, station.ownerId)

  useEffect(() => {
    if (!miniPlayerAudioRef) return
    const onError = (e: any) => {
              let msg = t('common.error')
      if (e?.target?.error) {
        switch (e.target.error.code) {
          case 1:
            msg = t('stationPage.playbackAborted')
            break
          case 2:
            msg = t('stationPage.networkError')
            break
          case 3:
            msg = t('stationPage.unsupportedFormat')
            break
          case 4:
            msg = t('stationPage.streamCannotBePlayed')
            break
          default:
            msg = t('stationPage.unknownPlaybackError')
        }
      } else if (e?.message) {
        msg = e.message
      }
      setAudioError(msg)
    }
    miniPlayerAudioRef.addEventListener('error', onError)
    return () => miniPlayerAudioRef.removeEventListener('error', onError)
  }, [miniPlayerAudioRef])

  // Dentro de Station.jsx/tsx, justo antes del return
  const uniqueUserIds = useMemo(
    () => Array.from(new Set(chatMessages.map((m) => m.userId))),
    [chatMessages]
  )

  const userQueries = useQueries({
    queries: uniqueUserIds.map((userId) => ({
      queryKey: ['userName', userId],
      queryFn: async () => {
        const userService = UserService.getInstance()
        const user = await userService.getUserById(userId)
        return user.displayName || 'Anónimo'
      },
      enabled: !!userId,
      staleTime: 1000 * 60 * 10,
    })),
  })

  const userIdToName = useMemo(() => {
    const userDataArray = userQueries.map((q) => q.data)
    return Object.fromEntries(
      uniqueUserIds.map((id, idx) => [id, userDataArray[idx] || id])
    )
  }, [uniqueUserIds, userQueries.map((q) => q.data).join(',')])

  // Chat Loading
  const isLoadingMessages = chatMessages === null || chatMessages === undefined
  const isLoadingNames = userQueries.some((q) => q.isLoading)
  const isLoadingChat = isLoadingMessages || isLoadingNames

  useLayoutEffect(() => {
    // si sigue cargando, no hagas nada
    if (isLoadingChat) return
    const c = chatContainerRef.current
    if (!c) return

    // en el siguiente frame, muévete al fondo
    const handle = requestAnimationFrame(() => {
      c.scrollTop = c.scrollHeight
    })
    return () => cancelAnimationFrame(handle)
  }, [chatMessages, isLoadingChat])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Maximize Window
  const openChatPopup = () => {
    const url = `/s/chat-popup?stationId=${station.id}&stationName=${encodeURIComponent(station.name)}&ownerId=${station.ownerId}`

    const popupFeatures = [
      'popup=yes', // Forzar popup
      'width=420',
      'height=600',
      'left=' + (screen.width - 420 - 100), // Posición a la derecha
      'top=100',
      'resizable=yes',
      'scrollbars=no',
      'toolbar=no', // Sin barra de herramientas
      'menubar=no', // Sin menú
      'location=no', // Sin barra de dirección
      'status=no', // Sin barra de estado
      'directories=no',
    ].join(',')

    const popup = window.open(url, `chat-${station.id}`, popupFeatures)

    if (popup) {
      popup.focus()
    } else {
      alert(t('stationPage.chatPopupBlockerWarning'))
    }
  }

  // Emojis
  const inputRef = useRef<HTMLInputElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiButtonRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const handleEmojiSelect = (emoji: string) => {
    setChatInput((prev) => (prev + emoji).slice(0, 35))
    setShowEmojiPicker(false)

    // Si usas un inputRef para enfocar el input después de seleccionar el emoji:
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  // Eventos
  const {
    data: events,
    isLoading: isLoadingEvents,
    refetch,
  } = useStationEvents(station.id)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState<{
    title: string
    description: string
  }>({ title: '', description: '' })
  const [editEventId, setEditEventId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isEditError, setIsEditError] = useState(false)
  const deleteMessage = useDeleteMessage()
  const {
    form: eventForm,
    setForm: setEventForm,
    mutate: createEvent,
    isPending: isCreatingEvent,
    isError: isCreateEventError,
  } = useCreateStationEvent(station.id, () => setShowEventModal(false))
  const [showReportModal, setShowReportModal] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [isReportError, setIsReportError] = useState(false)

  // Edit event handler
  const handleEditEvent = async () => {
    if (!editEventId) return
    setIsEditing(true)
    setIsEditError(false)
    try {
      await EventService.getInstance().updateEvent(editEventId, editForm)
      setShowEditModal(false)
      refetch()
      await queryClient.invalidateQueries({
        queryKey: ['stationEvents', station.id],
      })
    } catch (_err) {
      setIsEditError(true)
    } finally {
      setIsEditing(false)
    }
  }

  const handleReportSubmit = async (data: {
    userId: string
    targetType: 'station'
    targetId: string
    reason: string
    details: string
    status: 'pending'
  }) => {
    setIsReporting(true)
    setIsReportError(false)
    try {
      await reportService.createReport(data)
      setShowReportModal(false)
    } catch (_err) {
      setIsReportError(true)
    } finally {
      setIsReporting(false)
    }
  }

  // Delete event handler
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await EventService.getInstance().deleteEvent(eventId)
      // Refetch events immediately after deletion
      refetch()
      await queryClient.invalidateQueries({
        queryKey: ['stationEvents', station.id],
      })
    } catch (err) {
      console.error('Error deleting event:', err)
    }
  }

  // Delete message handler
  const handleDeleteMessage = (messageId: string) => {
    if (!chatId) return
    deleteMessage.mutate({ chatId, messageId })
  }

  // Clear entire chat handler
  const handleClearChat = async () => {
    if (!chatId) return

    try {
      // Confirmar la acción con el usuario
      const confirmed = window.confirm(
        t('chatWindow.clearChatConfirm')
      )
      if (!confirmed) return

      await chatService.clearChat(chatId)
      setChatMessages([]) // Limpiar mensajes localmente
      toast.success(t('chatWindow.chatClearedSuccess'))
    } catch (error) {
      console.error('Error clearing chat:', error)
              toast.error(t('chatWindow.chatClearFailed'))
    }
  }

  return (
    <div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pt-8 pb-32 lg:grid-cols-3'>
      {/* Columna principal: eventos + header + info */}
      <div className='flex flex-col gap-8 lg:col-span-2'>
        {/* Eventos Marquee/Slider arriba del header */}
        <div className='relative mb-2'>
          <div className='flex w-full items-center'>
            {/* Marquee de eventos, scroll infinito horizontal */}
            <div className='flex-1 overflow-x-hidden'>
              <div className='flex h-14 w-full items-center border-t border-b border-zinc-200 dark:border-zinc-800'>
                {isLoadingEvents ? (
                  <span className='px-4 text-zinc-400'>{t('stationPage.loadingEvents')}</span>
                ) : events && events.length > 0 ? (
                  <div className='animate-marquee flex h-full w-full items-center gap-8 whitespace-nowrap'>
                    {[...events, ...events].map((ev, idx) => {
                      // Check if current user is station moderator
                      const isStationModerator =
                        station.moderators &&
                        station.moderators.includes(user?.uid || '')

                      return (hasAnyRole(['admin', 'creator']) &&
                        user?.uid === ownerId) ||
                        (hasRole('admin') && user?.uid !== ownerId) ||
                        (hasRole('creator') && user?.uid === ownerId) ||
                        (hasRole('moderator') && isStationModerator) ? (
                        <EventContextMenu
                          key={ev.id + '-' + idx}
                          eventId={ev.id}
                          event={{
                            title: ev.title,
                            description: ev.description,
                          }}
                          onEdit={() => {
                            setEditEventId(ev.id)
                            setEditForm({
                              title: ev.title,
                              description: ev.description,
                            })
                            setShowEditModal(true)
                          }}
                          onAdd={() => setShowEventModal(true)}
                          onDeleted={() => {
                            handleDeleteEvent(ev.id)
                          }}
                        >
                          <div className='relative flex h-full min-w-[220px] flex-col justify-center px-2 py-0'>
                            <div className='flex flex-row items-center gap-2'>
                              <span className='text-base font-bold text-zinc-800 capitalize dark:text-zinc-100'>
                                {ev.title}
                              </span>
                              <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                                {ev.createdAt
                                  ? (() => {
                                      const date =
                                        typeof ev.createdAt === 'string'
                                          ? new Date(ev.createdAt)
                                          : new Date(
                                              ev.createdAt._seconds * 1000
                                            )
                                      return date.toLocaleString('en-US', {
                                        weekday: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                      })
                                    })()
                                  : null}
                              </span>
                            </div>
                            <EventMarqueeText text={ev.description} />
                          </div>
                        </EventContextMenu>
                      ) : (
                        <div
                          key={ev.id + '-' + idx}
                          className='relative flex h-full min-w-[220px] flex-col justify-center px-2 py-0'
                        >
                          <div className='flex flex-row items-center gap-2'>
                            <span className='text-base font-bold text-zinc-800 capitalize dark:text-zinc-100'>
                              {ev.title}
                            </span>
                            <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                              {ev.createdAt
                                ? (() => {
                                    const date =
                                      typeof ev.createdAt === 'string'
                                        ? new Date(ev.createdAt)
                                        : new Date(ev.createdAt._seconds * 1000)
                                    return date.toLocaleString('en-US', {
                                      weekday: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                    })
                                  })()
                                : null}
                            </span>
                          </div>
                          <EventMarqueeText text={ev.description} />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <span className='px-4 text-zinc-400'>
                    {t('stationPage.noEventsForStation')}
                  </span>
                )}
                <style>{`
                  @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 40s linear infinite;
                    height: 100%;
                    align-items: center;
                  }
                `}</style>
              </div>
            </div>

            {/* Botón de crear evento fijo a la derecha */}
            {(hasAnyRole(['admin', 'creator']) && user?.uid === ownerId) ||
              (hasRole('admin') && user?.uid !== ownerId) ? (
              <button
                className='hover:text-primary ml-4 flex items-center justify-center gap-1 rounded-xs bg-transparent px-2 py-1 text-sm font-medium text-zinc-500 transition-colors'
                style={{ borderRadius: 0 }}
                onClick={() => setShowEventModal(true)}
                title={t('stationPage.createEventAndUpdates')}
                aria-label={t('stationPage.createEventAndUpdates')}
              >
                <IconCirclePlus size={18} className='inline-block' />
                {t('stationPage.addEvent')}
              </button>
            ) : null}
          </div>

          {/* Renderizar modales para usuarios con permisos */}
          {(hasAnyRole(['admin', 'creator']) && user?.uid === ownerId) ||
            (hasRole('admin') && user?.uid !== ownerId) ||
            (hasRole('moderator') &&
              station.moderators &&
              station.moderators.includes(user?.uid || '')) ? (
            <>
              {/* Modal para crear evento, all in English and rect styles */}
              <CreateEventDialog
                open={showEventModal}
                onOpenChange={setShowEventModal}
                form={eventForm}
                setForm={setEventForm as any}
                onSubmit={() => createEvent(eventForm)}
                isPending={isCreatingEvent}
                isError={isCreateEventError}
              />
              {/* Modal para editar evento */}
              <EditEventDialog
                open={showEditModal}
                onOpenChange={setShowEditModal}
                form={editForm}
                setForm={setEditForm}
                onSubmit={async () => {
                  await handleEditEvent()
                  refetch()
                }}
                isPending={isEditing}
                isError={isEditError}
              />
            </>
          ) : null}

          {/* Report Dialog - Available for all authenticated users */}
          {user && (
            <ReportDialog
              open={showReportModal}
              onOpenChange={setShowReportModal}
              stationName={station.name}
              stationId={station.id}
              userId={user?.uid || ''}
              onSubmit={handleReportSubmit}
              isPending={isReporting}
              isError={isReportError}
            />
          )}
        </div>
        {/* Station Header + Info */}
        <div className='flex flex-col gap-8'>
          {/* Station Header */}
          <div
            className='relative z-10 flex flex-col items-start gap-8 rounded-xs border p-6 text-white shadow-sm transition-all duration-500 ease-in-out md:flex-row md:items-center'
            style={{
              background: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`,
              borderRight: `1px solid ${gradientColors[1] || 'rgba(34,34,34,0.25)'}`,
              borderLeft: `1px solid ${gradientColors[0] || 'rgba(34,34,34,0.25)'}`,
            }}
          >
            <div className='pointer-events-none absolute inset-0 z-0 rounded-xs bg-black/20 backdrop-blur-md dark:bg-black/40' />
            <div className='z-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-xs border bg-gradient-to-br from-zinc-200 to-zinc-400'>
              {station.coverImage ? (
                <img
                  ref={imgRef}
                  crossOrigin='anonymous'
                  src={withImageProxy(station.coverImage)}
                  alt={station.name}
                  className='h-full w-full object-cover select-none'
                  draggable={false}
                  onLoad={() => {
                    const img = imgRef.current
                    if (img && img.complete) {
                      try {
                        const thief = new ColorThief()
                        const dominantColorRgb = thief.getColor(img)

                        if (dominantColorRgb) {
                          const [r, g, b] = dominantColorRgb

                          // Detectar tema oscuro
                          const isDark =
                            document.documentElement.classList.contains('dark')

                          // Ajustar saturación y brillo según el tema
                          const adjustedColor = adjustColorForTheme(
                            r,
                            g,
                            b,
                            isDark
                          )

                          // Crear gradiente estilo SoundCloud con un solo color dominante
                          const startOpacity = isDark ? 0.4 : 0.7
                          const endOpacity = isDark ? 0.07 : 0.6

                          setGradientColors([
                            `rgba(${adjustedColor.r},${adjustedColor.g},${adjustedColor.b},${startOpacity})`,
                            `rgba(${adjustedColor.r},${adjustedColor.g},${adjustedColor.b},${endOpacity})`,
                          ])

                          // Color para elementos que necesitan contraste
                          setDominantColor(
                            `rgba(${adjustedColor.r},${adjustedColor.g},${adjustedColor.b},0.9)`
                          )
                        } else {
                          const fallback =
                            document.documentElement.classList.contains('dark')
                              ? {
                                  start: 'rgba(64,64,64,0.3)',
                                  end: 'rgba(64,64,64,0.1)',
                                  dominant: 'rgba(64,64,64,0.8)',
                                }
                              : {
                                  start: 'rgba(200,200,200,0.2)',
                                  end: 'rgba(200,200,200,0.05)',
                                  dominant: 'rgba(100,100,100,0.7)',
                                }

                          setGradientColors([fallback.start, fallback.end])
                          setDominantColor(fallback.dominant)
                        }
                      } catch (err) {
                        const fallback =
                          document.documentElement.classList.contains('dark')
                            ? {
                                start: 'rgba(64,64,64,0.3)',
                                end: 'rgba(64,64,64,0.1)',
                                dominant: 'rgba(64,64,64,0.8)',
                              }
                            : {
                                start: 'rgba(200,200,200,0.2)',
                                end: 'rgba(200,200,200,0.05)',
                                dominant: 'rgba(100,100,100,0.7)',
                              }

                        setGradientColors([fallback.start, fallback.end])
                        setDominantColor(fallback.dominant)
                        console.error('Color extraction failed', err)
                      }
                    }
                  }}
                />
              ) : (
                <span className='text-4xl font-bold text-zinc-500'>🎵</span>
              )}
            </div>
            <div className='z-10 min-w-0 flex-1'>
              <div className='mb-4 flex items-center gap-4'>
                <button
                  onClick={() => {
                    if (isCurrentStationPlaying) {
                      if (pause) pause()
                    } else {
                      if (play) play({ station })
                    }
                  }}
                  className='rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/30'
                  aria-label={isCurrentStationPlaying ? t('stationPage.pause') : t('stationPage.play')}
                >
                  {isCurrentStationPlaying ? (
                    <IconPlayerPause size={22} fill='#fff' />
                  ) : (
                    <IconPlayerPlay size={22} fill='#fff' />
                  )}
                </button>
                <h1 className='font-[Inter] text-3xl leading-tight font-bold tracking-tight'>
                  <LongText
                    className='max-w-xs'
                    contentClassName='max-w-xs whitespace-normal'
                  >
                    {station.name.length > 25
                      ? station.name.slice(0, 25) + '...'
                      : station.name}
                  </LongText>
                </h1>
              </div>
              <div className='scrollbar-none -mx-1 mb-4 flex flex-nowrap gap-2 overflow-x-auto px-1 py-2'>
                {station.genreIds?.length ? (
                  station.ownerId === 'radiobrowser' ? (
                    station.genreIds.map((g, i) => (
                      <Badge
                        key={i}
                        className='shrink-0 rounded-xs border border-white/20 bg-white/10 text-xs tracking-wide text-white uppercase backdrop-blur-sm select-none dark:border-white/10 dark:bg-white/10'
                      >
                        {g}
                      </Badge>
                    ))
                  ) : genreNames ? (
                    genreNames.map((name, i) => (
                      <Badge
                        key={i}
                        className='shrink-0 rounded-xs border border-white/20 bg-white/10 text-xs tracking-wide text-white uppercase backdrop-blur-sm select-none dark:border-white/10 dark:bg-white/10'
                      >
                        {name}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant='outline'>{t('stationPage.loadingGenres')}</Badge>
                  )
                ) : (
                                      <Badge variant='outline'>{t('stationPage.noGenre')}</Badge>
                )}
              </div>
            </div>
          </div>
          {/* Info estación */}
          <div className='flex flex-col gap-2 px-2 text-sm md:px-0'>
            <div className='flex items-start justify-between gap-4'>
              <p
                className='text-muted-foreground max-w-md md:max-w-xs'
                style={{ wordBreak: 'break-word' }}
              >
                {station.description || 'No description available.'}
              </p>
              {/* Agrupa bandera y botones */}
              <div className='flex items-center gap-4'>
                {station.countryId && (
                  <span className='text-2xl'>
                    {getFlagEmojiFromIsoCode(station.countryId)}
                  </span>
                )}

                {/* Botón de compartir */}
                <button
                  className='flex items-center justify-center rounded bg-zinc-100 px-3 py-2 text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                  onClick={() => {
                    const url = window.location.href
                    navigator.clipboard
                      .writeText(url)
                      .then(() => {
                        toast.success(t('stationPage.linkCopiedToClipboard'))
                      })
                      .catch(() => {
                        // Fallback para navegadores más antiguos
                        try {
                          const textArea = document.createElement('textarea')
                          textArea.value = url
                          document.body.appendChild(textArea)
                          textArea.select()
                          document.execCommand('copy')
                          document.body.removeChild(textArea)
                          toast.success(t('stationPage.linkCopiedToClipboard'))
                        } catch (_error) {
                          toast.error(t('stationPage.failedToCopyLink'))
                        }
                      })
                  }}
                  aria-label={t('stationPage.shareStationLink')}
                  title={t('stationPage.copyLinkToClipboard')}
                >
                  <IconLink className='h-4 w-4' />
                </button>

                {station.ownerId === 'radiobrowser' ? (
                  <span className='flex items-center gap-1 rounded px-3 py-2 text-zinc-700 dark:text-zinc-200'>
                    <IconHeart
                      className='h-4 w-4 text-zinc-400 dark:text-zinc-300'
                      fill='none'
                    />
                    <span>{station.favoritesCount}</span>
                  </span>
                ) : (
                  <button
                    className={`flex items-center gap-1 rounded px-3 py-2 transition-colors ${
                      isFavorited
                        ? 'bg-green-600 text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                    } ${isFavoriteLoading ? 'pointer-events-none opacity-60' : ''}`}
                    onClick={handleFavoriteToggle}
                    aria-label={
                      isFavorited ? t('stationPage.removeFromFavorites') : t('stationPage.addToFavorites')
                    }
                    title={
                      isFavorited ? t('stationPage.removeFromFavorites') : t('stationPage.addToFavorites')
                    }
                    style={
                      isFavorited
                        ? { borderColor: '#26E056', backgroundColor: '#26E056' }
                        : {}
                    }
                  >
                    <IconHeart
                      className={`h-4 w-4 ${isFavorited ? 'text-white' : 'text-zinc-400 dark:text-zinc-300'}`}
                      fill={isFavorited ? '#fff' : 'none'}
                    />
                    <span>{favoritesCount}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          {hasAnyRole(['creator', 'admin']) && user?.uid === ownerId && (
            <StationStats stationId={station.id} chatId={chatId} />
          )}
        </div>
      </div>
      {/* Chat estilo Twitch a la derecha */}
      <aside className='bg-card flex h-[540px] max-h-[90vh] flex-col rounded-xs border shadow-md lg:col-span-1'>
        <div className='flex items-center justify-between border-b border-zinc-200 p-2.5 dark:border-zinc-800'>
          {hasAnyRole(['listener', 'pro']) && <div />}

          {/* Botón para abrir chat en popup - disponible para propietarios, moderadores y administradores */}
          {(() => {
            // Lógica simplificada: mostrar botón para admin, creator o moderadores de la estación
            const isAdmin = hasRole('admin');
            const isCreator = hasRole('creator');
            const isModerator = hasRole('moderator') && station.moderators?.includes(user?.uid || '');
            
            const shouldShowButton = isAdmin || isCreator || isModerator;
            
            console.log('Chat popup button debug:', {
              isAdmin,
              isCreator,
              isModerator,
              shouldShowButton,
              userId: user?.uid,
              ownerId,
              stationModerators: station.moderators
            });
            
            return shouldShowButton ? (
              <button
                className='hover:bg-accent rounded-sm p-1'
                onClick={openChatPopup}
                title={t('stationPage.openChatInNewWindow')}
                aria-label={t('stationPage.openChatInNewWindow')}
              >
                <IconMaximize size={22} />
              </button>
            ) : null;
          })()}

          <h2 className='text-sm font-bold tracking-tight'>{t('stationPage.streamChat')}</h2>

          {hasAnyRole(['listener', 'pro', 'moderator']) && (
            <button
              className='hover:bg-accent rounded-sm p-1'
              title={t('stationPage.makeReport')}
              aria-label={t('stationPage.makeReport')}
              onClick={() => setShowReportModal(true)}
            >
              <IconFlag size={22} />
            </button>
          )}

          {hasAnyRole(['creator', 'admin']) && user?.uid === ownerId && (
            <Link 
              to='/creator' 
              className='hover:bg-accent rounded-sm p-1'
              title={t('stationPage.goToCreatorDashboard')}
              aria-label={t('stationPage.goToCreatorDashboard')}
            >
              <IconLayoutDashboard size={22} />
            </Link>
          )}

          {hasRole('admin') && user?.uid !== ownerId && <div />}
        </div>
        <div
          className='bg-card flex flex-1 flex-col gap-2 overflow-y-auto p-4'
          ref={chatContainerRef}
        >
          {isLoadingChat ? (
            <>
              {[...Array(15)].map((_, i) => (
                <div key={i} className='mb-2 flex items-start gap-2'>
                  <Skeleton className='h-4 w-16 rounded' />
                  <Skeleton className='h-4 w-52 flex-1 rounded' />
                </div>
              ))}
            </>
          ) : (
            <>
              {chatMessages.length > 0 ? (
                chatMessages.map((msg, i) => {
                  const isBlurred = shouldBlurMessage(msg)
                  const isRevealed = revealedMessages.has(i)
                  const shouldShowBlurred = isBlurred && !isRevealed

                  const messageContent = (
                    <div className='group flex items-start gap-2 text-sm leading-snug'>
                      <span
                        className='text-primary font-bold'
                        style={{
                          color: getUserColor(userIdToName[msg.userId]),
                        }}
                      >
                        {userIdToName[msg.userId]}:
                      </span>
                      <div className='relative flex-1'>
                        <span
                          className={`block break-words text-zinc-700 dark:text-zinc-200 ${
                            shouldShowBlurred ? 'blur-sm' : ''
                          }`}
                          style={{ paddingRight: isBlurred ? '2rem' : '0' }}
                        >
                          {msg.message}
                        </span>
                        {isBlurred && (
                          <button
                            onClick={() => toggleMessageVisibility(i)}
                            className='hover:bg-muted/70 absolute top-0 right-0 ml-2 rounded-md p-1 opacity-70 transition-all duration-200 hover:opacity-100'
                            title={
                              isRevealed
                                ? t('stationPage.hideToxicContent')
                                : t('stationPage.showToxicContent')
                            }
                            style={{ transform: 'translateY(-2px)' }}
                          >
                            {isRevealed ? (
                              <IconEyeOff className='text-muted-foreground h-3.5 w-3.5' />
                            ) : (
                              <IconEye className='text-muted-foreground h-3.5 w-3.5' />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )

                  return (
                    <div key={i}>
                      {(hasAnyRole(['admin', 'creator']) &&
                        user?.uid === ownerId) ||
                      (hasRole('moderator') &&
                        station.moderators &&
                        station.moderators.includes(user?.uid || '')) ? (
                        <MessageContextMenu
                          messageId={msg.id}
                          message={msg.message}
                          moderationResult={msg.moderationResult}
                          onDelete={() => handleDeleteMessage(msg.id)}
                          onClearChat={handleClearChat}
                        >
                          {messageContent}
                        </MessageContextMenu>
                      ) : (
                        messageContent
                      )}
                    </div>
                  )
                })
              ) : (
                <div className='pb-4 text-center text-sm text-zinc-500'>
                  <h3 className='font-inter mb-1.5 font-medium text-zinc-700 dark:text-zinc-400'>
                    {station.name}
                  </h3>
                  <span>{t('stationPage.welcomeMessage')}</span>
                </div>
              )}
            </>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className='border-t border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900'>
          <input
            type='text'
            aria-label='Chat input'
            className='focus:ring-primary/30 mb-2 w-full rounded-xs border border-zinc-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800'
            placeholder={t('stationPage.sendMessage')}
            ref={inputRef}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            maxLength={40}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
          />

          <div className='flex items-center justify-between gap-2'>
            {/*flex */}
            <div className='relative inline-block items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400'>
              {hasAnyRole([
                'listener',
                'pro',
                'moderator',
                'creator',
                'admin',
              ]) && (
                <>
                  <button
                    className='hover:bg-accent rounded-full p-1'
                    ref={emojiButtonRef}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    aria-label={t('stationPage.insertEmoji')}
                    title={t('stationPage.insertEmoji')}
                  >
                    <IconMoodSmile size={22} />
                  </button>

                  {showEmojiPicker && (
                    <div
                      ref={pickerRef}
                      className='absolute bottom-full left-0 z-50 mb-1'
                    >
                      <EmojiPicker
                        onEmojiSelect={handleEmojiSelect}
                        className='rounded-lg border border-zinc-200 dark:border-zinc-800'
                        emojisPerRow={8}
                        emojiSize={24}
                      >
                        <EmojiPicker.Header className='p-2 pb-0'>
                          <EmojiPicker.Input
                            placeholder={t('stationPage.searchEmoji')}
                            className='focus:ring-primary/50 w-full rounded border px-2 py-1 text-sm focus:ring-1 focus:outline-none'
                          />
                        </EmojiPicker.Header>
                        <EmojiPicker.Group>
                          <EmojiPicker.List containerHeight={300} />
                        </EmojiPicker.Group>
                      </EmojiPicker>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className='flex items-center gap-2'>
                              <Button
                  size='sm'
                  onClick={handleSend}
                  className='h-8 rounded-xs px-4 text-sm'
                >
                  {t('stationPage.chat')}
                </Button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
