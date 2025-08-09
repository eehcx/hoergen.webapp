const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // APIs para el reproductor de audio
  audio: {
    // Obtener información del sistema de audio
    getAudioInfo: () => ipcRenderer.invoke('audio:getInfo'),
    
    // Controlar el volumen del sistema
    setSystemVolume: (volume) => ipcRenderer.invoke('audio:setSystemVolume', volume),
    getSystemVolume: () => ipcRenderer.invoke('audio:getSystemVolume'),
    
    // Controlar la reproducción
    play: (url) => ipcRenderer.invoke('audio:play', url),
    pause: () => ipcRenderer.invoke('audio:pause'),
    stop: () => ipcRenderer.invoke('audio:stop'),
    
    // Obtener estado del reproductor
    getPlaybackState: () => ipcRenderer.invoke('audio:getPlaybackState'),
    
    // Eventos del reproductor
    onPlaybackStateChange: (callback) => {
      ipcRenderer.on('audio:playbackStateChange', callback);
      return () => ipcRenderer.removeAllListeners('audio:playbackStateChange');
    }
  },
  
  // APIs para notificaciones del sistema
  notifications: {
    show: (title, body, icon) => ipcRenderer.invoke('notifications:show', { title, body, icon }),
    requestPermission: () => ipcRenderer.invoke('notifications:requestPermission')
  },
  
  // APIs para el sistema de archivos
  fileSystem: {
    // Guardar archivos
    saveFile: (data, filename) => ipcRenderer.invoke('fileSystem:saveFile', { data, filename }),
    
    // Abrir archivos
    openFile: () => ipcRenderer.invoke('fileSystem:openFile'),
    
    // Obtener directorio de descargas
    getDownloadsPath: () => ipcRenderer.invoke('fileSystem:getDownloadsPath')
  },
  
  // APIs para el sistema
  system: {
    // Obtener información del sistema
    getSystemInfo: () => ipcRenderer.invoke('system:getInfo'),
    
    // Controlar la ventana
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    
    // Obtener información de la ventana
    getWindowInfo: () => ipcRenderer.invoke('window:getInfo'),
    
    // Eventos de la ventana
    onWindowStateChange: (callback) => {
      ipcRenderer.on('window:stateChange', callback);
      return () => ipcRenderer.removeAllListeners('window:stateChange');
    }
  },
  
  // APIs para el almacenamiento local
  storage: {
    get: (key) => ipcRenderer.invoke('storage:get', key),
    set: (key, value) => ipcRenderer.invoke('storage:set', { key, value }),
    remove: (key) => ipcRenderer.invoke('storage:remove', key),
    clear: () => ipcRenderer.invoke('storage:clear')
  },
  
  // APIs para el menú
  menu: {
    // Actualizar el menú de la aplicación
    updateMenu: (template) => ipcRenderer.invoke('menu:update', template),
    
    // Obtener el menú actual
    getCurrentMenu: () => ipcRenderer.invoke('menu:getCurrent')
  },
  
  // APIs para el dock (macOS) / taskbar (Windows/Linux)
  dock: {
    // Establecer el badge del dock
    setBadge: (text) => ipcRenderer.invoke('dock:setBadge', text),
    
    // Obtener el badge actual
    getBadge: () => ipcRenderer.invoke('dock:getBadge'),
    
    // Mostrar/ocultar el dock
    show: () => ipcRenderer.invoke('dock:show'),
    hide: () => ipcRenderer.invoke('dock:hide')
  },
  
  // APIs para el power monitor
  power: {
    // Obtener estado de la batería
    getBatteryInfo: () => ipcRenderer.invoke('power:getBatteryInfo'),
    
    // Eventos de energía
    onPowerStateChange: (callback) => {
      ipcRenderer.on('power:stateChange', callback);
      return () => ipcRenderer.removeAllListeners('power:stateChange');
    },
    
    onBatteryLevelChange: (callback) => {
      ipcRenderer.on('power:batteryLevelChange', callback);
      return () => ipcRenderer.removeAllListeners('power:batteryLevelChange');
    }
  },
  
  // APIs para el clipboard
  clipboard: {
    readText: () => ipcRenderer.invoke('clipboard:readText'),
    writeText: (text) => ipcRenderer.invoke('clipboard:writeText', text),
    readImage: () => ipcRenderer.invoke('clipboard:readImage'),
    writeImage: (image) => ipcRenderer.invoke('clipboard:writeImage', image)
  },
  
  // APIs para el shell
  shell: {
    // Abrir URL externa
    openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
    
    // Abrir archivo con aplicación por defecto
    openPath: (path) => ipcRenderer.invoke('shell:openPath', path),
    
    // Mostrar archivo en el explorador
    showItemInFolder: (path) => ipcRenderer.invoke('shell:showItemInFolder', path)
  }
});

// Exponer información del entorno
contextBridge.exposeInMainWorld('electronEnv', {
  isDev: process.env.NODE_ENV === 'development',
  platform: process.platform,
  version: process.versions.electron,
  nodeVersion: process.versions.node,
  chromeVersion: process.versions.chrome
});

// Manejar errores de comunicación
ipcRenderer.on('error', (event, error) => {
  console.error('Error en el renderer process:', error);
});

// Notificar que el preload se ha cargado
console.log('Preload script cargado correctamente'); 