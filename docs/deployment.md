# 🚀 Deployment

La documentación de **Deployment** cubre todo el proceso de despliegue de Hoergen WebApp en diferentes entornos, desde desarrollo hasta producción.

## 📋 Índice

- [Entornos de Despliegue](#entornos-de-despliegue)
- [Configuración de Producción](#configuración-de-producción)
- [Variables de Entorno](#variables-de-entorno)
- [Build de Producción](#build-de-producción)
- [Optimizaciones](#optimizaciones)
- [Despliegue en Firebase](#despliegue-en-firebase)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Despliegue en Netlify](#despliegue-en-netlify)
- [Monitoreo y Analytics](#monitoreo-y-analytics)
- [Rollback y Recuperación](#rollback-y-recuperación)

## 🌍 Entornos de Despliegue

### Estructura de Entornos

```
Development → Staging → Production
     ↓           ↓         ↓
   Local    Pre-prod    Live App
```

### Configuración por Entorno

```typescript
// src/config/environments.ts
export const environments = {
  development: {
    name: 'Development',
    apiUrl: 'http://localhost:8000/api',
    wsUrl: 'ws://localhost:8000/ws',
    streamingUrl: 'http://localhost:8000/stream',
    enableDebug: true,
    enableMockData: true,
    enableHotReload: true,
  },
  
  staging: {
    name: 'Staging',
    apiUrl: 'https://staging-api.hoergen.app/api',
    wsUrl: 'wss://staging-api.hoergen.app/ws',
    streamingUrl: 'https://staging-stream.hoergen.app',
    enableDebug: true,
    enableMockData: false,
    enableHotReload: false,
  },
  
  production: {
    name: 'Production',
    apiUrl: 'https://api.hoergen.app/api',
    wsUrl: 'wss://api.hoergen.app/ws',
    streamingUrl: 'https://stream.hoergen.app',
    enableDebug: false,
    enableMockData: false,
    enableHotReload: false,
  },
};
```

## ⚙️ Configuración de Producción

### Configuración de Vite para Producción

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@utils': resolve(__dirname, 'src/utils'),
      },
    },
    
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'terser' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['@tanstack/react-router'],
            ui: ['@radix-ui/react-*'],
            audio: ['howler', 'web-audio-api'],
            utils: ['date-fns', 'lodash-es'],
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
    },
    
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __ENVIRONMENT__: JSON.stringify(mode),
    },
  };
});
```

### Configuración de TypeScript para Producción

```json
// tsconfig.prod.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "removeComments": true,
    "noEmit": false,
    "outDir": "./dist",
    "declaration": false,
    "declarationMap": false
  },
  "exclude": [
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/*.spec.ts",
    "src/**/*.spec.tsx",
    "src/test/**/*",
    "tests/**/*"
  ]
}
```

## 🔧 Variables de Entorno

### Archivo `.env.production`

```bash
# Configuración de la aplicación
VITE_APP_NAME=Hoergen WebApp
VITE_APP_VERSION=0.1.4
VITE_APP_ENV=production
VITE_APP_URL=https://hoergen.app

# API y servicios
VITE_API_BASE_URL=https://api.hoergen.app/api
VITE_WEBSOCKET_URL=wss://api.hoergen.app/ws
VITE_STREAMING_URL=https://stream.hoergen.app

# Autenticación
VITE_AUTH_DOMAIN=auth.hoergen.app
VITE_AUTH_CLIENT_ID=your_production_client_id
VITE_AUTH_AUDIENCE=your_production_audience

# Analytics y monitoreo
VITE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your_sentry_dsn
VITE_GOOGLE_TAG_MANAGER=GTM-XXXXXXX

# Características de producción
VITE_ENABLE_DEBUG=false
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_HOT_RELOAD=false
VITE_ENABLE_SERVICE_WORKER=true
VITE_ENABLE_PWA=true

# CDN y assets
VITE_CDN_URL=https://cdn.hoergen.app
VITE_ASSETS_URL=https://assets.hoergen.app

# Performance
VITE_ENABLE_COMPRESSION=true
VITE_ENABLE_CACHING=true
VITE_CACHE_VERSION=v1
```

### Archivo `.env.staging`

```bash
# Configuración de staging
VITE_APP_ENV=staging
VITE_APP_URL=https://staging.hoergen.app

# API de staging
VITE_API_BASE_URL=https://staging-api.hoergen.app/api
VITE_WEBSOCKET_URL=wss://staging-api.hoergen.app/ws
VITE_STREAMING_URL=https://staging-stream.hoergen.app

# Debug habilitado para staging
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK_DATA=false
```

## 🏗️ Build de Producción

### Scripts de Build

```json
{
  "scripts": {
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production",
    "build:analyze": "vite build --mode production && npm run analyze:bundle",
    "analyze:bundle": "npx vite-bundle-analyzer dist/stats.html",
    "preview": "vite preview",
    "preview:staging": "vite preview --mode staging",
    "preview:production": "vite preview --mode production"
  }
}
```

### Proceso de Build

```bash
# 1. Limpiar directorios anteriores
rm -rf dist build

# 2. Verificar dependencias
npm ci --only=production

# 3. Verificar tipos de TypeScript
npm run type-check

# 4. Ejecutar tests
npm run test:coverage

# 5. Linting y formateo
npm run lint
npm run format:check

# 6. Build de producción
npm run build:production

# 7. Verificar build
npm run preview:production
```

### Verificación de Build

```bash
# Verificar archivos generados
ls -la dist/

# Verificar tamaño de bundles
du -sh dist/assets/*.js
du -sh dist/assets/*.css

# Verificar que no haya console.log en producción
grep -r "console.log" dist/ || echo "No console.log found"

# Verificar source maps (no deberían existir en producción)
find dist/ -name "*.map" | wc -l
```

## 🚀 Optimizaciones

### Optimización de Bundles

```typescript
// vite.config.ts - Optimizaciones de build
export default defineConfig({
  build: {
    // Code splitting inteligente
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('@radix-ui')) return 'radix-vendor';
            if (id.includes('@tanstack')) return 'router-vendor';
            return 'vendor';
          }
          
          // Feature chunks
          if (id.includes('src/features/auth')) return 'auth';
          if (id.includes('src/features/player')) return 'player';
          if (id.includes('src/features/chat')) return 'chat';
          if (id.includes('src/features/stations')) return 'stations';
        },
      },
    },
    
    // Optimizaciones de CSS
    cssCodeSplit: true,
    cssMinify: true,
    
    // Optimizaciones de assets
    assetsInlineLimit: 4096, // 4KB
    chunkSizeWarningLimit: 1000, // 1MB
  },
});
```

### Optimización de Imágenes

```typescript
// vite.config.ts - Plugin de optimización de imágenes
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: {
        quality: 80,
        speed: 4,
      },
      jpeg: {
        quality: 80,
        progressive: true,
      },
      webp: {
        quality: 80,
        lossless: false,
      },
    }),
  ],
});
```

### Service Worker para Caching

```typescript
// public/sw.js
const CACHE_NAME = 'hoergen-cache-v1';
const urlsToCache = [
  '/',
  '/static/js/main.bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

## 🔥 Despliegue en Firebase

### Configuración de Firebase

```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### Scripts de Despliegue Firebase

```json
{
  "scripts": {
    "deploy:firebase": "npm run build:production && firebase deploy",
    "deploy:firebase:staging": "npm run build:staging && firebase deploy --project staging",
    "deploy:firebase:production": "npm run build:production && firebase deploy --project production"
  }
}
```

### Variables de Entorno de Firebase

```bash
# .firebaserc
{
  "projects": {
    "default": "hoergen-staging",
    "staging": "hoergen-staging",
    "production": "hoergen-production"
  }
}
```

## ⚡ Despliegue en Vercel

### Configuración de Vercel

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Scripts de Despliegue Vercel

```json
{
  "scripts": {
    "deploy:vercel": "npm run build:production && vercel --prod",
    "deploy:vercel:staging": "npm run build:staging && vercel",
    "vercel:build": "npm run build:production"
  }
}
```

## 🌐 Despliegue en Netlify

### Configuración de Netlify

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build:production"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.@(js|css)"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.@(jpg|jpeg|gif|png|svg|webp)"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Scripts de Despliegue Netlify

```json
{
  "scripts": {
    "deploy:netlify": "npm run build:production && netlify deploy --prod",
    "deploy:netlify:staging": "npm run build:staging && netlify deploy",
    "build:netlify": "npm run build:production"
  }
}
```

## 📊 Monitoreo y Analytics

### Google Analytics

```typescript
// src/utils/analytics.ts
export const initAnalytics = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_ANALYTICS_ID) {
    // Inicializar Google Analytics
    gtag('config', import.meta.env.VITE_ANALYTICS_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

export const trackEvent = (action: string, category: string, label?: string) => {
  if (import.meta.env.PROD && import.meta.env.VITE_ANALYTICS_ID) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};
```

### Sentry para Monitoreo de Errores

```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react';

export const initMonitoring = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENV,
      release: import.meta.env.VITE_APP_VERSION,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};
```

### Performance Monitoring

```typescript
// src/utils/performance.ts
export const trackPerformance = () => {
  if ('performance' in window) {
    // Core Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(trackMetric);
        getFID(trackMetric);
        getFCP(trackMetric);
        getLCP(trackMetric);
        getTTFB(trackMetric);
      });
    }
    
    // Navigation Timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        trackMetric('TTFB', navigation.responseStart - navigation.requestStart);
        trackMetric('DOMContentLoaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        trackMetric('Load', navigation.loadEventEnd - navigation.loadEventStart);
      }
    });
  }
};

const trackMetric = (name: string, value: number) => {
  if (import.meta.env.PROD) {
    // Enviar a analytics
    trackEvent('performance', name, value.toString());
    
    // Enviar a Sentry
    Sentry.metrics.gauge(name, value);
  }
};
```

## 🔄 Rollback y Recuperación

### Estrategia de Rollback

```bash
# Script de rollback para Firebase
#!/bin/bash
# rollback-firebase.sh

PROJECT_ID=$1
VERSION=$2

if [ -z "$PROJECT_ID" ] || [ -z "$VERSION" ]; then
  echo "Usage: ./rollback-firebase.sh <project-id> <version>"
  exit 1
fi

echo "Rolling back to version $VERSION on project $PROJECT_ID"

# Listar versiones disponibles
firebase hosting:releases:list --project $PROJECT_ID

# Hacer rollback a versión específica
firebase hosting:releases:rollback $VERSION --project $PROJECT_ID

echo "Rollback completed successfully"
```

### Backup y Recuperación

```typescript
// src/utils/backup.ts
export const createBackup = async () => {
  const backup = {
    timestamp: new Date().toISOString(),
    version: import.meta.env.VITE_APP_VERSION,
    userData: await getUserData(),
    settings: await getSettings(),
  };
  
  // Guardar en localStorage
  localStorage.setItem('hoergen_backup', JSON.stringify(backup));
  
  // Enviar a servidor si es posible
  try {
    await api.post('/backup', backup);
  } catch (error) {
    console.warn('Could not save backup to server:', error);
  }
  
  return backup;
};

export const restoreBackup = async (backupId?: string) => {
  let backup;
  
  if (backupId) {
    // Restaurar desde servidor
    backup = await api.get(`/backup/${backupId}`);
  } else {
    // Restaurar desde localStorage
    const localBackup = localStorage.getItem('hoergen_backup');
    if (localBackup) {
      backup = JSON.parse(localBackup);
    }
  }
  
  if (backup) {
    await restoreUserData(backup.userData);
    await restoreSettings(backup.settings);
    return true;
  }
  
  return false;
};
```

## 📚 Recursos Adicionales

### Documentación de Plataformas

- **Firebase**: [Hosting Documentation](https://firebase.google.com/docs/hosting)
- **Vercel**: [Deployment Documentation](https://vercel.com/docs)
- **Netlify**: [Deploy Documentation](https://docs.netlify.com/)

### Herramientas de Monitoreo

- **Google Analytics**: [Analytics Documentation](https://developers.google.com/analytics)
- **Sentry**: [Error Monitoring](https://sentry.io/for/javascript/)
- **Lighthouse**: [Performance Auditing](https://developers.google.com/web/tools/lighthouse)

---

**Última actualización**: Diciembre 2024  
**Versión**: 0.1.4  
**Autor**: Equipo de Hoergen
