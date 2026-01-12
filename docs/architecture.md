# 🏗️ Arquitectura de la Aplicación

Este documento describe la arquitectura general de Hoergen WebApp, incluyendo la estructura del proyecto, patrones de diseño y flujo de datos.

## 🎯 Visión General

Hoergen WebApp es una aplicación de **Single Page Application (SPA)** construida con React y TypeScript, que también puede ejecutarse como aplicación de escritorio nativa usando Electron. La arquitectura sigue principios de **componentes reutilizables**, **separación de responsabilidades** y **gestión de estado centralizada**.

## 🏛️ Estructura del Proyecto

```
hoergen.webapp/
├── src/                          # Código fuente principal
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                  # Componentes base de UI
│   │   ├── layout/              # Componentes de layout
│   │   └── data-table/          # Componentes de tablas de datos
│   ├── features/                 # Funcionalidades específicas
│   │   ├── admin-dashboard/      # Panel de administración
│   │   ├── auth/                 # Autenticación
│   │   ├── creator/              # Panel de creadores
│   │   ├── listener/             # Panel de oyentes
│   │   ├── station/              # Funcionalidades de estación
│   │   └── settings/             # Configuraciones
│   ├── core/                     # Lógica central
│   │   ├── api/                  # Cliente API
│   │   ├── services/             # Servicios de negocio
│   │   ├── types/                # Tipos TypeScript
│   │   └── guard/                # Protección de rutas
│   ├── context/                  # Contextos de React
│   ├── hooks/                    # Hooks personalizados
│   ├── lib/                      # Utilidades y configuraciones
│   ├── routes/                   # Definición de rutas
│   ├── stores/                   # Estado global (Zustand)
│   └── utils/                    # Funciones utilitarias
├── electron/                     # Configuración de Electron
├── public/                       # Archivos estáticos
├── scripts/                      # Scripts de build
└── docs/                         # Documentación
```

## 🔄 Patrones de Diseño

### 1. Arquitectura por Capas

La aplicación sigue una arquitectura en capas bien definidas:

```
┌─────────────────────────────────────┐
│           Presentation Layer        │ ← Componentes React
├─────────────────────────────────────┤
│           Business Logic            │ ← Hooks y Servicios
├─────────────────────────────────────┤
│           Data Access              │ ← API Client
├─────────────────────────────────────┤
│           External Services        │ ← Backend APIs
└─────────────────────────────────────┘
```

### 2. Componentes Compuestos

Utilizamos el patrón de **componentes compuestos** para crear interfaces flexibles:

```tsx
// Ejemplo: DataTable con componentes compuestos
<DataTable>
  <DataTableHeader>
    <DataTableColumnHeader>Nombre</DataTableColumnHeader>
    <DataTableColumnHeader>Género</DataTableColumnHeader>
  </DataTableHeader>
  <DataTableBody>
    {/* Datos de la tabla */}
  </DataTableBody>
  <DataTablePagination />
</DataTable>
```

### 3. Render Props y HOCs

Para lógica reutilizable, usamos **hooks personalizados**:

```tsx
// Hook personalizado para gestión de estaciones
const { stations, isLoading, error, refetch } = useStations({
  filters: { genre: 'electronic' },
  pagination: { page: 1, limit: 20 }
});
```

## 🗂️ Organización de Características

### Feature-Based Architecture

Cada funcionalidad principal tiene su propia carpeta con estructura completa:

```
features/admin-dashboard/
├── components/          # Componentes específicos del admin
├── hooks/              # Hooks específicos del admin
├── context/            # Contextos específicos del admin
├── types/              # Tipos específicos del admin
└── index.tsx           # Punto de entrada
```

### Ventajas de esta Organización

- **Cohesión**: Todo el código relacionado está junto
- **Acoplamiento bajo**: Las características son independientes
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Mantenibilidad**: Cambios aislados por característica

## 🔄 Flujo de Datos

### 1. Flujo Unidireccional

```
User Action → Component → Hook → Service → API → State Update → UI Re-render
```

### 2. Gestión de Estado

Utilizamos **Zustand** para estado global y **TanStack Query** para estado del servidor:

```tsx
// Estado global con Zustand
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null })
}));

// Estado del servidor con TanStack Query
const { data: stations } = useQuery({
  queryKey: ['stations', filters],
  queryFn: () => stationService.getStations(filters)
});
```

### 3. Sincronización de Estado

Los hooks personalizados sincronizan el estado local con el global:

```tsx
export const useAuth = () => {
  const { user, setUser } = useAuthStore();
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: authService.getSession,
    onSuccess: (data) => setUser(data.user)
  });
  
  return { user, isAuthenticated: !!user };
};
```

## 🛡️ Seguridad y Autenticación

### 1. Protección de Rutas

Sistema de **guards** para proteger rutas basado en roles:

```tsx
// Guard de autenticación
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};

// Guard de roles
export const RoleGuard = ({ 
  children, 
  requiredRole 
}: RoleGuardProps) => {
  const { user } = useAuth();
  
  if (user?.role !== requiredRole) {
    return <Navigate to="/forbidden" />;
  }
  
  return <>{children}</>;
};
```

### 2. Interceptores de API

Manejo automático de tokens y errores de autenticación:

```tsx
// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login
      router.navigate({ to: '/sign-in' });
    }
    return Promise.reject(error);
  }
);
```

## 🎨 Sistema de Diseño

### 1. Tokens de Diseño

Variables CSS personalizables para mantener consistencia:

```css
:root {
  --color-primary: 220 13% 18%;
  --color-primary-foreground: 0 0% 98%;
  --color-secondary: 0 0% 96.1%;
  --color-secondary-foreground: 220.9 39.3% 11%;
  /* ... más tokens */
}
```

### 2. Componentes Base

Sistema de componentes construido sobre Radix UI y TailwindCSS:

```tsx
// Componente Button con variantes
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

## 🔌 Integración con Electron

### 1. Arquitectura Híbrida

La aplicación funciona tanto en web como en escritorio:

```tsx
// Detección del entorno
const isElectron = typeof window !== 'undefined' && 
                   window.electron !== undefined;

// Uso condicional de funcionalidades nativas
if (isElectron) {
  window.electron.send('minimize-window');
}
```

### 2. Comunicación IPC

Comunicación segura entre procesos de Electron:

```tsx
// Preload script
contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: string, func: Function) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});
```

## 📱 Responsive Design

### 1. Mobile-First Approach

Diseño que prioriza dispositivos móviles:

```tsx
// Hook para detectar dispositivos móviles
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};
```

### 2. Breakpoints Consistentes

Sistema de breakpoints basado en TailwindCSS:

```css
/* Breakpoints estándar */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## 🚀 Optimizaciones de Rendimiento

### 1. Code Splitting

División automática del código por rutas:

```tsx
// Lazy loading de componentes pesados
const AdminDashboard = lazy(() => import('./features/console'));
const CreatorPanel = lazy(() => import('./features/creator'));

// Suspense para manejar loading
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

### 2. Memoización

Optimización de re-renders con React.memo y useMemo:

```tsx
// Componente memoizado
export const StationCard = React.memo(({ station }: StationCardProps) => {
  // Componente optimizado
});

// Hook memoizado
const filteredStations = useMemo(() => {
  return stations.filter(station => 
    station.genre === selectedGenre
  );
}, [stations, selectedGenre]);
```

## 🔧 Configuración y Build

### 1. Vite Configuration

Configuración optimizada para desarrollo y producción:

```ts
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    obfuscator({
      // Configuración de ofuscación para producción
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
});
```

### 2. TypeScript Configuration

Configuración estricta para mejor calidad de código:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📊 Monitoreo y Analytics

### 1. Error Boundaries

Captura y manejo de errores en componentes:

```tsx
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### 2. Performance Monitoring

Hooks para monitorear rendimiento:

```tsx
export const usePerformanceMonitor = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          // Log navigation performance
          console.log('Navigation time:', entry.loadEventEnd - entry.loadEventStart);
        }
      }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
    return () => observer.disconnect();
  }, []);
};
```

## 🔮 Futuras Mejoras

### 1. Arquitectura Planeada

- **Micro-frontends**: División en aplicaciones independientes
- **Service Workers**: Funcionalidad offline mejorada
- **WebAssembly**: Componentes críticos de rendimiento

### 2. Escalabilidad

- **Lazy Loading**: Carga bajo demanda de funcionalidades
- **Virtual Scrolling**: Para listas grandes de datos
- **Progressive Web App**: Funcionalidades nativas en web

---

Esta arquitectura proporciona una base sólida para el crecimiento y mantenimiento de Hoergen WebApp, siguiendo las mejores prácticas de la industria y patrones probados.
