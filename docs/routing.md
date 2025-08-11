# 🛣️ Sistema de Rutas

Este documento describe el sistema de rutas de Hoergen WebApp, incluyendo la estructura de navegación, protección de rutas y manejo de parámetros.

## 🎯 Visión General

Hoergen WebApp utiliza **TanStack Router** (anteriormente React Router) para manejar la navegación. El sistema está diseñado con una arquitectura de rutas anidadas que permite una navegación eficiente y una experiencia de usuario fluida.

## 🏗️ Estructura de Rutas

### Jerarquía Principal

```
/                           # Ruta raíz (dashboard principal)
├── _authenticated/         # Grupo de rutas protegidas
│   ├── /                   # Dashboard principal
│   ├── /$slugName         # Página dinámica por slug
│   ├── /admin/            # Panel de administración
│   │   ├── /              # Dashboard admin
│   │   ├── /users         # Gestión de usuarios
│   │   ├── /stations      # Gestión de estaciones
│   │   ├── /genres        # Gestión de géneros
│   │   ├── /countries     # Gestión de países
│   │   ├── /feedback      # Gestión de feedback
│   │   ├── /reports       # Reportes y analytics
│   │   └── /moderation    # Moderación de contenido
│   ├── /browse/           # Exploración de estaciones
│   ├── /creator/          # Panel de creadores
│   ├── /settings/         # Configuraciones del usuario
│   │   ├── /              # Configuraciones generales
│   │   ├── /account       # Cuenta del usuario
│   │   ├── /appearance    # Apariencia y temas
│   │   ├── /display       # Configuración de pantalla
│   │   └── /notifications # Notificaciones
│   ├── /subscriptions/    # Gestión de suscripciones
│   │   ├── /              # Lista de suscripciones
│   │   ├── /success       # Página de éxito
│   │   └── /cancel        # Página de cancelación
│   ├── /you/              # Perfil del usuario
│   │   ├── /              # Perfil principal
│   │   └── /library       # Biblioteca personal
│   └── /s/                # Estaciones específicas
│       ├── /$stationSlug  # Estación individual
│       ├── /new           # Crear nueva estación
│       └── /chat-popup    # Chat emergente
├── (auth)/                 # Grupo de rutas de autenticación
│   ├── /sign-in           # Inicio de sesión
│   ├── /sign-in-2         # Inicio de sesión alternativo
│   ├── /sign-up           # Registro
│   ├── /forgot-password   # Recuperar contraseña
│   └── /otp               # Verificación OTP
└── (errors)/               # Grupo de rutas de errores
    ├── /401               # No autorizado
    ├── /403               # Prohibido
    ├── /404               # No encontrado
    ├── /500               # Error del servidor
    └── /503               # Servicio no disponible
```

## 🔐 Protección de Rutas

### Sistema de Guards

La aplicación implementa un sistema de **guards** para proteger rutas basado en autenticación y roles:

#### 1. AuthGuard

Protege rutas que requieren autenticación:

```tsx
// src/core/guard/authGuard.tsx
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};
```

#### 2. RoleGuard

Protege rutas basado en roles específicos:

```tsx
// src/core/guard/roleGuard.tsx
export const RoleGuard = ({ 
  children, 
  requiredRole,
  fallback = <Navigate to="/forbidden" />
}: RoleGuardProps) => {
  const { user } = useAuth();
  
  if (!user || user.role !== requiredRole) {
    return fallback;
  }
  
  return <>{children}</>;
};
```

#### 3. Uso en Rutas

```tsx
// src/routes/_authenticated/admin/route.tsx
export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminLayout,
  beforeLoad: ({ context }) => {
    // Verificar autenticación antes de cargar
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: '/sign-in' });
    }
  }
});

// src/routes/_authenticated/admin/index.tsx
export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminDashboard,
  beforeLoad: ({ context }) => {
    // Verificar rol de administrador
    if (context.auth?.user?.role !== 'admin') {
      throw redirect({ to: '/forbidden' });
    }
  }
});
```

## 🎯 Tipos de Rutas

### 1. Rutas Estáticas

Rutas con paths fijos:

```tsx
// src/routes/_authenticated/browse/index.tsx
export const Route = createFileRoute('/_authenticated/browse/')({
  component: BrowsePage,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ['stations', 'browse'],
      queryFn: () => stationService.getStations()
    });
  }
});
```

### 2. Rutas Dinámicas

Rutas con parámetros variables:

```tsx
// src/routes/_authenticated/s/$stationSlug.tsx
export const Route = createFileRoute('/_authenticated/s/$stationSlug')({
  component: StationPage,
  loader: ({ params: { stationSlug } }) => {
    return stationService.getStationBySlug(stationSlug);
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: search.tab as string || 'overview',
      chat: search.chat === 'true'
    };
  }
});
```

### 3. Rutas con Query Parameters

Rutas que manejan parámetros de búsqueda:

```tsx
// src/routes/_authenticated/browse/index.tsx
export const Route = createFileRoute('/_authenticated/browse/')({
  component: BrowsePage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      genre: search.genre as string || '',
      country: search.country as string || '',
      page: Number(search.page) || 1,
      limit: Number(search.limit) || 20
    };
  },
  loader: ({ context, search }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ['stations', 'browse', search],
      queryFn: () => stationService.getStations(search)
    });
  }
});
```

## 🧭 Navegación Programática

### 1. Hook useNavigate

```tsx
import { useNavigate } from '@tanstack/react-router';

export const StationCard = ({ station }: StationCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate({
      to: '/s/$stationSlug',
      params: { stationSlug: station.slug },
      search: { tab: 'overview' }
    });
  };
  
  return (
    <div onClick={handleClick}>
      {/* Contenido de la tarjeta */}
    </div>
  );
};
```

### 2. Navegación con Estado

```tsx
const navigate = useNavigate();

// Navegar con estado
navigate({
  to: '/admin/users',
  search: { 
    page: 1, 
    filter: 'active' 
  },
  replace: true // Reemplazar en el historial
});
```

### 3. Navegación con Parámetros

```tsx
// Navegar a estación específica
navigate({
  to: '/s/$stationSlug',
  params: { 
    stationSlug: 'deep-house-radio' 
  },
  search: { 
    tab: 'chat',
    chat: 'true'
  }
});
```

## 🔄 Carga de Datos

### 1. Loaders

Los loaders se ejecutan antes de renderizar el componente:

```tsx
export const Route = createFileRoute('/_authenticated/admin/users/')({
  component: UsersPage,
  loader: async ({ context }) => {
    // Cargar datos antes de renderizar
    const users = await context.queryClient.ensureQueryData({
      queryKey: ['users', 'admin'],
      queryFn: () => userService.getUsers(),
      staleTime: 5 * 60 * 1000 // 5 minutos
    });
    
    return { users };
  }
});
```

### 2. Error Boundaries

Manejo de errores en rutas:

```tsx
export const Route = createFileRoute('/_authenticated/admin/users/')({
  component: UsersPage,
  errorComponent: ({ error }) => (
    <div className="error-container">
      <h2>Error al cargar usuarios</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>
        Reintentar
      </button>
    </div>
  )
});
```

### 3. Loading States

```tsx
export const Route = createFileRoute('/_authenticated/admin/users/')({
  component: UsersPage,
  pendingComponent: () => (
    <div className="loading-container">
      <LoadingSpinner />
      <p>Cargando usuarios...</p>
    </div>
  )
});
```

## 🎨 Layouts y Anidación

### 1. Layout Principal

```tsx
// src/routes/_authenticated/route.tsx
export const Route = createFileRoute('/_authenticated/')({
  component: AuthenticatedLayout,
  beforeLoad: ({ context }) => {
    // Verificar autenticación
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: '/sign-in' });
    }
  }
});

const AuthenticatedLayout = () => {
  return (
    <div className="authenticated-layout">
      <AppSidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <MiniPlayer />
    </div>
  );
};
```

### 2. Layouts Anidados

```tsx
// src/routes/_authenticated/admin/route.tsx
export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminLayout,
  beforeLoad: ({ context }) => {
    // Verificar rol de admin
    if (context.auth?.user?.role !== 'admin') {
      throw redirect({ to: '/forbidden' });
    }
  }
});

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <AdminHeader />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

## 🔍 Búsqueda y Filtros

### 1. Parámetros de Búsqueda

```tsx
// src/routes/_authenticated/browse/index.tsx
export const Route = createFileRoute('/_authenticated/browse/')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      genre: search.genre as string || '',
      country: search.country as string || '',
      search: search.search as string || '',
      page: Number(search.page) || 1,
      limit: Number(search.limit) || 20,
      sortBy: search.sortBy as string || 'name',
      sortOrder: search.sortOrder as 'asc' | 'desc' || 'asc'
    };
  }
});
```

### 2. Filtros Persistentes

```tsx
export const BrowsePage = () => {
  const { search } = useSearch();
  const navigate = useNavigate();
  
  const updateFilters = (newFilters: Partial<typeof search>) => {
    navigate({
      to: '/browse',
      search: { ...search, ...newFilters, page: 1 },
      replace: true
    });
  };
  
  return (
    <div>
      <FilterPanel 
        filters={search}
        onFilterChange={updateFilters}
      />
      <StationGrid filters={search} />
    </div>
  );
};
```

## 🚀 Optimizaciones de Rendimiento

### 1. Lazy Loading

```tsx
// src/routes/_authenticated/admin/index.tsx
const AdminDashboard = lazy(() => import('./AdminDashboard'));

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminDashboard,
  pendingComponent: () => <AdminDashboardSkeleton />
});
```

### 2. Prefetching

```tsx
// Prefetch de rutas comunes
const prefetchRoutes = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Prefetch rutas de navegación común
    router.preloadRoute({ to: '/browse' });
    router.preloadRoute({ to: '/settings' });
  }, [router]);
};
```

### 3. Cache de Datos

```tsx
export const Route = createFileRoute('/_authenticated/admin/users/')({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ['users', 'admin'],
      queryFn: () => userService.getUsers(),
      staleTime: 10 * 60 * 1000, // 10 minutos
      gcTime: 30 * 60 * 1000     // 30 minutos
    });
  }
});
```

## 🐛 Debugging y Desarrollo

### 1. Router DevTools

```tsx
// src/main.tsx
import { RouterDevtools } from '@tanstack/router-devtools';

if (import.meta.env.DEV) {
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
      <RouterDevtools router={router} />
    </StrictMode>
  );
}
```

### 2. Logging de Navegación

```tsx
// Interceptor para logging
router.subscribe('onNavigate', (event) => {
  if (import.meta.env.DEV) {
    console.log('Navigation:', {
      from: event.fromLocationId,
      to: event.toLocationId,
      search: event.toLocation.search,
      params: event.toLocation.params
    });
  }
});
```

### 3. Validación de Rutas

```tsx
// Validación de parámetros
export const Route = createFileRoute('/_authenticated/s/$stationSlug')({
  validateParams: (params) => {
    if (!params.stationSlug || params.stationSlug.length < 3) {
      throw new Error('Station slug must be at least 3 characters');
    }
    return params;
  }
});
```

## 🔮 Futuras Mejoras

### 1. Rutas Planeadas

- **Rutas offline**: Soporte para navegación sin conexión
- **Rutas con animaciones**: Transiciones suaves entre páginas
- **Rutas con breadcrumbs**: Navegación jerárquica mejorada

### 2. Optimizaciones

- **Route splitting**: División automática de bundles por rutas
- **Smart prefetching**: Prefetch inteligente basado en comportamiento del usuario
- **Route analytics**: Métricas de navegación y rendimiento

---

El sistema de rutas de Hoergen WebApp proporciona una base sólida para la navegación, con características avanzadas como protección de rutas, carga de datos optimizada y una experiencia de usuario fluida.
