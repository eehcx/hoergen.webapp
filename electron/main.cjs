const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Electron Store es ESM-only a partir de v10, así que lo cargamos dinámicamente desde CJS
let persistentStore;
async function getPersistentStore() {
  if (!persistentStore) {
    const { default: Store } = await import('electron-store');
    persistentStore = new Store({ name: 'auth-storage' });
  }
  return persistentStore;
}

let mainWindow;

function getDistPath() {
  // When packaged, __dirname points to resources/app.asar/electron
  // We want to load dist/index.html from resources/app.asar/dist
  const appPath = app.getAppPath();
  const distCandidate = path.join(appPath, 'dist');
  return distCandidate;
}

function createWindow() {
  // Crear la ventana del navegador
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

  // Mostrar la ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Manejar enlaces externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'file:' && parsedUrl.hostname !== 'localhost') {
        shell.openExternal(url);
      }
      return { action: 'deny' };
    } catch (error) {
      console.error('Error handling external link:', error);
      return { action: 'deny' };
    }
  });

  // Manejar navegación interna
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'file://') {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // Crear menú personalizado
  createMenu();
}

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

// Eventos de la aplicación
app.whenReady().then(createWindow);

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

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});

// Handlers IPC para almacenamiento (async para cargar electron-store dinámicamente)
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

ipcMain.handle('storage:remove', async (_event, key) => {
  try {
    const store = await getPersistentStore();
    store.delete(key);
    return true;
  } catch (err) {
    console.error('storage:remove error', err);
    return false;
  }
});

ipcMain.handle('storage:clear', async () => {
  try {
    const store = await getPersistentStore();
    store.clear();
    return true;
  } catch (err) {
    console.error('storage:clear error', err);
    return false;
  }
});