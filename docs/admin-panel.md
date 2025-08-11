# 👥 Panel de Administración

## 📋 Descripción General

El **Panel de Administración** de **Hoergen WebApp** es una interfaz completa y poderosa diseñada para administradores y super administradores. Proporciona herramientas avanzadas para la gestión del sistema, moderación de contenido, análisis de datos y configuración global.

## 🏗️ Arquitectura del Panel

### Estructura de Carpetas

```
src/features/admin-dashboard/
├── analytics/              # Analytics y reportes
│   ├── customers/          # Analytics de clientes
│   ├── moderation/         # Analytics de moderación
│   ├── reports/            # Reportes del sistema
│   └── stations/           # Analytics de estaciones
├── countries/              # Gestión de países
├── feedback/               # Gestión de feedback
├── genres/                 # Gestión de géneros musicales
├── reports/                # Sistema de reportes
├── stations/               # Gestión de estaciones
├── subscriptions/          # Gestión de suscripciones
└── users/                  # Gestión de usuarios
```

### Jerarquía de Acceso

```
Super Admin
    ↓
    Admin
    ↓
    Moderator (limitado)
```

## 🔐 Control de Acceso

### Roles y Permisos

#### **Super Admin**
- **Gestión de Usuarios**: Crear, editar, eliminar cualquier usuario
- **Configuración del Sistema**: Variables de entorno, configuraciones globales
- **Auditoría**: Logs completos del sistema, historial de cambios
- **Backup y Restauración**: Gestión de respaldos del sistema

#### **Admin**
- **Gestión de Usuarios**: Crear, editar usuarios (excepto super admins)
- **Moderación Global**: Acceso a todas las estaciones y contenido
- **Analytics**: Acceso completo a reportes y estadísticas
- **Configuración**: Configuración de features y funcionalidades

#### **Moderator**
- **Moderación Limitada**: Solo estaciones asignadas
- **Reportes Básicos**: Estadísticas básicas de moderación
- **Gestión de Chat**: Moderación de chat en estaciones asignadas

### Protección de Rutas

```tsx
import { RoleGuard } from '@/core/guard/roleGuard'

// Ruta solo para super admins
<Route
  path="/admin/system"
  element={
    <RoleGuard requiredRoles={['super_admin']}>
      <SystemConfigPage />
    </RoleGuard>
  }
/>

// Ruta para admins y super admins
<Route
  path="/admin/users"
  element={
    <RoleGuard requiredRoles={['admin', 'super_admin']}>
      <UsersManagementPage />
    </RoleGuard>
  }
/>
```

## 👥 Gestión de Usuarios

### Estructura de Usuario

```typescript
interface AdminUser {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  role: UserRole
  status: 'active' | 'inactive' | 'suspended'
  permissions: Permission[]
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
  
  // Información adicional
  avatar?: string
  phone?: string
  timezone: string
  language: string
  
  // Estadísticas
  loginCount: number
  lastActivity: Date
  failedLoginAttempts: number
}
```

### Componente de Gestión de Usuarios

```tsx
import { useState } from 'react'
import { useUsers } from '@/hooks/admin/useUsers'
import { DataTable } from '@/components/ui/data-table'
import { UserActions } from '@/components/admin/users/user-actions'
import { CreateUserDialog } from '@/components/admin/users/create-user-dialog'

export const UsersManagementPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { users, isLoading, error, createUser, updateUser, deleteUser } = useUsers()

  const columns = [
    {
      accessorKey: 'username',
      header: 'Usuario',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Avatar user={row.original} />
          <div>
            <p className="font-medium">{row.getValue('username')}</p>
            <p className="text-sm text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => (
        <Badge variant={getRoleVariant(row.getValue('role'))}>
          {row.getValue('role')}
        </Badge>
      )
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.getValue('status'))}>
          {row.getValue('status')}
        </Badge>
      )
    },
    {
      accessorKey: 'lastLogin',
      header: 'Último Login',
      cell: ({ row }) => formatDate(row.getValue('lastLogin'))
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <UserActions 
          user={row.original}
          onEdit={updateUser}
          onDelete={deleteUser}
        />
      )
    }
  ]

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await createUser(userData)
      setIsCreateDialogOpen(false)
      toast.success('Usuario creado exitosamente')
    } catch (error) {
      toast.error('Error al crear usuario')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra usuarios del sistema y sus permisos
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchKey="username"
        filterKey="role"
      />

      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateUser}
      />
    </div>
  )
}
```

### Hook de Gestión de Usuarios

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/core/services/user.service'

export const useUsers = () => {
  const queryClient = useQueryClient()

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userService.getAllUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserData) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    }
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    }
  })

  return {
    users,
    isLoading,
    error,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending
  }
}
```

## 📊 Analytics y Reportes

### Dashboard Principal de Analytics

```tsx
import { useAdminAnalytics } from '@/hooks/admin/useAdminAnalytics'
import { MetricCard } from '@/components/ui/metric-card'
import { LineChart, BarChart, PieChart } from '@/components/ui/charts'

export const AdminAnalyticsPage = () => {
  const { data, isLoading, error } = useAdminAnalytics()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics del Sistema</h1>
        <p className="text-muted-foreground">
          Métricas y estadísticas del sistema
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Usuarios Totales"
          value={data.totalUsers}
          change={data.userGrowth}
          icon={<UsersIcon />}
        />
        <MetricCard
          title="Estaciones Activas"
          value={data.activeStations}
          change={data.stationGrowth}
          icon={<RadioIcon />}
        />
        <MetricCard
          title="Oyentes Online"
          value={data.onlineListeners}
          change={data.listenerGrowth}
          icon={<HeadphonesIcon />}
        />
        <MetricCard
          title="Ingresos Mensuales"
          value={`$${data.monthlyRevenue.toLocaleString()}`}
          change={data.revenueGrowth}
          icon={<DollarSignIcon />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3>Crecimiento de Usuarios</h3>
          <LineChart
            data={data.userGrowthData}
            xKey="date"
            yKey="users"
            color="blue"
          />
        </div>
        
        <div className="chart-container">
          <h3>Distribución de Géneros</h3>
          <PieChart data={data.genreDistribution} />
        </div>
      </div>

      {/* Tabla de Top Estaciones */}
      <div className="chart-container">
        <h3>Top Estaciones por Oyentes</h3>
        <BarChart
          data={data.topStations}
          xKey="station"
          yKey="listeners"
          color="green"
        />
      </div>
    </div>
  )
}
```

### Hook de Analytics

```tsx
import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/core/services/analytics.service'

export const useAdminAnalytics = (period: AnalyticsPeriod = 'month') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-analytics', period],
    queryFn: () => analyticsService.getAdminAnalytics(period),
    staleTime: 10 * 60 * 1000, // 10 minutos
  })

  return {
    data: data || {
      totalUsers: 0,
      activeStations: 0,
      onlineListeners: 0,
      monthlyRevenue: 0,
      userGrowth: 0,
      stationGrowth: 0,
      listenerGrowth: 0,
      revenueGrowth: 0,
      userGrowthData: [],
      genreDistribution: [],
      topStations: []
    },
    isLoading,
    error
  }
}
```

## 🚫 Sistema de Moderación

### Gestión de Reportes

```tsx
import { useState } from 'react'
import { useReports } from '@/hooks/admin/useReports'
import { ReportCard } from '@/components/admin/reports/report-card'
import { ReportFilters } from '@/components/admin/reports/report-filters'

export const ReportsManagementPage = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    status: 'all',
    type: 'all',
    priority: 'all',
    dateRange: '7d'
  })

  const { reports, isLoading, error, updateReportStatus } = useReports(filters)

  const handleStatusUpdate = async (reportId: string, status: ReportStatus) => {
    try {
      await updateReportStatus(reportId, status)
      toast.success('Estado del reporte actualizado')
    } catch (error) {
      toast.error('Error al actualizar reporte')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Reportes</h1>
        <p className="text-muted-foreground">
          Revisa y gestiona reportes de usuarios y contenido
        </p>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} />

      <div className="space-y-4">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>
    </div>
  )
}
```

### Estructura de Reporte

```typescript
interface Report {
  id: string
  type: 'user' | 'station' | 'chat' | 'event' | 'other'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  
  // Información del reporte
  title: string
  description: string
  evidence?: string[] // URLs de evidencia
  
  // Usuario que reporta
  reporter: User
  
  // Entidad reportada
  reportedEntity: {
    type: 'user' | 'station' | 'message' | 'event'
    id: string
    name: string
  }
  
  // Metadatos
  createdAt: Date
  updatedAt: Date
  assignedTo?: User
  notes?: string[]
  resolution?: string
  
  // Estadísticas
  similarReports: number
  upvotes: number
}
```

## 🏢 Gestión de Estaciones

### Panel de Administración de Estaciones

```tsx
import { useState } from 'react'
import { useAdminStations } from '@/hooks/admin/useAdminStations'
import { StationCard } from '@/components/admin/stations/station-card'
import { StationFilters } from '@/components/admin/stations/station-filters'
import { StationActions } from '@/components/admin/stations/station-actions'

export const AdminStationsPage = () => {
  const [filters, setFilters] = useState<StationFilters>({
    status: 'all',
    genre: 'all',
    creator: 'all',
    dateRange: 'all'
  })

  const { 
    stations, 
    isLoading, 
    error, 
    updateStationStatus,
    deleteStation 
  } = useAdminStations(filters)

  const handleStatusUpdate = async (stationId: string, status: StationStatus) => {
    try {
      await updateStationStatus(stationId, status)
      toast.success('Estado de estación actualizado')
    } catch (error) {
      toast.error('Error al actualizar estación')
    }
  }

  const handleDelete = async (stationId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta estación?')) {
      try {
        await deleteStation(stationId)
        toast.success('Estación eliminada')
      } catch (error) {
        toast.error('Error al eliminar estación')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administración de Estaciones</h1>
        <p className="text-muted-foreground">
          Gestiona todas las estaciones del sistema
        </p>
      </div>

      <StationFilters filters={filters} onFiltersChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            actions={
              <StationActions
                station={station}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            }
          />
        ))}
      </div>
    </div>
  )
}
```

## 📈 Reportes y Analytics

### Sistema de Reportes Automáticos

```typescript
interface AutomatedReport {
  id: string
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  status: 'generating' | 'completed' | 'failed'
  
  // Configuración
  schedule: string // Cron expression
  recipients: string[]
  format: 'pdf' | 'csv' | 'json'
  
  // Contenido
  metrics: string[]
  filters: ReportFilters
  generatedAt?: Date
  
  // Archivo
  fileUrl?: string
  fileSize?: number
}

// Ejemplo de reporte diario
const dailyReport: AutomatedReport = {
  id: 'daily-001',
  type: 'daily',
  status: 'completed',
  schedule: '0 9 * * *', // 9 AM diario
  recipients: ['admin@hoergen.app'],
  format: 'pdf',
  metrics: [
    'total_users',
    'active_stations',
    'online_listeners',
    'chat_messages',
    'revenue'
  ],
  filters: {
    dateRange: '1d',
    includeDeleted: false
  },
  generatedAt: new Date(),
  fileUrl: '/reports/daily-001.pdf',
  fileSize: 1024000
}
```

### Generador de Reportes

```tsx
import { useReportGenerator } from '@/hooks/admin/useReportGenerator'
import { ReportBuilder } from '@/components/admin/reports/report-builder'

export const ReportGeneratorPage = () => {
  const { generateReport, isGenerating } = useReportGenerator()

  const handleGenerateReport = async (config: ReportConfig) => {
    try {
      const report = await generateReport(config)
      toast.success('Reporte generado exitosamente')
      
      // Descargar reporte
      if (report.fileUrl) {
        window.open(report.fileUrl, '_blank')
      }
    } catch (error) {
      toast.error('Error al generar reporte')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generador de Reportes</h1>
        <p className="text-muted-foreground">
          Crea reportes personalizados del sistema
        </p>
      </div>

      <ReportBuilder
        onSubmit={handleGenerateReport}
        isGenerating={isGenerating}
      />
    </div>
  )
}
```

## ⚙️ Configuración del Sistema

### Panel de Configuración

```tsx
import { useState } from 'react'
import { useSystemConfig } from '@/hooks/admin/useSystemConfig'
import { ConfigSection } from '@/components/admin/config/config-section'
import { ConfigForm } from '@/components/admin/config/config-form'

export const SystemConfigPage = () => {
  const { config, isLoading, error, updateConfig } = useSystemConfig()
  const [activeSection, setActiveSection] = useState('general')

  const handleConfigUpdate = async (section: string, data: any) => {
    try {
      await updateConfig(section, data)
      toast.success('Configuración actualizada')
    } catch (error) {
      toast.error('Error al actualizar configuración')
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
        <p className="text-muted-foreground">
          Configura parámetros globales del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de secciones */}
        <div className="space-y-2">
          <ConfigSection
            title="General"
            isActive={activeSection === 'general'}
            onClick={() => setActiveSection('general')}
          />
          <ConfigSection
            title="Seguridad"
            isActive={activeSection === 'security'}
            onClick={() => setActiveSection('security')}
          />
          <ConfigSection
            title="Email"
            isActive={activeSection === 'email'}
            onClick={() => setActiveSection('email')}
          />
          <ConfigSection
            title="Integraciones"
            isActive={activeSection === 'integrations'}
            onClick={() => setActiveSection('integrations')}
          />
        </div>

        {/* Formulario de configuración */}
        <div className="lg:col-span-3">
          <ConfigForm
            section={activeSection}
            config={config[activeSection]}
            onSubmit={(data) => handleConfigUpdate(activeSection, data)}
          />
        </div>
      </div>
    </div>
  )
}
```

### Estructura de Configuración

```typescript
interface SystemConfig {
  general: {
    appName: string
    appVersion: string
    maintenanceMode: boolean
    maxFileSize: number
    allowedFileTypes: string[]
    timezone: string
    language: string
  }
  
  security: {
    jwtExpiry: string
    refreshTokenExpiry: string
    maxLoginAttempts: number
    passwordMinLength: number
    require2FA: boolean
    sessionTimeout: number
  }
  
  email: {
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
  }
  
  integrations: {
    googleAnalytics: string
    stripePublicKey: string
    stripeSecretKey: string
    awsAccessKey: string
    awsSecretKey: string
    awsRegion: string
  }
}
```

## 🔍 Auditoría y Logs

### Sistema de Logs

```typescript
interface SystemLog {
  id: string
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  category: 'auth' | 'user' | 'station' | 'payment' | 'system'
  
  // Información del evento
  message: string
  details?: any
  stackTrace?: string
  
  // Contexto
  userId?: string
  userAgent?: string
  ipAddress?: string
  endpoint?: string
  
  // Metadatos
  timestamp: Date
  environment: 'development' | 'staging' | 'production'
}

// Ejemplo de log de auditoría
const auditLog: SystemLog = {
  id: 'log-001',
  level: 'info',
  category: 'user',
  message: 'Usuario eliminado',
  details: {
    deletedUserId: 'user-123',
    deletedBy: 'admin-456',
    reason: 'Violación de términos de servicio'
  },
  userId: 'admin-456',
  userAgent: 'Mozilla/5.0...',
  ipAddress: '192.168.1.1',
  endpoint: 'DELETE /api/admin/users/user-123',
  timestamp: new Date(),
  environment: 'production'
}
```

### Visor de Logs

```tsx
import { useState, useEffect } from 'react'
import { useSystemLogs } from '@/hooks/admin/useSystemLogs'
import { LogViewer } from '@/components/admin/logs/log-viewer'
import { LogFilters } from '@/components/admin/logs/log-filters'

export const SystemLogsPage = () => {
  const [filters, setFilters] = useState<LogFilters>({
    level: 'all',
    category: 'all',
    dateRange: '24h',
    search: ''
  })

  const { logs, isLoading, error, loadMore } = useSystemLogs(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Logs del Sistema</h1>
        <p className="text-muted-foreground">
          Monitorea y analiza logs del sistema
        </p>
      </div>

      <LogFilters filters={filters} onFiltersChange={setFilters} />

      <LogViewer
        logs={logs}
        isLoading={isLoading}
        onLoadMore={loadMore}
      />
    </div>
  )
}
```

## 🚀 Funcionalidades Futuras

### Planificadas para Próximas Versiones

#### 1. **Machine Learning para Moderación**
- Detección automática de contenido inapropiado
- Predicción de comportamiento tóxico
- Moderación inteligente de chat

#### 2. **Dashboard en Tiempo Real**
- Métricas en vivo
- Alertas automáticas
- Notificaciones push

#### 3. **API de Administración**
- Endpoints REST para integraciones externas
- Webhooks para eventos del sistema
- SDK para desarrolladores

#### 4. **Sistema de Backups Automáticos**
- Respaldos programados
- Restauración punto-in-tiempo
- Sincronización multi-región

## 📚 Recursos Adicionales

- [React Admin Documentation](https://marmelab.com/react-admin/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Recharts](https://recharts.org/) - Librería de gráficos
- [React Hook Form](https://react-hook-form.com/) - Formularios
- [Zod](https://zod.dev/) - Validación de esquemas

---

**Última actualización**: Diciembre 2024  
**Versión**: 0.1.4  
**Mantenedor**: Equipo de Desarrollo
