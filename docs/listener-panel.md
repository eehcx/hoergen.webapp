# 🎧 Panel de Oyentes

El **Panel de Oyentes** es la interfaz principal para los usuarios que escuchan música en Hoergen WebApp, proporcionando acceso a estaciones, gestión de favoritos y personalización de la experiencia de escucha.

## 📋 Índice

- [Visión General](#visión-general)
- [Acceso al Panel](#acceso-al-panel)
- [Exploración de Estaciones](#exploración-de-estaciones)
- [Favoritos y Biblioteca](#favoritos-y-biblioteca)
- [Historial de Reproducción](#historial-de-reproducción)
- [Suscripciones](#suscripciones)
- [Personalización](#personalización)
- [Funcionalidades Sociales](#funcionalidades-sociales)
- [Configuración de Audio](#configuración-de-audio)

## 🎯 Visión General

El Panel de Oyentes está diseñado para proporcionar una experiencia de escucha excepcional con:

- Descubrimiento de nueva música y estaciones
- Gestión personal de favoritos y biblioteca
- Seguimiento del historial de escucha
- Suscripciones a estaciones y creadores
- Personalización completa de la experiencia
- Funcionalidades sociales y de comunidad

## 🔑 Acceso al Panel

### Requisitos de Acceso

- Cuenta de usuario registrada (gratuita)
- Navegador web compatible
- Conexión a internet estable

### Navegación

1. Iniciar sesión en la aplicación
2. El panel se carga automáticamente como página principal
3. Acceso directo desde `/listener-panel`
4. Navegación desde el menú principal

## 🔍 Exploración de Estaciones

### Descubrimiento de Contenido

#### Página Principal

- **Estaciones Destacadas**: Selección editorial semanal
- **Trending**: Estaciones populares del momento
- **Recomendaciones**: Basadas en tu historial
- **Nuevas Estaciones**: Lanzamientos recientes

#### Búsqueda y Filtros

```typescript
interface SearchFilters {
  genre: string[];
  mood: string[];
  language: string;
  region: string;
  isLive: boolean;
  hasChat: boolean;
  minListeners: number;
  maxListeners: number;
  tags: string[];
}
```

#### Categorías Musicales

- **Géneros**: House, Techno, Trance, Drum & Bass, etc.
- **Estados de Ánimo**: Energético, Relajante, Melancólico, etc.
- **Regiones**: Europa, América Latina, Asia, etc.
- **Idiomas**: Español, Inglés, Francés, Alemán, etc.

### Navegación por Estaciones

#### Vista de Lista

- **Grid**: Disposición en cuadrícula
- **Lista**: Vista compacta con más detalles
- **Mosaico**: Vista de tarjetas grandes
- **Compacta**: Máximo de estaciones por pantalla

#### Información de Estación

```typescript
interface StationInfo {
  id: string;
  name: string;
  description: string;
  genre: string[];
  tags: string[];
  coverImage: string;
  bannerImage: string;
  currentListeners: number;
  maxListeners: number;
  isLive: boolean;
  currentTrack?: TrackInfo;
  nextEvent?: EventInfo;
  creator: UserInfo;
  rating: number;
  totalPlays: number;
}
```

## ❤️ Favoritos y Biblioteca

### Gestión de Favoritos

#### Agregar a Favoritos

- **Estaciones**: Marcar estaciones favoritas
- **Creadores**: Seguir creadores específicos
- **Playlists**: Guardar listas de reproducción
- **Eventos**: Marcar eventos de interés

#### Organización

```typescript
interface LibraryOrganization {
  playlists: Playlist[];
  favoriteStations: Station[];
  followedCreators: User[];
  savedEvents: Event[];
  customCollections: Collection[];
}
```

#### Colecciones Personalizadas

- Crear carpetas temáticas
- Organizar por género o estado de ánimo
- Compartir colecciones con amigos
- Sincronización entre dispositivos

### Biblioteca Personal

#### Acceso Rápido

- **Recientes**: Últimas estaciones escuchadas
- **Favoritos**: Estaciones marcadas como favoritas
- **Descargadas**: Contenido disponible offline
- **Historial**: Cronología completa de escucha

#### Sincronización

- **Multi-dispositivo**: Acceso desde cualquier lugar
- **Cloud**: Respaldo automático de preferencias
- **Offline**: Descarga de contenido favorito
- **Backup**: Exportación de biblioteca

## 📚 Historial de Reproducción

### Seguimiento de Actividad

#### Historial Detallado

```typescript
interface ListeningHistory {
  stationId: string;
  stationName: string;
  startTime: Date;
  endTime: Date;
  duration: number; // en segundos
  tracksPlayed: TrackInfo[];
  totalTracks: number;
  skippedTracks: number;
  rating?: number;
  notes?: string;
}
```

#### Estadísticas Personales

- **Tiempo total de escucha**: Por día, semana, mes
- **Estaciones más escuchadas**: Top 10 personal
- **Géneros favoritos**: Análisis de preferencias
- **Horarios de escucha**: Patrones de uso

### Análisis de Preferencias

#### Insights Personales

- **Tendencias musicales**: Evolución de gustos
- **Descubrimientos**: Nuevos géneros explorados
- **Patrones de escucha**: Horarios y duración
- **Comparativas**: Con otros usuarios similares

#### Reportes Personalizados

- **Resumen semanal**: Actividad de la semana
- **Resumen mensual**: Tendencias del mes
- **Año en revisión**: Resumen anual completo
- **Metas personales**: Objetivos de escucha

## 📡 Suscripciones

### Tipos de Suscripciones

#### Suscripciones Gratuitas

- **Estaciones**: Recibir notificaciones de eventos
- **Creadores**: Seguir actividad de artistas
- **Géneros**: Alertas de nuevo contenido
- **Eventos**: Recordatorios de shows

#### Suscripciones Premium

- **Contenido exclusivo**: Acceso anticipado
- **Calidad superior**: Audio de mayor calidad
- **Sin publicidad**: Experiencia sin interrupciones
- **Funcionalidades avanzadas**: Herramientas premium

### Gestión de Suscripciones

#### Panel de Control

```typescript
interface SubscriptionManager {
  activeSubscriptions: Subscription[];
  pendingRenewals: Subscription[];
  expiredSubscriptions: Subscription[];
  billingHistory: BillingRecord[];
  paymentMethods: PaymentMethod[];
}
```

#### Notificaciones

- **Email**: Resúmenes y alertas
- **Push**: Notificaciones en tiempo real
- **SMS**: Recordatorios importantes
- **In-app**: Alertas dentro de la aplicación

## 🎨 Personalización

### Temas y Apariencia

#### Temas Visuales

- **Modo Claro**: Interfaz clara y brillante
- **Modo Oscuro**: Interfaz oscura y elegante
- **Modo Automático**: Cambio según hora del día
- **Temas Personalizados**: Colores a elección

#### Layout Personalizable

- **Sidebar**: Posición y contenido
- **Header**: Información mostrada
- **Footer**: Enlaces y controles
- **Grid**: Tamaño de elementos

### Preferencias de Usuario

#### Configuración de Audio

```typescript
interface AudioPreferences {
  defaultVolume: number;
  crossfade: boolean;
  crossfadeDuration: number;
  equalizer: EqualizerSettings;
  normalization: boolean;
  quality: 'low' | 'medium' | 'high' | 'lossless';
}
```

#### Configuración de Interfaz

- **Idioma**: Español, Inglés, Francés, etc.
- **Región**: Zona horaria y formato de fecha
- **Accesibilidad**: Tamaño de texto, contraste
- **Notificaciones**: Tipos y frecuencia

## 👥 Funcionalidades Sociales

### Comunidad y Social

#### Perfil Público

- **Información personal**: Bio, ubicación, intereses
- **Estadísticas**: Tiempo de escucha, favoritos
- **Logros**: Badges y reconocimientos
- **Actividad**: Historial público reciente

#### Conexiones Sociales

- **Amigos**: Conectar con otros usuarios
- **Grupos**: Unirse a comunidades temáticas
- **Eventos**: Participar en eventos comunitarios
- **Chat**: Comunicación con otros oyentes

### Compartir y Descubrir

#### Compartir Contenido

- **Estaciones**: Compartir en redes sociales
- **Playlists**: Enviar a amigos
- **Eventos**: Invitar a eventos
- **Logros**: Compartir logros personales

#### Descubrimiento Social

- **Recomendaciones de amigos**: Basadas en conexiones
- **Tendencias comunitarias**: Popular en tu red
- **Eventos sociales**: Organizados por la comunidad
- **Challenges**: Desafíos musicales comunitarios

## 🔊 Configuración de Audio

### Calidad de Audio

#### Formatos Soportados

- **MP3**: 128, 192, 256, 320 kbps
- **AAC**: 128, 192, 256 kbps
- **Opus**: 64, 96, 128 kbps
- **FLAC**: Sin pérdida (premium)

#### Configuración de Streaming

```typescript
interface StreamingConfig {
  bufferSize: number; // en segundos
  maxBitrate: number; // en kbps
  adaptiveBitrate: boolean;
  lowLatency: boolean;
  fallbackQuality: 'low' | 'medium' | 'high';
}
```

### Control de Reproducción

#### Controles Avanzados

- **Crossfade**: Transiciones suaves entre estaciones
- **Normalización**: Volumen consistente
- **Ecualizador**: 10 bandas ajustables
- **Efectos**: Reverb, delay, compresión

#### Atajos de Teclado

```bash
# Reproducción
Espacio: Play/Pause
→: Siguiente estación
←: Estación anterior
↑: Subir volumen
↓: Bajar volumen

# Navegación
Ctrl+F: Buscar estaciones
Ctrl+L: Ir a biblioteca
Ctrl+H: Ir a historial
Ctrl+S: Ir a suscripciones
```

## 📱 Funcionalidades Móviles

### Aplicación Móvil

#### Características Específicas

- **Modo offline**: Descarga de contenido
- **Notificaciones push**: Alertas en tiempo real
- **Widgets**: Controles rápidos en pantalla
- **Integración con sistema**: Controles de media

#### Optimizaciones Móviles

- **Interfaz táctil**: Controles optimizados para touch
- **Modo ahorro de batería**: Optimización de recursos
- **Datos móviles**: Control de uso de datos
- **Almacenamiento**: Gestión de espacio local

## 🚀 Funcionalidades Avanzadas

### Integraciones

#### Servicios Externos

- **Spotify**: Sincronización de playlists
- **Apple Music**: Importación de biblioteca
- **YouTube Music**: Búsqueda de contenido
- **Discord**: Compartir estado de escucha

#### Dispositivos

- **Smart Speakers**: Amazon Echo, Google Home
- **Car Audio**: Android Auto, CarPlay
- **Wearables**: Apple Watch, Android Wear
- **Smart TVs**: Chromecast, AirPlay

### Automatización

#### Reglas Personalizadas

```typescript
interface AutomationRule {
  condition: 'time' | 'location' | 'activity' | 'mood';
  action: 'play' | 'pause' | 'change_station' | 'set_volume';
  parameters: any;
  enabled: boolean;
}
```

#### Ejemplos de Automatización

- **Al despertar**: Estación de música energética
- **En el trabajo**: Música instrumental relajante
- **Al hacer ejercicio**: Playlist de alta energía
- **Al dormir**: Música ambiental suave

## 📊 Analytics Personales

### Métricas de Uso

#### Estadísticas Detalladas

- **Tiempo de escucha**: Por día, semana, mes
- **Estaciones favoritas**: Top 10 personal
- **Géneros explorados**: Diversidad musical
- **Patrones de uso**: Horarios y duración

#### Comparativas

- **Con otros usuarios**: Estadísticas comunitarias
- **Con períodos anteriores**: Tendencias personales
- **Con objetivos**: Metas de escucha establecidas
- **Con recomendaciones**: Efectividad de sugerencias

## 🔒 Privacidad y Seguridad

### Control de Datos

#### Configuración de Privacidad

- **Perfil público**: Información visible para otros
- **Historial compartido**: Actividad visible para amigos
- **Datos de uso**: Compartir estadísticas anónimas
- **Ubicación**: Compartir ubicación geográfica

#### Seguridad de Cuenta

- **Autenticación de dos factores**: 2FA
- **Sesiones activas**: Control de dispositivos
- **Cambios de contraseña**: Historial de cambios
- **Actividad sospechosa**: Alertas de seguridad

## 📞 Soporte y Ayuda

### Recursos de Ayuda

#### Documentación

- **Guías de usuario**: Tutoriales paso a paso
- **FAQ**: Preguntas frecuentes
- **Videos tutoriales**: Explicaciones visuales
- **Base de conocimientos**: Artículos detallados

#### Soporte Técnico

- **Chat en vivo**: Soporte en tiempo real
- **Email**: Soporte por correo electrónico
- **Foro comunitario**: Ayuda de otros usuarios
- **Discord**: Servidor de soporte

### Contacto

- **Email**: listeners@hoergen.app
- **Discord**: [Servidor de Oyentes](https://discord.gg/hoergen-listeners)
- **Telegram**: [Canal de Oyentes](https://t.me/hoergenlisteners)

---

**Última actualización**: Diciembre 2024  
**Versión**: 0.1.4  
**Autor**: Equipo de Hoergen
