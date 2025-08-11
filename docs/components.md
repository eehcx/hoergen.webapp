# 🎨 Sistema de Componentes UI

## 📋 Descripción General

El sistema de componentes UI de **Hoergen WebApp** está construido sobre una base sólida de componentes reutilizables, siguiendo los principios de diseño atómico y manteniendo consistencia visual en toda la aplicación.

## 🏗️ Arquitectura de Componentes

### Estructura de Carpetas

```
src/components/
├── ui/                    # Componentes base de Shadcn/ui
├── layout/                # Componentes de layout y navegación
├── data-table/           # Componentes para tablas de datos
└── [otros componentes]   # Componentes específicos de features
```

### Jerarquía de Componentes

1. **Componentes Base (UI)**: Componentes fundamentales reutilizables
2. **Componentes de Layout**: Estructura y navegación
3. **Componentes de Datos**: Tablas, formularios, listas
4. **Componentes de Feature**: Funcionalidades específicas

## 🎯 Componentes Base (UI)

### Botones y Controles

#### Button
```tsx
import { Button } from "@/components/ui/button"

// Variantes disponibles
<Button variant="default">Botón Principal</Button>
<Button variant="destructive">Eliminar</Button>
<Button variant="outline">Contorno</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="ghost">Fantasma</Button>
<Button variant="link">Enlace</Button>

// Tamaños
<Button size="default">Normal</Button>
<Button size="sm">Pequeño</Button>
<Button size="lg">Grande</Button>
<Button size="icon">Icono</Button>
```

#### Input
```tsx
import { Input } from "@/components/ui/input"

<Input 
  type="text" 
  placeholder="Escribe algo..." 
  className="w-full"
/>
```

#### Select
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona una opción" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opción 1</SelectItem>
    <SelectItem value="option2">Opción 2</SelectItem>
  </SelectContent>
</Select>
```

### Feedback y Notificaciones

#### Alert
```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert>
  <AlertTitle>Información</AlertTitle>
  <AlertDescription>
    Este es un mensaje informativo para el usuario.
  </AlertDescription>
</Alert>
```

#### Toast
```tsx
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

toast({
  title: "Éxito",
  description: "Operación completada correctamente",
  variant: "default", // default, destructive
})
```

### Navegación

#### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="account" className="w-full">
  <TabsList>
    <TabsTrigger value="account">Cuenta</TabsTrigger>
    <TabsTrigger value="password">Contraseña</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Contenido de cuenta</TabsContent>
  <TabsContent value="password">Contenido de contraseña</TabsContent>
</Tabs>
```

#### Navigation Menu
```tsx
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Explorar</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/browse">
          Todas las estaciones
        </NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## 🎨 Componentes de Layout

### AppSidebar
```tsx
import { AppSidebar } from "@/components/layout/app-sidebar"

// Sidebar principal de la aplicación
<AppSidebar 
  user={user}
  currentPath={pathname}
  onNavigate={handleNavigate}
/>
```

### Header
```tsx
import { Header } from "@/components/layout/header"

// Header principal con navegación y controles de usuario
<Header 
  user={user}
  onSignOut={handleSignOut}
  onToggleTheme={handleToggleTheme}
/>
```

### AdminLayout
```tsx
import { AdminLayout } from "@/components/layout/admin-layout"

// Layout específico para el panel de administración
<AdminLayout>
  <Outlet />
</AdminLayout>
```

## 📊 Componentes de Datos

### DataTable
```tsx
import { DataTable } from "@/components/ui/data-table"

// Tabla de datos con funcionalidades avanzadas
<DataTable
  columns={columns}
  data={data}
  searchKey="name"
  filterKey="status"
/>
```

#### Columnas de Tabla
```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActions user={row.original} />,
  },
]
```

### Formularios

#### Form
```tsx
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"

const form = useForm({
  resolver: zodResolver(userSchema),
  defaultValues: {
    name: "",
    email: "",
  },
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## 🎵 Componentes Específicos de Radio

### MiniPlayer
```tsx
import { MiniPlayer } from "@/components/mini-player"

// Reproductor compacto para navegación
<MiniPlayer
  station={currentStation}
  isPlaying={isPlaying}
  onPlayPause={handlePlayPause}
  onNext={handleNext}
  onPrevious={handlePrevious}
/>
```

### ChatWindow
```tsx
import { ChatWindow } from "@/components/station/chat-window"

// Ventana de chat para estaciones
<ChatWindow
  stationId={station.id}
  messages={messages}
  onSendMessage={handleSendMessage}
  onModerate={handleModerate}
/>
```

### StationCard
```tsx
import { StationCard } from "@/components/station/station-card"

// Tarjeta de estación para listados
<StationCard
  station={station}
  onPlay={handlePlay}
  onFavorite={handleFavorite}
  onShare={handleShare}
/>
```

## 🎨 Sistema de Temas

### Configuración de Temas
```tsx
import { useTheme } from "@/hooks/use-theme"

const { theme, setTheme } = useTheme()

// Cambiar tema
setTheme("dark") // "light" | "dark" | "system"
```

### Variables CSS Personalizables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

## 🔧 Componentes de Utilidad

### Loading Spinner
```tsx
import { Loader2 } from "lucide-react"

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <Loader2 className="h-4 w-4 animate-spin" />
  </div>
)
```

### Error Boundary
```tsx
import { ErrorBoundary } from "@/components/error-boundary"

<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

### Confirm Dialog
```tsx
import { ConfirmDialog } from "@/components/confirm-dialog"

<ConfirmDialog
  title="Confirmar acción"
  description="¿Estás seguro de que quieres continuar?"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

## 📱 Responsive Design

### Breakpoints
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Componentes Adaptativos
```tsx
import { useMediaQuery } from "@/hooks/use-media-query"

const isMobile = useMediaQuery("(max-width: 768px)")

return (
  <div className={cn(
    "flex",
    isMobile ? "flex-col space-y-4" : "flex-row space-x-4"
  )}>
    {/* Contenido adaptativo */}
  </div>
)
```

## 🎯 Mejores Prácticas

### 1. Composición de Componentes
- Usa composición en lugar de herencia
- Mantén componentes pequeños y enfocados
- Reutiliza lógica con hooks personalizados

### 2. Props y Tipado
- Define interfaces claras para props
- Usa TypeScript para validación de tipos
- Proporciona valores por defecto cuando sea apropiado

### 3. Accesibilidad
- Incluye atributos ARIA apropiados
- Asegura navegación por teclado
- Mantén contraste de colores adecuado

### 4. Performance
- Usa `React.memo` para componentes costosos
- Implementa lazy loading cuando sea necesario
- Optimiza re-renders con hooks apropiados

## 🔄 Actualización de Componentes

### Proceso de Actualización
1. **Identificar necesidad**: Nuevo requerimiento o bug
2. **Diseñar solución**: Mockup o especificación
3. **Implementar**: Desarrollo del componente
4. **Testear**: Verificación de funcionalidad
5. **Documentar**: Actualización de esta documentación
6. **Desplegar**: Integración en la aplicación

### Versionado
- Los componentes siguen el versionado semántico
- Cambios breaking se documentan claramente
- Migración guiada para actualizaciones mayores

## 📚 Recursos Adicionales

- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Documentation](https://react.dev/)

---

**Última actualización**: Diciembre 2024  
**Versión**: 0.1.4  
**Mantenedor**: Equipo de Desarrollo
