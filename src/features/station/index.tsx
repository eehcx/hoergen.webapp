import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
  useCallback
} from 'react'
import { useQueries } from '@tanstack/react-query'
import {
  IconHeart,
  IconPlayerPlay,
  IconPlayerPause,
  IconSettings,
  IconMaximize,
  IconFlag,
  IconEye,
  IconMoodSmile,
  IconHammer
} from '@tabler/icons-react'
import Picker from '@emoji-mart/react';
// Colletions types
import {
  ResponseStationDto,
  MessageResponseDto
} from '@/core/types'
// External libraries
import ColorThief from 'colorthief'
// Utilities, contexts, hooks and services
import { UserService } from '@/core/services'
import { ChatService } from '@/core/services'
import { withImageProxy } from '@/lib/utils/image'
import { getUserColor } from '@/lib/utils/chatUserHighlight'
import { useMiniPlayer } from '@/context/mini-player-context'
import { useAuth, usePermissions } from '@/hooks'
import { useGenreNames } from '@/hooks/useGenreNames'
// Shadcn UI components
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import LongText from '@/components/long-text'
import { Skeleton } from "@/components/ui/skeleton"
import { MiniPlayer } from '@/components/mini-player'

const chatService = ChatService.getInstance()

export default function Station({ station }: { station: ResponseStationDto }) {
  // User data
  const { user } = useAuth()
  const { hasRole, hasAnyRole } = usePermissions()
  // Chat hooks
  const [chatMessages, setChatMessages] = useState<MessageResponseDto[]>([])
  const [chatId, setChatId] = useState<string | null>(null)
  const unsubscribeRef = useRef<() => void>()

  const ownerId = station?.ownerId;
  const stationuuid = station?.id;

  const onMessagesUpdate = useCallback((msgs: any) => setChatMessages(msgs), []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function subscribe() {
      if (!stationuuid) return;

      // Si es RadioBrowser
      if (ownerId === "radiobrowser") {
        try {
          const id = await chatService.createEphemeralChat(stationuuid);
          if (!id) throw new Error("No se pudo crear el chat efímero");
          setChatId(id);
          if (!cancelled) {
            unsubscribe = chatService.subscribeToMessages(id, onMessagesUpdate);
          }
        } catch (err) {
          console.error("Error creando/suscribiendo chat efímero:", err);
        }
      } else {
        const id = await chatService.getChatIdByStationId(stationuuid);
        setChatId(id)
        if (chatId) {
          unsubscribe = chatService.subscribeToMessages(chatId, onMessagesUpdate);
        }
      }
    }

    subscribe();

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [stationuuid, ownerId, chatId]);


  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Color extraction for gradient background
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [gradientColors, setGradientColors] = useState<string[]>([
    'rgba(34,34,34,0.25)',
    'rgba(34,34,34,0.25)',
  ])

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
      let msg = 'Error desconocido.'
      if (e?.target?.error) {
        switch (e.target.error.code) {
          case 1:
            msg = 'Playback aborted.'
            break
          case 2:
            msg = 'Network error: Could not load the stream.'
            break
          case 3:
            msg = 'Unsupported stream format.'
            break
          case 4:
            msg =
              'Stream cannot be played (possibly geo-restricted or offline).'
            break
          default:
            msg = 'Unknown playback error.'
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
    () => Array.from(new Set(chatMessages.map(m => m.userId))),
    [chatMessages]
  )

  const userQueries = useQueries({
    queries: uniqueUserIds.map(userId => ({
      queryKey: ['userName', userId],
      queryFn: async () => {
        const userService = UserService.getInstance()
        const user = await userService.getUserById(userId)
        return user.displayName || 'Anónimo'
      },
      enabled: !!userId,
      staleTime: 1000 * 60 * 10,
    }))
  })

  const userIdToName = useMemo(
    () =>
      Object.fromEntries(
        uniqueUserIds.map((id, idx) => [id, userQueries[idx].data || id])
      ),
    [uniqueUserIds, userQueries]
  )

  // Chat Loading
  const isLoadingMessages = chatMessages === null || chatMessages === undefined
  const isLoadingNames = userQueries.some(q => q.isLoading)
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
      'popup=yes',           // Forzar popup
      'width=420',
      'height=600',
      'left=' + (screen.width - 420 - 100),  // Posición a la derecha
      'top=100',
      'resizable=yes',
      'scrollbars=no',
      'toolbar=no',          // Sin barra de herramientas
      'menubar=no',          // Sin menú
      'location=no',         // Sin barra de dirección
      'status=no',           // Sin barra de estado
      'directories=no'
    ].join(',')

    const popup = window.open(url, `chat-${station.id}`, popupFeatures)

    if (popup) {
      popup.focus()
    } else {
      alert('Please deactivate your popup blocker for open the chat')
    }
  }

  // Emojis
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiSelect = (emoji: { native: string }) => {
    setChatInput((prev) => (prev + emoji.native).slice(0, 35));
    setShowEmojiPicker(false);

    // Si usas un inputRef para enfocar el input después de seleccionar el emoji:
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pt-8 pb-32 lg:grid-cols-3'>
      {/* Main Station Info */}

      <div className='flex flex-col gap-8 lg:col-span-2'>
        {/* Station Header */}
        <div
          className='relative z-10 flex flex-col items-start gap-8 rounded-xs border p-6 text-white shadow-sm transition-all duration-500 ease-in-out md:flex-row md:items-center'
          style={{
            background: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`,
            borderRight: `1px solid ${gradientColors[1] || 'rgba(34,34,34,0.25)'}`,
            borderLeft: `1px solid ${gradientColors[0] || 'rgba(34,34,34,0.25)'}`,
          }}
        >
          <div className='pointer-events-none absolute inset-0 z-0 rounded-xs bg-black/30 backdrop-blur-md' />

          <div className='z-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-xs border bg-gradient-to-br from-zinc-200 to-zinc-400'>
            {station.coverImage ? (
              <img
                ref={imgRef}
                crossOrigin='anonymous'
                src={withImageProxy(station.coverImage)}
                alt={station.name}
                className='h-full w-full object-cover'
                onLoad={() => {
                  const img = imgRef.current
                  if (img && img.complete) {
                    try {
                      const thief = new ColorThief()
                      const palette = thief.getPalette(img, 2)
                      if (palette && palette.length >= 2) {
                        const [c1, c2] = palette
                        setGradientColors([
                          `rgba(${c1[0]},${c1[1]},${c1[2]},0.85)`,
                          `rgba(${c2[0]},${c2[1]},${c2[2]},0.85)`,
                        ])
                      } else if (palette && palette.length === 1) {
                        const c1 = palette[0]
                        setGradientColors([
                          `rgba(${c1[0]},${c1[1]},${c1[2]},0.85)`,
                          'rgba(34,34,34,0.25)',
                        ])
                      } else {
                        setGradientColors([
                          'rgba(34,34,34,0.25)',
                          'rgba(34,34,34,0.25)',
                        ])
                      }
                    } catch (err) {
                      setGradientColors([
                        'rgba(34,34,34,0.25)',
                        'rgba(34,34,34,0.25)',
                      ])
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
                    pause && pause()
                  } else {
                    play && play({ station })
                  }
                }}
                className='rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/30'
                aria-label={isCurrentStationPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isCurrentStationPlaying ? (
                  <IconPlayerPause size={22} />
                ) : (
                  <IconPlayerPlay size={22} />
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
                  <Badge variant='outline'>Cargando géneros...</Badge>
                )
              ) : (
                <Badge variant='outline'>Sin género</Badge>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2 px-2 text-sm md:px-0'>
          <p
            className='text-muted-foreground max-w-md md:max-w-xs'
            style={{ wordBreak: 'break-word' }}
          >
            {station.description || 'Sin descripción'}
          </p>

          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1 text-zinc-300'>
              <IconHeart className='h-4 w-4 text-red-500' />
              <span>{station.favoritesCount}</span>
            </div>

            <div className='text-zinc-400'>
              País:{' '}
              <span className='font-medium'>
                {station.countryId || 'Desconocido'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat estilo Twitch a la derecha */}
      <aside className='bg-card flex h-[520px] max-h-[80vh] flex-col rounded-xs border shadow-md lg:col-span-1'>
        <div className='flex items-center justify-between border-b border-zinc-200 p-2.5 dark:border-zinc-800'>
          {hasRole('listener') && (
            <div/>
          )}

          {/*OPEN Chat in a new window*/}
          {hasAnyRole(['moderator', 'pro', 'creator', 'admin']) && (
            <button
              className='hover:bg-accent rounded-sm p-1'
              onClick={openChatPopup}
              title='Open chat in a new window'
              aria-label="Open chat in a new window"
            >
              <IconMaximize size={22} />
            </button>
          )}

          <h2 className='text-sm font-bold tracking-tight'>Stream chat</h2>

          {hasAnyRole(['listener', 'pro']) && (
            <button
              className='hover:bg-accent rounded-sm p-1'
              title='Make a report'
              aria-label="Make a report"
            >
              <IconFlag size={22} />
            </button>
          )}

          {hasAnyRole(['moderator', 'creator']) && (
            <button className='hover:bg-accent rounded-sm p-1'>
              <IconEye size={22} />
            </button>
          )}

          {hasRole('admin') && (
            <button className='hover:bg-accent rounded-sm p-1'>
              <IconSettings size={22} />
            </button>
          )}

        </div>
        <div
          className='bg-card flex flex-1 flex-col gap-2 overflow-y-auto p-4'
          ref={chatContainerRef}
        >
          {isLoadingChat ? (
            <>
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-52 rounded flex-1" />
                </div>
              ))}
            </>
          ): (
            <>
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg, i) => (
                    <div key={i} className='flex items-start gap-2 text-sm leading-snug'>
                      <span
                        className='text-primary font-bold'
                        style={{ color: getUserColor(userIdToName) }}
                      >
                        {userIdToName[msg.userId]}:
                      </span>
                      <span className='text-zinc-700 dark:text-zinc-200'>
                        {msg.message}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className='pb-4 text-center text-sm text-zinc-500'>
                    <h3 className='font-inter mb-1.5 font-medium text-zinc-700 dark:text-zinc-400'>
                      {station.name}
                    </h3>
                    <span>Welcome! Kick things off with a hello.</span>
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
            placeholder='Send a message...'
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
            <div className='relative inline-block  items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400'>
              {hasAnyRole(['listener', 'pro', 'moderator', 'creator', 'admin']) && (
                <>
                  <button
                    className='hover:bg-accent rounded-full p-1'
                    ref={emojiButtonRef}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    aria-label="Insert emoji"
                    title="Insert emoji"
                  >
                    <IconMoodSmile size={22} />
                  </button>

                  {showEmojiPicker && (
                    <div
                      ref={pickerRef}
                      className="absolute left-0 bottom-full mb-1 z-50"
                    >
                      <Picker
                        onEmojiSelect={handleEmojiSelect}
                        theme="dark"
                        perLine={8}
                        emojiSize={24}
                        maxFrequentRows={3}
                        navPosition="bottom"
                      />
                    </div>
                  )}

                </>
              )}
              {hasAnyRole(['moderator', 'creator', 'admin']) && (
                <button className='hover:bg-accent rounded-full p-1'>
                  <IconHammer size={22} />
                </button>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8 rounded-full'
              >
                <IconSettings size={18} />
              </Button>
              <Button
                size='sm'
                onClick={handleSend}
                className='h-8 rounded-xs px-4 text-sm'
              >
                Chat
              </Button>
            </div>
          </div>
        </div>
      </aside>
      {/* Mini Player */}
      {player && <MiniPlayer />}
    </div>
  )
}
