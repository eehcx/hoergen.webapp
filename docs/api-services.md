# 📊 API y Servicios

La documentación de **API y Servicios** describe la arquitectura de servicios, endpoints disponibles y patrones de integración utilizados en Hoergen WebApp.

## 📋 Índice

- [Arquitectura de Servicios](#arquitectura-de-servicios)
- [Servicios Principales](#servicios-principales)
- [Endpoints de API](#endpoints-de-api)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Manejo de Errores](#manejo-de-errores)
- [WebSockets](#websockets)
- [Integración con Backend](#integración-con-backend)

## 🏗️ Arquitectura de Servicios

### Patrón de Servicios

```typescript
// Estructura base de un servicio
interface BaseService {
  baseURL: string;
  headers: Record<string, string>;
  timeout: number;
  
  get<T>(endpoint: string, config?: RequestConfig): Promise<T>;
  post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>;
  put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T>;
}
```

### Configuración de Cliente HTTP

```typescript
// Cliente HTTP principal
const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
```

## 🔧 Servicios Principales

### Servicio de Autenticación

```typescript
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.post('/auth/login', credentials);
  }
  
  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.post('/auth/register', userData);
  }
  
  async refreshToken(): Promise<AuthResponse> {
    return this.post('/auth/refresh');
  }
  
  async logout(): Promise<void> {
    return this.post('/auth/logout');
  }
}
```

### Servicio de Estaciones

```typescript
class StationService {
  async getStations(filters?: StationFilters): Promise<Station[]> {
    return this.get('/stations', { params: filters });
  }
  
  async getStation(id: string): Promise<Station> {
    return this.get(`/stations/${id}`);
  }
  
  async createStation(data: CreateStationData): Promise<Station> {
    return this.post('/stations', data);
  }
  
  async updateStation(id: string, data: UpdateStationData): Promise<Station> {
    return this.put(`/stations/${id}`, data);
  }
}
```

### Servicio de Streaming

```typescript
class StreamingService {
  async getStreamURL(stationId: string): Promise<StreamInfo> {
    return this.get(`/streaming/${stationId}/stream`);
  }
  
  async getMetadata(stationId: string): Promise<TrackMetadata> {
    return this.get(`/streaming/${stationId}/metadata`);
  }
  
  async getListenerCount(stationId: string): Promise<number> {
    return this.get(`/streaming/${stationId}/listeners`);
  }
}
```

## 🌐 Endpoints de API

### Autenticación

```
POST   /api/auth/login          - Iniciar sesión
POST   /api/auth/register       - Registrar usuario
POST   /api/auth/refresh        - Renovar token
POST   /api/auth/logout         - Cerrar sesión
POST   /api/auth/forgot-password - Recuperar contraseña
POST   /api/auth/reset-password - Restablecer contraseña
```

### Usuarios

```
GET    /api/users/profile       - Obtener perfil del usuario
PUT    /api/users/profile       - Actualizar perfil
GET    /api/users/{id}          - Obtener usuario por ID
PUT    /api/users/{id}          - Actualizar usuario
DELETE /api/users/{id}          - Eliminar usuario
```

### Estaciones

```
GET    /api/stations            - Listar estaciones
POST   /api/stations            - Crear estación
GET    /api/stations/{id}       - Obtener estación
PUT    /api/stations/{id}       - Actualizar estación
DELETE /api/stations/{id}       - Eliminar estación
GET    /api/stations/{id}/events - Eventos de estación
```

### Eventos

```
GET    /api/events              - Listar eventos
POST   /api/events              - Crear evento
GET    /api/events/{id}         - Obtener evento
PUT    /api/events/{id}         - Actualizar evento
DELETE /api/events/{id}         - Eliminar evento
```

### Chat

```
GET    /api/chat/{stationId}/messages - Obtener mensajes
POST   /api/chat/{stationId}/messages - Enviar mensaje
DELETE /api/chat/{stationId}/messages/{id} - Eliminar mensaje
```

## 🔐 Autenticación y Autorización

### JWT Tokens

```typescript
interface JWTToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

interface TokenPayload {
  sub: string;        // User ID
  email: string;      // User email
  roles: string[];    // User roles
  exp: number;        // Expiration time
  iat: number;        // Issued at
}
```

### Interceptor de Autenticación

```typescript
// Interceptor para agregar token a requests
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para renovar token expirado
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        return apiClient.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

## ❌ Manejo de Errores

### Estructura de Error

```typescript
interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
  timestamp: string;
}

interface ErrorResponse {
  error: ApiError;
  success: false;
}
```

### Manejo de Errores HTTP

```typescript
class ErrorHandler {
  static handle(error: any): void {
    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          this.handleBadRequest(data);
          break;
        case 401:
          this.handleUnauthorized();
          break;
        case 403:
          this.handleForbidden();
          break;
        case 404:
          this.handleNotFound();
          break;
        case 500:
          this.handleServerError();
          break;
        default:
          this.handleGenericError(data);
      }
    } else if (error.request) {
      // Error de red
      this.handleNetworkError();
    } else {
      // Error de configuración
      this.handleConfigError(error);
    }
  }
}
```

## 🔌 WebSockets

### Conexión WebSocket

```typescript
class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url: string): void {
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      console.log('WebSocket conectado');
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data));
    };
    
    this.ws.onclose = () => {
      this.handleDisconnect();
    };
    
    this.ws.onerror = (error) => {
      this.handleError(error);
    };
  }

  private handleMessage(data: any): void {
    switch (data.type) {
      case 'chat_message':
        this.emit('chat_message', data.payload);
        break;
      case 'user_joined':
        this.emit('user_joined', data.payload);
        break;
      case 'user_left':
        this.emit('user_left', data.payload);
        break;
      case 'track_change':
        this.emit('track_change', data.payload);
        break;
    }
  }
}
```

### Eventos WebSocket

```typescript
// Tipos de eventos WebSocket
type WebSocketEvent = 
  | 'chat_message'
  | 'user_joined'
  | 'user_left'
  | 'track_change'
  | 'station_status'
  | 'listener_count'
  | 'moderation_action';

interface WebSocketMessage {
  type: WebSocketEvent;
  payload: any;
  timestamp: string;
  stationId?: string;
}
```

## 🔗 Integración con Backend

### Configuración de Entornos

```typescript
// Configuración por entorno
const config = {
  development: {
    apiUrl: 'http://localhost:8000/api',
    wsUrl: 'ws://localhost:8000/ws',
    streamingUrl: 'http://localhost:8000/stream',
  },
  staging: {
    apiUrl: 'https://staging-api.hoergen.app/api',
    wsUrl: 'wss://staging-api.hoergen.app/ws',
    streamingUrl: 'https://staging-stream.hoergen.app',
  },
  production: {
    apiUrl: 'https://api.hoergen.app/api',
    wsUrl: 'wss://api.hoergen.app/ws',
    streamingUrl: 'https://stream.hoergen.app',
  },
};
```

### Servicios de Backend

#### Servicio de Base de Datos

```typescript
// Operaciones CRUD básicas
interface DatabaseService<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findMany(filters?: any): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
```

#### Servicio de Cache

```typescript
class CacheService {
  private cache = new Map<string, { data: any; expires: number }>();

  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
}
```

## 📊 Monitoreo y Analytics

### Métricas de API

```typescript
interface ApiMetrics {
  requestCount: number;
  responseTime: number;
  errorRate: number;
  statusCodes: Record<number, number>;
  endpoints: Record<string, EndpointMetrics>;
}

interface EndpointMetrics {
  calls: number;
  avgResponseTime: number;
  errorCount: number;
  lastCall: string;
}
```

### Logging de Requests

```typescript
// Interceptor para logging
apiClient.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[API Error] ${error.response?.status} ${error.config?.url}`, error);
    return Promise.reject(error);
  }
);
```

## 🚀 Optimizaciones

### Caching Inteligente

```typescript
class SmartCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 100;

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && !this.isExpired(cached)) {
      return cached.data;
    }
    
    const data = await fetcher();
    this.set(key, data);
    return data;
  }

  private set(key: string, data: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: 300000, // 5 minutos
    });
  }
}
```

### Rate Limiting

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>();
  private maxRequests = 100;
  private windowMs = 60000; // 1 minuto

  canMakeRequest(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Limpiar requests antiguos
    const recentRequests = userRequests.filter(
      time => now - time < this.windowMs
    );
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }
}
```

## 📚 Recursos Adicionales

### Documentación de API

- **OpenAPI/Swagger**: [API Docs](https://api.hoergen.app/docs)
- **Postman Collection**: [Importar Collection](https://api.hoergen.app/postman)
- **Insomnia Collection**: [Importar Collection](https://api.hoergen.app/insomnia)

### Herramientas de Desarrollo

- **API Testing**: Postman, Insomnia, Thunder Client
- **WebSocket Testing**: WebSocket King, Postman
- **API Monitoring**: Postman Monitors, Insomnia Cloud

---

**Última actualización**: Diciembre 2024  
**Versión**: 0.1.4  
**Autor**: Equipo de Hoergen
