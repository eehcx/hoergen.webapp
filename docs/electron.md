# 🖥️ Aplicación de Escritorio (Electron)

Este documento describe la configuración, funcionalidades y empaquetado de la aplicación de escritorio Hoergen usando Electron.

## 🎯 Visión General

Hoergen WebApp incluye una versión de escritorio nativa construida con **Electron**, que permite a los usuarios disfrutar de la experiencia de radio en una aplicación independiente del navegador. La aplicación Electron proporciona funcionalidades nativas del sistema operativo y una experiencia de usuario más integrada.

## 🏗️ Arquitectura de Electron

### Estructura de Procesos

```
┌─────────────────────────────────────────────────────────┐
│                    Main Process                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │              BrowserWindow                       │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │            Renderer Process              │   │
│  │  │         (React App)                     │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Archivos Principales

- **`electron/main.cjs`**: Proceso principal de Electron
- **`electron/preload.cjs`**: Script de precarga para comunicación segura
- **`scripts/build-electron.cjs`**: Script de empaquetado
- **`scripts/dev-electron.cjs`**: Script de desarrollo

## ⚙️ Configuración de Electron

### 1. Configuración del Proceso Principal

```javascript
// electron/main.cjs
const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs'),
      partition: 'persist:hoergen',
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    icon: path.join(__dirname, '../resources/icon.png'),
    show: false,
    titleBarStyle: 'default',
    autoHideMenuBar: true,
    frame: true
  });

  // Cargar la aplicación
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    const distPath = getDistPath();
    mainWindow.loadFile(path.join(distPath, 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}
```

### 2. Configuración de Seguridad

```javascript
// Configuraciones de seguridad
webPreferences: {
  nodeIntegration: false,        // No permitir acceso directo a Node.js
  contextIsolation: true,        // Aislar contexto del renderer
  enableRemoteModule: false,     // Deshabilitar módulo remote
  preload: path.join(__dirname, 'preload.cjs'), // Script de precarga
  partition: 'persist:hoergen',  // Partición persistente para datos
  webSecurity: true,             // Habilitar seguridad web
  allowRunningInsecureContent: false // No permitir contenido inseguro
}
```

### 3. Manejo de Enlaces Externos

```javascript
// Manejar enlaces externos de forma segura
mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'file:' && parsedUrl.hostname !== 'localhost') {
      shell.openExternal(url); // Abrir en navegador externo
    }
    return { action: 'deny' };
  } catch (error) {
    console.error('Error handling external link:', error);
    return { action: 'deny' };
  }
});

// Prevenir navegación interna a URLs externas
mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
  const parsedUrl = new URL(navigationUrl);
  if (parsedUrl.origin !== 'file://') {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  }
});
```

## 🎨 Interfaz de Usuario Nativa

### 1. Menú Personalizado

```javascript
function createMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Nueva Ventana',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            createWindow();
          }
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { role: 'selectall', label: 'Seleccionar Todo' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar Recarga' },
        { role: 'toggleDevTools', label: 'Herramientas de Desarrollo' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normal' },
        { role: 'zoomIn', label: 'Aumentar Zoom' },
        { role: 'zoomOut', label: 'Disminuir Zoom' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla Completa' }
      ]
    },
    {
      label: 'Ventana',
      submenu: [
        { role: 'minimize', label: 'Minimizar' },
        { role: 'close', label: 'Cerrar' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de Hoergen',
          click: () => {
            shell.openExternal('https://github.com/eehcx/hoergen.desktop');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
```

### 2. Atajos de Teclado

```javascript
// Atajos globales del sistema
const { globalShortcut } = require('electron');

app.whenReady().then(() => {
  // Registrar atajos globales
  globalShortcut.register('MediaPlayPause', () => {
    // Controlar reproducción de audio
    mainWindow.webContents.send('media-control', 'play-pause');
  });

  globalShortcut.register('MediaNextTrack', () => {
    mainWindow.webContents.send('media-control', 'next');
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow.webContents.send('media-control', 'previous');
  });
});

// Limpiar atajos al cerrar
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
```

## 🔌 Comunicación IPC

### 1. Script de Precarga

```javascript
// electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electron', {
  // Funciones de ventana
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  
  // Funciones de almacenamiento
  storage: {
    get: (key) => ipcRenderer.invoke('storage:get', key),
    set: (key, value) => ipcRenderer.invoke('storage:set', { key, value }),
    remove: (key) => ipcRenderer.invoke('storage:remove', key),
    clear: () => ipcRenderer.invoke('storage:clear')
  },
  
  // Funciones de sistema
  platform: process.platform,
  version: process.versions.electron,
  
  // Funciones de audio
  audio: {
    setVolume: (volume) => ipcRenderer.send('audio:set-volume', volume),
    getVolume: () => ipcRenderer.invoke('audio:get-volume'),
    mute: (muted) => ipcRenderer.send('audio:mute', muted)
  },
  
  // Funciones de notificaciones
  notifications: {
    show: (options) => ipcRenderer.invoke('notifications:show', options),
    requestPermission: () => ipcRenderer.invoke('notifications:request-permission')
  }
});
```

### 2. Manejadores IPC en el Proceso Principal

```javascript
// Almacenamiento persistente
ipcMain.handle('storage:get', async (_event, key) => {
  try {
    const store = await getPersistentStore();
    return store.get(key, null);
  } catch (err) {
    console.error('storage:get error', err);
    return null;
  }
});

ipcMain.handle('storage:set', async (_event, { key, value }) => {
  try {
    const store = await getPersistentStore();
    store.set(key, value);
    return true;
  } catch (err) {
    console.error('storage:set error', err);
    return false;
  }
});

// Control de ventana
ipcMain.on('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window:close', () => {
  if (mainWindow) mainWindow.close();
});

// Control de audio
ipcMain.on('audio:set-volume', (_event, volume) => {
  // Implementar control de volumen del sistema
  console.log('Setting system volume:', volume);
});

ipcMain.handle('audio:get-volume', () => {
  // Obtener volumen del sistema
  return 0.5; // Valor de ejemplo
});

// Notificaciones del sistema
ipcMain.handle('notifications:show', async (_event, options) => {
  const { Notification } = require('electron');
  
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: options.title || 'Hoergen',
      body: options.body,
      icon: path.join(__dirname, '../resources/icon.png'),
      silent: options.silent || false
    });
    
    notification.show();
    return true;
  }
  
  return false;
});
```

## 🚀 Scripts de Desarrollo y Build

### 1. Script de Desarrollo

```javascript
// scripts/dev-electron.cjs
const { spawn } = require('child_process');
const { createServer } = require('vite');
const electron = require('electron');
const path = require('path');

async function startDev() {
  console.log('🚀 Iniciando modo desarrollo...');
  
  // Iniciar servidor Vite
  const vite = await createServer({
    configFile: path.join(__dirname, '../vite.config.ts'),
    mode: 'development'
  });
  
  await vite.listen(5173);
  console.log('✅ Servidor Vite iniciado en puerto 5173');
  
  // Iniciar Electron
  const electronProcess = spawn(electron, [path.join(__dirname, '../electron/main.cjs')], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  electronProcess.on('close', () => {
    console.log('👋 Electron cerrado');
    vite.close();
    process.exit();
  });
  
  // Manejar señales del sistema
  process.on('SIGINT', () => {
    electronProcess.kill();
    vite.close();
    process.exit();
  });
}

startDev().catch(console.error);
```

### 2. Script de Build

```javascript
// scripts/build-electron.cjs
const { build } = require('electron-builder');
const { execSync } = require('child_process');
const path = require('path');

async function buildElectron() {
  console.log('🔨 Construyendo aplicación Electron...');
  
  try {
    // 1. Build de la aplicación web
    console.log('📦 Construyendo aplicación web...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // 2. Build de Electron
    console.log('⚡ Construyendo Electron...');
    await build({
      config: {
        appId: 'com.eehcx.hoergen',
        productName: 'Hoergen',
        directories: {
          buildResources: 'resources',
          output: 'release'
        },
        files: [
          'dist/**/*',
          'electron/**/*',
          'resources/**/*',
          '!node_modules/**/*'
        ],
        npmRebuild: false,
        asar: true,
        asarUnpack: [
          'electron/preload.cjs'
        ],
        linux: {
          target: 'AppImage',
          icon: 'resources/icon.png',
          category: 'AudioVideo',
          desktop: {
            entry: {
              Name: 'Hoergen',
              Comment: 'Radio client for underground electronic music',
              Type: 'Application',
              Categories: 'AudioVideo;Audio;Player;Music;',
              Terminal: false,
              StartupWMClass: 'Hoergen'
            }
          },
          artifactName: 'Hoergen-${version}-${arch}.AppImage'
        },
        win: {
          target: 'nsis',
          icon: 'resources/icon.png',
          artifactName: 'Hoergen-${version}-${arch}.exe'
        },
        mac: {
          target: 'dmg',
          icon: 'resources/icon.png',
          category: 'public.app-category.music'
        }
      }
    });
    
    console.log('✅ Build completado exitosamente!');
    console.log('📁 Archivos generados en: release/');
    
  } catch (error) {
    console.error('❌ Error durante el build:', error);
    process.exit(1);
  }
}

buildElectron();
```

### 3. Script de Build Simple

```javascript
// scripts/build-electron-simple.cjs
const { build } = require('electron-builder');

async function buildSimple() {
  console.log('🔨 Build simple de Electron...');
  
  try {
    await build({
      config: {
        appId: 'com.eehcx.hoergen',
        productName: 'Hoergen',
        directories: {
          buildResources: 'resources',
          output: 'release'
        },
        files: [
          'dist/**/*',
          'electron/**/*'
        ],
        asar: true
      }
    });
    
    console.log('✅ Build simple completado!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

buildSimple();
```

## 📦 Configuración de Empaquetado

### 1. Configuración en package.json

```json
{
  "main": "electron/main.cjs",
  "build": {
    "appId": "com.eehcx.hoergen",
    "productName": "Hoergen",
    "directories": {
      "buildResources": "resources",
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "resources/**/*",
      "node_modules/**/*"
    ],
    "npmRebuild": false,
    "asar": true,
    "asarUnpack": [
      "electron/preload.cjs"
    ],
    "linux": {
      "target": "AppImage",
      "icon": "resources/icon.png",
      "category": "AudioVideo",
      "desktop": {
        "entry": {
          "Name": "Hoergen",
          "Comment": "Radio client for underground electronic music",
          "Type": "Application",
          "Categories": "AudioVideo;Audio;Player;Music;",
          "Terminal": false,
          "StartupWMClass": "Hoergen"
        }
      },
      "artifactName": "Hoergen-${version}-${arch}.AppImage"
    },
    "win": {
      "target": "nsis",
      "icon": "resources/icon.png",
      "artifactName": "Hoergen-${version}-${arch}.exe"
    },
    "mac": {
      "target": "dmg",
      "icon": "resources/icon.png",
      "category": "public.app-category.music"
    }
  }
}
```

### 2. Configuración por Plataforma

#### Linux (AppImage)
```json
"linux": {
  "target": "AppImage",
  "icon": "resources/icon.png",
  "category": "AudioVideo",
  "desktop": {
    "entry": {
      "Name": "Hoergen",
      "Comment": "Radio client for underground electronic music",
      "Type": "Application",
      "Categories": "AudioVideo;Audio;Player;Music;",
      "Terminal": false,
      "StartupWMClass": "Hoergen"
    }
  }
}
```

#### Windows (NSIS)
```json
"win": {
  "target": "nsis",
  "icon": "resources/icon.png",
  "artifactName": "Hoergen-${version}-${arch}.exe",
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  }
}
```

#### macOS (DMG)
```json
"mac": {
  "target": "dmg",
  "icon": "resources/icon.png",
  "category": "public.app-category.music",
  "hardenedRuntime": true,
  "gatekeeperAssess": false,
  "entitlements": "build/entitlements.mac.plist",
  "entitlementsInherit": "build/entitlements.mac.plist"
}
```

## 🔧 Funcionalidades Nativas

### 1. Almacenamiento Persistente

```javascript
// electron-store para datos persistentes
let persistentStore;
async function getPersistentStore() {
  if (!persistentStore) {
    const { default: Store } = await import('electron-store');
    persistentStore = new Store({ 
      name: 'hoergen-storage',
      encryptionKey: 'your-encryption-key' // Opcional
    });
  }
  return persistentStore;
}

// APIs para el renderer
ipcMain.handle('storage:get', async (_event, key) => {
  const store = await getPersistentStore();
  return store.get(key, null);
});

ipcMain.handle('storage:set', async (_event, { key, value }) => {
  const store = await getPersistentStore();
  store.set(key, value);
  return true;
});
```

### 2. Notificaciones del Sistema

```javascript
// Notificaciones nativas
ipcMain.handle('notifications:show', async (_event, options) => {
  const { Notification } = require('electron');
  
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: options.title || 'Hoergen',
      body: options.body,
      icon: path.join(__dirname, '../resources/icon.png'),
      silent: options.silent || false,
      actions: [
        {
          type: 'button',
          text: 'Reproducir'
        },
        {
          type: 'button',
          text: 'Pausar'
        }
      ]
    });
    
    notification.on('action', (event, index) => {
      // Manejar acciones de la notificación
      mainWindow.webContents.send('notification-action', { index, action: index === 0 ? 'play' : 'pause' });
    });
    
    notification.show();
    return true;
  }
  
  return false;
});
```

### 3. Control de Audio del Sistema

```javascript
// Control de volumen del sistema (Linux/macOS)
const os = require('os');

if (os.platform() === 'linux') {
  ipcMain.handle('audio:set-volume', async (_event, volume) => {
    try {
      const { exec } = require('child_process');
      exec(`amixer set Master ${volume * 100}%`, (error) => {
        if (error) console.error('Error setting volume:', error);
      });
      return true;
    } catch (error) {
      console.error('Error setting system volume:', error);
      return false;
    }
  });
}

if (os.platform() === 'darwin') {
  ipcMain.handle('audio:set-volume', async (_event, volume) => {
    try {
      const { exec } = require('child_process');
      exec(`osascript -e 'set volume output volume ${volume * 100}'`, (error) => {
        if (error) console.error('Error setting volume:', error);
      });
      return true;
    } catch (error) {
      console.error('Error setting system volume:', error);
      return false;
    }
  });
}
```

## 🚀 Optimizaciones de Rendimiento

### 1. Lazy Loading de Módulos

```javascript
// Cargar módulos solo cuando sea necesario
let persistentStore;
async function getPersistentStore() {
  if (!persistentStore) {
    const { default: Store } = await import('electron-store');
    persistentStore = new Store({ name: 'hoergen-storage' });
  }
  return persistentStore;
}
```

### 2. Gestión de Memoria

```javascript
// Limpiar recursos cuando no se usen
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Limpiar cache periódicamente
setInterval(() => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.session.clearCache();
  }
}, 30 * 60 * 1000); // Cada 30 minutos
```

### 3. Optimización de Build

```javascript
// Configuración de Vite para Electron
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          electron: ['electron']
        }
      }
    },
    target: 'esnext',
    minify: 'terser'
  }
});
```

## 🐛 Debugging y Desarrollo

### 1. DevTools en Desarrollo

```javascript
if (isDev) {
  mainWindow.loadURL('http://localhost:5173');
  mainWindow.webContents.openDevTools();
  
  // Habilitar hot reload
  mainWindow.webContents.on('did-fail-load', () => {
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:5173');
    }, 1000);
  });
}
```

### 2. Logging y Monitoreo

```javascript
// Logging detallado en desarrollo
if (isDev) {
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Renderer Console [${level}]: ${message} at ${sourceId}:${line}`);
  });
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  // En producción, podrías enviar esto a un servicio de monitoreo
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});
```

### 3. Inspección de Procesos

```javascript
// Información del proceso para debugging
ipcMain.handle('process:info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  };
});
```

## 🔮 Futuras Mejoras

### 1. Funcionalidades Planeadas

- **Tray Icon**: Icono en la bandeja del sistema
- **Global Shortcuts**: Atajos de teclado globales
- **Auto-updater**: Actualizaciones automáticas
- **Crash Reporting**: Reportes de errores automáticos

### 2. Optimizaciones

- **Code Splitting**: División de código por funcionalidades
- **Service Workers**: Funcionalidad offline mejorada
- **WebAssembly**: Componentes críticos de rendimiento

### 3. Integración del Sistema

- **Media Keys**: Control de reproducción desde teclado
- **System Integration**: Mejor integración con el sistema operativo
- **Accessibility**: Mejoras de accesibilidad nativas

---

La aplicación Electron de Hoergen proporciona una experiencia de escritorio nativa completa, manteniendo toda la funcionalidad de la versión web mientras agrega capacidades específicas del sistema operativo.
