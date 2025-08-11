# 🚀 Guía de Inicio Rápido

Esta guía te ayudará a configurar y ejecutar Hoergen WebApp en tu entorno de desarrollo local.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.0.0 o superior)
- **npm** o **pnpm** (recomendado)
- **Git**

### Verificar instalaciones

```bash
node --version
npm --version
git --version
```

## 🏗️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/eehcx/hoergen.webapp.git
cd hoergen.webapp
```

### 2. Instalar dependencias

```bash
# Usando npm
npm install

# Usando pnpm (recomendado)
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita el archivo `.env.local` con tus configuraciones:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# Firebase Configuration (si usas Firebase)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=true
```

## 🚀 Ejecutar la Aplicación

### Desarrollo Web

```bash
# Iniciar servidor de desarrollo
npm run dev
# o
pnpm dev

# La aplicación estará disponible en: http://localhost:5173
```

### Desarrollo con Electron

```bash
# En una terminal: iniciar servidor de desarrollo
npm run dev

# En otra terminal: iniciar Electron
npm run dev:electron
# o
pnpm dev:electron
```

### Build de Producción

```bash
# Build para web
npm run build
# o
pnpm build

# Build para Electron
npm run build:electron
# o
pnpm build:electron
```

## 🖥️ Configuración de Electron

### Requisitos del Sistema

- **Windows**: Windows 10 o superior
- **macOS**: macOS 10.14 o superior
- **Linux**: Ubuntu 18.04+ o distribución similar

### Configuración de Build

El proyecto incluye configuraciones predefinidas para diferentes plataformas:

- **Linux**: AppImage
- **Windows**: NSIS installer
- **macOS**: DMG

### Personalizar Build

Edita `package.json` en la sección `build` para personalizar:

```json
{
  "build": {
    "appId": "com.eehcx.hoergen",
    "productName": "Hoergen",
    "directories": {
      "buildResources": "resources",
      "output": "release"
    }
  }
}
```

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `dev` | Inicia servidor de desarrollo |
| `dev:electron` | Inicia aplicación Electron en modo desarrollo |
| `build` | Construye aplicación para producción |
| `build:electron` | Construye aplicación Electron |
| `build:electron-simple` | Construye Electron con configuración simple |
| `preview` | Previsualiza build de producción |
| `lint` | Ejecuta ESLint |
| `format` | Formatea código con Prettier |
| `format:check` | Verifica formato del código |

## 🌐 Acceso a la Aplicación

Una vez ejecutada, podrás acceder a:

- **Web**: http://localhost:5173
- **Electron**: Aplicación de escritorio nativa

## 🎯 Primeros Pasos

### 1. Crear una cuenta

- Navega a `/sign-up`
- Completa el formulario de registro
- Verifica tu email

### 2. Explorar estaciones

- Visita `/browse` para ver estaciones disponibles
- Usa filtros por género, país, etc.
- Agrega estaciones a favoritos

### 3. Crear contenido (si eres creador)

- Ve a `/creator` para gestionar tu estación
- Configura eventos y programación
- Modera el chat en vivo

### 4. Administración (si eres admin)

- Accede a `/admin` para el panel de administración
- Gestiona usuarios y contenido
- Revisa reportes y analytics

## 🐛 Solución de Problemas

### Problemas Comunes

#### Error de puerto ocupado
```bash
# Cambiar puerto en vite.config.ts
export default defineConfig({
  server: {
    port: 3001
  }
})
```

#### Error de dependencias
```bash
# Limpiar cache e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

#### Error de Electron
```bash
# Reinstalar dependencias de Electron
npm rebuild electron
```

### Logs y Debug

- **Web**: Usa DevTools del navegador
- **Electron**: Los logs aparecen en la consola del terminal
- **Build**: Revisa la carpeta `release/` para archivos generados

## 📚 Próximos Pasos

- 📖 Lee la [Documentación de Arquitectura](./architecture.md)
- 🛣️ Explora el [Sistema de Rutas](./routing.md)
- 🎨 Conoce los [Componentes UI](./components.md)
- 🔐 Entiende el [Sistema de Autenticación](./authentication.md)

## 🤝 Contribuir

¿Encontraste un bug o tienes una sugerencia?

1. Abre un [Issue](https://github.com/eehcx/hoergen.webapp/issues)
2. Describe el problema o sugerencia
3. Incluye pasos para reproducir (si aplica)
4. Adjunta logs o capturas de pantalla

## 📞 Soporte

Si necesitas ayuda adicional:

- 📧 Email: eehcx.contacto@gmail.com
- 💬 Discord: [Servidor de la comunidad]
- 📖 Wiki: [Documentación completa]

---

**¿Listo para comenzar?** 🚀  
Sigue esta guía y tendrás Hoergen WebApp funcionando en minutos.
