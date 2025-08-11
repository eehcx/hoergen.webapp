# 📻 Funcionalidades de Radio

## 📋 Descripción General

Las funcionalidades de radio de **Hoergen WebApp** proporcionan una experiencia completa de streaming de audio en vivo, incluyendo reproductor de audio, chat en vivo, gestión de estaciones y eventos. El sistema está diseñado para manejar múltiples estaciones simultáneamente con funcionalidades avanzadas de moderación y analytics.

## 🎵 Reproductor de Audio

### Características Principales

#### 1. **Streaming en Vivo**
- Soporte para múltiples formatos de audio (MP3, AAC, OGG)
- Buffer adaptativo para conexiones inestables
- Calidad de audio configurable
- Indicadores de estado de conexión

#### 2. **Controles de Reproducción**
- Play/Pause
- Control de volumen con slider
- Mute/Unmute
- Indicador de tiempo de reproducción
- Barra de progreso (para contenido grabado)

#### 3. **Gestión de Estaciones**
- Cambio rápido entre estaciones
- Lista de favoritos
- Historial de reproducción
- Búsqueda y filtrado

### Implementación del Reproductor

#### AudioPlayer Component
```tsx
import { useRef, useEffect, useState } from 'react'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'

interface AudioPlayerProps {
  station: Station
  autoPlay?: boolean
  onError?: (error: Error) => void
}

export const AudioPlayer = ({ station, autoPlay = false, onError }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    volume,
    play, 
    pause, 
    setVolume,
    setCurrentTime 
  } = useAudioPlayer(audioRef, station.streamUrl)

  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
  }

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        preload="none"
        onError={(e) => onError?.(e as any)}
      />
      
      <div className="controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        
        <VolumeSlider 
          value={volume}
          onChange={handleVolumeChange}
        />
        
        <div className="station-info">
          <h3>{station.name}</h3>
          <p>{station.genre}</p>
        </div>
      </div>
    </div>
  )
}
```

#### Hook useAudioPlayer
```tsx
import { useState, useEffect, useCallback } from 'react'

interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isLoading: boolean
  error: string | null
}

export const useAudioPlayer = (
  audioRef: React.RefObject<HTMLAudioElement>,
  streamUrl: string
) => {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
    error: null
  })

  const play = useCallback(async () => {
    if (audioRef.current) {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))
        await audioRef.current.play()
        setState(prev => ({ ...prev, isPlaying: true, isLoading: false }))
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error.message, 
          isLoading: false 
        }))
      }
    }
  }, [audioRef])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setState(prev => ({ ...prev, isPlaying: false }))
    }
  }, [audioRef])

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      setState(prev => ({ ...prev, volume }))
    }
  }, [audioRef])

  // Event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }))
    }

    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration }))
    }

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }))
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioRef])

  return {
    ...state,
    play,
    pause,
    setVolume
  }
}
```

### Mini Player

El mini player proporciona controles compactos para navegación mientras se reproduce audio:

```tsx
import { useMiniPlayer } from '@/context/mini-player-context'

export const MiniPlayer = () => {
  const { 
    currentStation, 
    isPlaying, 
    togglePlayPause,
    nextStation,
    previousStation 
  } = useMiniPlayer()

  if (!currentStation) return null

  return (
    <div className="mini-player">
      <div className="station-info">
        <img src={currentStation.logo} alt={currentStation.name} />
        <div>
          <h4>{currentStation.name}</h4>
          <p>{currentStation.genre}</p>
        </div>
      </div>
      
      <div className="controls">
        <button onClick={previousStation}>
          <SkipBackIcon />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={nextStation}>
          <SkipForwardIcon />
        </button>
      </div>
    </div>
  )
}
```

## 💬 Sistema de Chat en Vivo

### Características del Chat

#### 1. **Chat en Tiempo Real**
- WebSocket para comunicación instantánea
- Indicadores de escritura
- Notificaciones de nuevos mensajes
- Historial de mensajes persistente

#### 2. **Moderación de Contenido**
- Filtros automáticos de contenido
- Sistema de reportes
- Timeouts y bans temporales
- Logs de moderación

#### 3. **Funcionalidades Sociales**
- Emojis y reacciones
- Mención de usuarios (@username)
- Respuestas a mensajes
- Modo solo lectura para oyentes

### Implementación del Chat

#### ChatWindow Component
```tsx
import { useState, useEffect, useRef } from 'react'
import { useStationChat } from '@/hooks/chat/useStationChat'
import { ChatMessage } from '@/components/station/chat-message'
import { ChatInput } from '@/components/station/chat-input'

interface ChatWindowProps {
  stationId: string
  user: User
  isModerator: boolean
}

export const ChatWindow = ({ stationId, user, isModerator }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { 
    messages, 
    sendMessage, 
    deleteMessage,
    banUser,
    isLoading,
    error 
  } = useStationChat(stationId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content: string) => {
    sendMessage({
      content,
      stationId,
      userId: user.id,
      timestamp: new Date().toISOString()
    })
  }

  const handleModerate = (messageId: string, action: 'delete' | 'ban') => {
    if (action === 'delete') {
      deleteMessage(messageId)
    } else if (action === 'ban') {
      const message = messages.find(m => m.id === messageId)
      if (message) {
        banUser(message.userId, 3600) // 1 hora
      }
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Chat en Vivo</h3>
        <span className="online-count">
          {messages.length} usuarios online
        </span>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            currentUser={user}
            isModerator={isModerator}
            onModerate={handleModerate}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={!user.canChat}
        placeholder="Escribe un mensaje..."
      />
    </div>
  )
}
```

#### Hook useStationChat
```tsx
import { useState, useEffect, useCallback } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { chatService } from '@/core/services/chat.service'

export const useStationChat = (stationId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { 
    sendMessage: wsSendMessage, 
    lastMessage, 
    connectionStatus 
  } = useWebSocket(`ws://api.hoergen.app/chat/${stationId}`)

  // Cargar mensajes iniciales
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true)
        const response = await chatService.getMessages(stationId)
        setMessages(response.data)
      } catch (err) {
        setError('Error al cargar mensajes')
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [stationId])

  // Procesar mensajes del WebSocket
  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage)
      setMessages(prev => [...prev, message])
    }
  }, [lastMessage])

  const sendMessage = useCallback(async (messageData: Partial<ChatMessage>) => {
    try {
      // Enviar por WebSocket para tiempo real
      wsSendMessage(JSON.stringify(messageData))
      
      // Persistir en backend
      await chatService.sendMessage(messageData)
    } catch (error) {
      setError('Error al enviar mensaje')
    }
  }, [wsSendMessage])

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await chatService.deleteMessage(messageId)
      setMessages(prev => prev.filter(m => m.id !== messageId))
    } catch (error) {
      setError('Error al eliminar mensaje')
    }
  }, [])

  const banUser = useCallback(async (userId: string, duration: number) => {
    try {
      await chatService.banUser(stationId, userId, duration)
      // Actualizar estado local si es necesario
    } catch (error) {
      setError('Error al banear usuario')
    }
  }, [stationId])

  return {
    messages,
    sendMessage,
    deleteMessage,
    banUser,
    isLoading,
    error,
    connectionStatus
  }
}
```

## 🏢 Gestión de Estaciones

### Estructura de Estación

```typescript
interface Station {
  id: string
  name: string
  slug: string
  description: string
  genre: string
  streamUrl: string
  logo: string
  banner: string
  creator: User
  moderators: User[]
  tags: string[]
  status: 'active' | 'inactive' | 'suspended'
  createdAt: Date
  updatedAt: Date
  
  // Estadísticas
  listeners: number
  totalPlays: number
  rating: number
  
  // Configuración
  allowChat: boolean
  chatModeration: 'none' | 'basic' | 'strict'
  autoDj: boolean
  schedule: Event[]
}
```

### Creación y Edición de Estaciones

#### StationForm Component
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { stationSchema } from '@/lib/validations/station'

interface StationFormProps {
  station?: Station
  onSubmit: (data: StationFormData) => Promise<void>
}

export const StationForm = ({ station, onSubmit }: StationFormProps) => {
  const form = useForm<StationFormData>({
    resolver: zodResolver(stationSchema),
    defaultValues: station || {
      name: '',
      description: '',
      genre: '',
      streamUrl: '',
      allowChat: true,
      chatModeration: 'basic'
    }
  })

  const handleSubmit = async (data: StationFormData) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      console.error('Error al guardar estación:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Estación</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Mi Estación de Música" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe tu estación..."
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Género Musical</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronic">Electrónica</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="techno">Techno</SelectItem>
                  <SelectItem value="trance">Trance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="streamUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del Stream</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://stream.example.com/live" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="allowChat"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Permitir chat en vivo</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {station ? 'Actualizar Estación' : 'Crear Estación'}
        </Button>
      </form>
    </Form>
  )
}
```

## 📅 Sistema de Eventos

### Estructura de Evento

```typescript
interface Event {
  id: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  stationId: string
  dj: User
  genre: string
  tags: string[]
  status: 'scheduled' | 'live' | 'ended' | 'cancelled'
  
  // Configuración
  isRecurring: boolean
  recurrencePattern?: 'daily' | 'weekly' | 'monthly'
  maxListeners?: number
  
  // Estadísticas
  peakListeners: number
  totalDuration: number
  chatMessages: number
}
```

### Gestión de Eventos

#### EventForm Component
```tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar } from '@/components/ui/calendar'
import { TimePicker } from '@/components/ui/time-picker'

export const EventForm = ({ event, onSubmit }: EventFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    event?.startTime
  )
  const [startTime, setStartTime] = useState<string>(
    event?.startTime.toTimeString().slice(0, 5) || '12:00'
  )
  const [endTime, setEndTime] = useState<string>(
    event?.endTime.toTimeString().slice(0, 5) || '13:00'
  )

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event || {
      title: '',
      description: '',
      genre: '',
      isRecurring: false
    }
  })

  const handleSubmit = async (data: EventFormData) => {
    if (!selectedDate) return

    const startDateTime = new Date(selectedDate)
    const [startHour, startMinute] = startTime.split(':').map(Number)
    startDateTime.setHours(startHour, startMinute, 0, 0)

    const endDateTime = new Date(selectedDate)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    endDateTime.setHours(endHour, endMinute, 0, 0)

    const eventData = {
      ...data,
      startTime: startDateTime,
      endTime: endDateTime
    }

    await onSubmit(eventData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del Evento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Mi Set de Techno" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Fecha</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Hora de Inicio</label>
              <TimePicker
                value={startTime}
                onChange={setStartTime}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Hora de Fin</label>
              <TimePicker
                value={endTime}
                onChange={setEndTime}
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe tu evento..."
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {event ? 'Actualizar Evento' : 'Crear Evento'}
        </Button>
      </form>
    </Form>
  )
}
```

## 📊 Analytics y Estadísticas

### Métricas de Estación

```typescript
interface StationAnalytics {
  stationId: string
  period: 'day' | 'week' | 'month' | 'year'
  
  // Métricas de Audiencia
  totalListeners: number
  peakListeners: number
  averageListenTime: number
  uniqueListeners: number
  
  // Métricas de Contenido
  totalPlays: number
  totalEvents: number
  chatMessages: number
  
  // Métricas de Engagement
  favoriteCount: number
  shareCount: number
  rating: number
  
  // Tendencias
  growthRate: number
  topGenres: string[]
  peakHours: number[]
}
```

### Dashboard de Analytics

```tsx
import { useStationAnalytics } from '@/hooks/useStationAnalytics'
import { LineChart, BarChart, PieChart } from '@/components/ui/charts'

export const StationAnalytics = ({ stationId, period }: AnalyticsProps) => {
  const { data, isLoading, error } = useStationAnalytics(stationId, period)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="analytics-dashboard space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Oyentes Totales"
          value={data.totalListeners}
          change={data.growthRate}
          icon={<UsersIcon />}
        />
        <MetricCard
          title="Tiempo Promedio"
          value={`${Math.round(data.averageListenTime / 60)} min`}
          change={5.2}
          icon={<ClockIcon />}
        />
        <MetricCard
          title="Eventos"
          value={data.totalEvents}
          change={-2.1}
          icon={<CalendarIcon />}
        />
        <MetricCard
          title="Rating"
          value={data.rating.toFixed(1)}
          change={0.3}
          icon={<StarIcon />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3>Oyentes por Hora</h3>
          <LineChart
            data={data.peakHours.map((value, hour) => ({
              hour: `${hour}:00`,
              listeners: value
            }))}
            xKey="hour"
            yKey="listeners"
          />
        </div>
        
        <div className="chart-container">
          <h3>Géneros Populares</h3>
          <PieChart
            data={data.topGenres.map(genre => ({
              name: genre,
              value: Math.random() * 100
            }))}
          />
        </div>
      </div>
    </div>
  )
}
```

## 🔧 Configuración Avanzada

### Configuración de Audio

```typescript
interface AudioConfig {
  // Calidad de Stream
  bitrate: '64k' | '128k' | '192k' | '320k'
  sampleRate: 22050 | 44100 | 48000
  channels: 1 | 2
  
  // Buffer y Latencia
  bufferSize: number
  maxLatency: number
  
  // Formato
  format: 'mp3' | 'aac' | 'ogg'
  codec: string
  
  // Fallback
  fallbackUrls: string[]
  autoReconnect: boolean
  reconnectDelay: number
}
```

### Configuración de Chat

```typescript
interface ChatConfig {
  // Moderación
  autoModeration: boolean
  profanityFilter: boolean
  spamProtection: boolean
  
  // Límites
  maxMessageLength: number
  rateLimit: number // mensajes por minuto
  maxEmojis: number
  
  // Funcionalidades
  allowEmojis: boolean
  allowLinks: boolean
  allowImages: boolean
  
  // Roles
  moderatorRoles: string[]
  adminRoles: string[]
}
```

## 🚀 Funcionalidades Futuras

### Planificadas para Próximas Versiones

#### 1. **Radio Automática (AutoDJ)**
- Playlists automáticas
- Transiciones suaves
- Programación inteligente
- Detección de silencios

#### 2. **Streaming Multicast**
- Múltiples calidades de audio
- Adaptación automática de bitrate
- Soporte para dispositivos móviles

#### 3. **Integración con Redes Sociales**
- Compartir en tiempo real
- Stories de estaciones
- Live streaming en plataformas externas

#### 4. **Analytics Avanzados**
- Heatmaps de audiencia
- Predicciones de tendencias
- A/B testing de contenido
- Machine learning para recomendaciones

## 📚 Recursos Adicionales

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Media Source Extensions](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API)
- [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

---

**Última actualización**: Diciembre 2024  
**Versión**: 0.1.4  
**Mantenedor**: Equipo de Desarrollo
