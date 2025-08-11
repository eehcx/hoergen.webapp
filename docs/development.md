# 🔧 Desarrollo y Build

La documentación de **Desarrollo y Build** cubre todo lo necesario para configurar el entorno de desarrollo, ejecutar la aplicación localmente y construir versiones de producción de Hoergen WebApp.

## 📋 Índice

- [Requisitos del Sistema](#requisitos-del-sistema)
- [Configuración del Entorno](#configuración-del-entorno)
- [Instalación de Dependencias](#instalación-de-dependencias)
- [Scripts Disponibles](#scripts-disponibles)
- [Configuración de Desarrollo](#configuración-de-desarrollo)
- [Herramientas de Build](#herramientas-de-build)
- [Configuración de TypeScript](#configuración-de-typescript)
- [Linting y Formateo](#linting-y-formateo)
- [Testing](#testing)
- [Debugging](#debugging)
- [Deployment Local](#deployment-local)
- [Troubleshooting](#troubleshooting)

## 💻 Requisitos del Sistema

### Requisitos Mínimos

- **Node.js**: Versión 18.0.0 o superior
- **npm**: Versión 9.0.0 o superior
- **Git**: Versión 2.30.0 o superior
- **RAM**: Mínimo 4GB disponible
- **Espacio en disco**: Mínimo 2GB libre

### Requisitos Recomendados

- **Node.js**: Versión 20.0.0 LTS
- **npm**: Versión 10.0.0 o superior
- **RAM**: 8GB o superior
- **Espacio en disco**: 5GB libre
- **Procesador**: Multi-core moderno

### Sistemas Operativos Soportados

- **Linux**: Ubuntu 20.04+, Debian 11+, Arch Linux
- **macOS**: 11.0 (Big Sur) o superior
- **Windows**: Windows 10/11 (WSL2 recomendado)

## 🚀 Configuración del Entorno

### Clonación del Repositorio

```bash
# Clonar el repositorio principal
git clone https://github.com/eehcx/hoergen.webapp.git

# Navegar al directorio del proyecto
cd hoergen.webapp

# Verificar la rama actual
git branch -a
```

### Configuración de Git

```bash
# Configurar usuario de Git (si no está configurado)
git config user.name "Tu Nombre"
git config user.email "tu.email@ejemplo.com"

# Configurar rama por defecto
git checkout main

# Configurar upstream remoto
git remote add upstream https://github.com/eehcx/hoergen.webapp.git
```

### Variables de Entorno

#### Archivo `.env.local`

```bash
# Crear archivo de variables de entorno local
cp .env.example .env.local

# Editar variables de entorno
nano .env.local
```

#### Variables Principales

```bash
# Configuración de la aplicación
VITE_APP_NAME=Hoergen WebApp
VITE_APP_VERSION=0.1.4
VITE_APP_ENV=development

# API y servicios
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000/ws
VITE_STREAMING_URL=http://localhost:8000/stream

# Autenticación
VITE_AUTH_DOMAIN=auth.hoergen.app
VITE_AUTH_CLIENT_ID=your_client_id
VITE_AUTH_AUDIENCE=your_audience

# Analytics y monitoreo
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn

# Características de desarrollo
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_HOT_RELOAD=true
```

## 📦 Instalación de Dependencias

### Instalación Inicial

```bash
# Instalar dependencias del proyecto
npm install

# O usar pnpm (recomendado)
pnpm install

# O usar yarn
yarn install
```

### Verificación de Instalación

```bash
# Verificar que todas las dependencias estén instaladas
npm ls --depth=0

# Verificar scripts disponibles
npm run

# Verificar configuración de TypeScript
npx tsc --noEmit
```

### Dependencias de Desarrollo

#### Dependencias Principales

```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-react": "^7.0.0",
    "eslint-plugin-react-hooks": "^4.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

#### Dependencias de Testing

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "vitest": "^1.0.0"
  }
}
```

## 📜 Scripts Disponibles

### Scripts de Desarrollo

#### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar con modo de inspección
npm run dev:debug

# Iniciar con modo de análisis
npm run dev:analyze

# Iniciar solo frontend
npm run dev:frontend

# Iniciar solo backend (si aplica)
npm run dev:backend
```

#### Scripts de Build

```bash
# Construir para producción
npm run build

# Construir con análisis de bundle
npm run build:analyze

# Construir para staging
npm run build:staging

# Construir para desarrollo
npm run build:dev

# Construir solo componentes
npm run build:components
```

#### Scripts de Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests de integración
npm run test:integration

# Ejecutar tests de E2E
npm run test:e2e
```

#### Scripts de Linting y Formateo

```bash
# Ejecutar ESLint
npm run lint

# Ejecutar ESLint con auto-fix
npm run lint:fix

# Verificar formato con Prettier
npm run format:check

# Formatear código con Prettier
npm run format:write

# Verificar tipos de TypeScript
npm run type-check
```

#### Scripts de Utilidades

```bash
# Limpiar directorios de build
npm run clean

# Generar tipos de TypeScript
npm run generate:types

# Actualizar dependencias
npm run update:deps

# Verificar vulnerabilidades
npm run audit

# Ejecutar análisis de código
npm run analyze
```

## ⚙️ Configuración de Desarrollo

### Configuración de Vite

#### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@features': resolve(__dirname, 'src/features'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['@radix-ui/react-*'],
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
```

### Configuración de TypeScript

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@stores/*": ["src/stores/*"],
      "@features/*": ["src/features/*"]
    }
  },
  "include": [
    "src/**/*",
    "vite-env.d.ts",
    "mini-player.d.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build"
  ]
}
```

### Configuración de ESLint

#### `.eslintrc.js`

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### Configuración de Prettier

#### `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve"
}
```

## 🛠️ Herramientas de Build

### Vite como Bundler

#### Características Principales

- **Hot Module Replacement (HMR)**: Recarga instantánea durante desarrollo
- **Build optimizado**: Construcción rápida para producción
- **Code splitting**: División automática de bundles
- **Tree shaking**: Eliminación de código no utilizado
- **Source maps**: Mapeo de código para debugging

#### Plugins Utilizados

```typescript
// Plugins principales
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Plugins adicionales (si se necesitan)
import legacy from '@vitejs/plugin-legacy';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
```

### Optimizaciones de Build

#### Code Splitting

```typescript
// Configuración de chunks manuales
rollupOptions: {
  output: {
    manualChunks: {
      // Vendor chunks
      vendor: ['react', 'react-dom'],
      router: ['@tanstack/react-router'],
      ui: ['@radix-ui/react-*'],
      
      // Feature chunks
      auth: ['@/features/auth'],
      player: ['@/features/player'],
      chat: ['@/features/chat'],
      
      // Utility chunks
      utils: ['@/utils'],
      hooks: ['@/hooks'],
    },
  },
},
```

#### Optimizaciones de CSS

```typescript
// Configuración de CSS
css: {
  modules: {
    localsConvention: 'camelCase',
  },
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@/styles/variables.scss";`,
    },
  },
  postcss: {
    plugins: [
      autoprefixer(),
      cssnano({
        preset: 'default',
      }),
    ],
  },
},
```

## 🧪 Testing

### Configuración de Testing

#### Vitest para Testing Unitario

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
});
```

#### Testing Library para React

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

### Ejemplos de Tests

#### Test de Componente

```typescript
// src/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass('btn-secondary');
  });
});
```

#### Test de Hook

```typescript
// src/hooks/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('returns stored value when available', () => {
    localStorage.setItem('test', 'stored');
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates stored value when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    
    act(() => {
      result.current[1]('new value');
    });
    
    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem('test')).toBe('"new value"');
  });
});
```

## 🐛 Debugging

### Herramientas de Debug

#### React Developer Tools

```bash
# Instalar extensión del navegador
# Chrome: React Developer Tools
# Firefox: React Developer Tools

# Habilitar en desarrollo
VITE_ENABLE_DEBUG=true
```

#### Configuración de Source Maps

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true, // Habilitar source maps en producción
  },
  server: {
    sourcemap: true, // Habilitar source maps en desarrollo
  },
});
```

#### Logging y Debug

```typescript
// src/utils/logger.ts
const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[Hoergen]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[Hoergen]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[Hoergen]', ...args);
  },
  debug: (...args: any[]) => {
    if (isDevelopment && import.meta.env.VITE_ENABLE_DEBUG) {
      console.debug('[Hoergen]', ...args);
    }
  },
};
```

### Debugging en Producción

#### Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Enviar a servicio de monitoreo
    if (import.meta.env.PROD) {
      // Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          <p>Ha ocurrido un error inesperado.</p>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 🚀 Deployment Local

### Construcción para Producción

```bash
# Construir aplicación
npm run build

# Verificar archivos generados
ls -la dist/

# Servir archivos estáticos localmente
npm run preview

# O usar servidor HTTP simple
npx serve dist/
```

### Análisis de Bundle

```bash
# Generar análisis de bundle
npm run build:analyze

# Abrir reporte en navegador
open dist/analyze.html
```

### Optimización de Imágenes

```bash
# Optimizar imágenes antes del build
npm run optimize:images

# Comprimir assets
npm run compress:assets
```

## 🔍 Troubleshooting

### Problemas Comunes

#### Error de Dependencias

```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versiones de Node.js
node --version
npm --version
```

#### Problemas de Build

```bash
# Limpiar directorios de build
npm run clean

# Verificar configuración de TypeScript
npx tsc --noEmit

# Verificar configuración de ESLint
npm run lint

# Verificar tipos
npm run type-check
```

#### Problemas de Desarrollo

```bash
# Reiniciar servidor de desarrollo
# Presionar Ctrl+C y ejecutar npm run dev

# Verificar puertos disponibles
lsof -i :3000

# Limpiar cache del navegador
# Hard refresh: Ctrl+Shift+R
```

### Logs y Debugging

#### Habilitar Logs Detallados

```bash
# Habilitar logs de Vite
DEBUG=vite:* npm run dev

# Habilitar logs de TypeScript
VITE_TS_VERBOSE=true npm run dev

# Habilitar logs de ESLint
ESLINT_DEBUG=true npm run lint
```

#### Verificar Configuración

```bash
# Verificar configuración de Vite
npx vite --config vite.config.ts --mode development

# Verificar configuración de TypeScript
npx tsc --showConfig

# Verificar configuración de ESLint
npx eslint --print-config src/
```

## 📚 Recursos Adicionales

### Documentación Oficial

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

### Herramientas Recomendadas

- **VS Code Extensions**: ESLint, Prettier, TypeScript Importer
- **Browser Extensions**: React Developer Tools, Redux DevTools
- **CLI Tools**: npm-check-updates, tldr
- **API Testing**: Postman, Insomnia, Thunder Client

### Comunidad y Soporte

- **GitHub Issues**: [Reportar bugs](https://github.com/eehcx/hoergen.webapp/issues)
- **Discord**: [Servidor de desarrolladores](https://discord.gg/hoergen-dev)
- **Stack Overflow**: Etiqueta `hoergen-webapp`
- **Reddit**: r/hoergen

---

**Última actualización**: Diciembre 2024  
**Versión**: 0.1.4  
**Autor**: Equipo de Hoergen
