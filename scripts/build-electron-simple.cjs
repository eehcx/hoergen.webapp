const { spawn, execSync } = require('child_process');
const { join } = require('path');
const fs = require('fs');

// Configuración
const isProduction = process.env.NODE_ENV === 'production';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Función para imprimir con color
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para ejecutar comandos de forma síncrona
function execCommand(command, options = {}) {
  try {
    log(`🔧 Ejecutando: ${command}`, 'blue');
    const result = execSync(command, {
      stdio: 'inherit',
      ...options
    });
    return result;
  } catch (error) {
    log(`❌ Error ejecutando: ${command}`, 'red');
    log(`Error: ${error.message}`, 'red');
    throw error;
  }
}

// Función para verificar si existe un directorio
function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch {
    return false;
  }
}

// Función para limpiar directorios
function cleanDirectories() {
  log('🧹 Limpiando directorios...', 'yellow');
  
  const dirsToClean = ['dist', 'release'];
  
  dirsToClean.forEach(dir => {
    if (directoryExists(dir)) {
      log(`🗑️  Eliminando directorio: ${dir}`, 'yellow');
      execCommand(`rm -rf ${dir}`);
    }
  });
}

// Función para compilar TypeScript
function compileTypeScript() {
  log('📝 Compilando TypeScript...', 'cyan');
  execCommand('npx tsc -b');
}

// Función para construir la aplicación web
function buildWebApp() {
  log('🌐 Construyendo aplicación web...', 'cyan');
  execCommand('npm run build');
}

// Función para verificar que los archivos de Electron existen
function checkElectronFiles() {
  log('🔍 Verificando archivos de Electron...', 'cyan');
  
  const requiredFiles = [
    'electron/main.cjs',
    'electron/preload.cjs',
    'resources/icon.png'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    log(`❌ Archivos faltantes: ${missingFiles.join(', ')}`, 'red');
    throw new Error('Archivos de Electron faltantes');
  }
  
  log('✅ Todos los archivos de Electron están presentes', 'green');
}

// Función para construir la aplicación Electron
function buildElectronApp() {
  log('⚡ Construyendo aplicación Electron...', 'magenta');
  
  // Configurar variables de entorno para producción
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES: 'true'
  };
  
  // Construir solo para Linux
  execCommand('npx electron-builder --linux', { env });
}

// Función para verificar el resultado
function checkBuildResult() {
  log('🔍 Verificando resultado del build...', 'cyan');
  
  const releaseDir = 'release';
  if (!directoryExists(releaseDir)) {
    throw new Error('Directorio release no encontrado');
  }
  
  const files = fs.readdirSync(releaseDir);
  const appImageFiles = files.filter(file => file.endsWith('.AppImage'));
  
  if (appImageFiles.length === 0) {
    throw new Error('No se encontraron archivos AppImage');
  }
  
  log(`✅ Build completado. Archivos generados:`, 'green');
  appImageFiles.forEach(file => {
    const stats = fs.statSync(join(releaseDir, file));
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    log(`   📦 ${file} (${sizeInMB} MB)`, 'green');
  });
}

// Función principal
async function buildElectron() {
  try {
    log('🚀 Iniciando build de Electron para Linux...', 'cyan');
    
    // Paso 1: Limpiar directorios
    cleanDirectories();
    
    // Paso 2: Compilar TypeScript
    compileTypeScript();
    
    // Paso 3: Construir aplicación web
    buildWebApp();
    
    // Paso 4: Verificar archivos de Electron
    checkElectronFiles();
    
    // Paso 5: Construir aplicación Electron
    buildElectronApp();
    
    // Paso 6: Verificar resultado
    checkBuildResult();
    
    log('🎉 ¡Build completado exitosamente!', 'green');
    log('📦 Los archivos AppImage están en el directorio release/', 'green');
    
  } catch (error) {
    log(`❌ Error durante el build: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Función para mostrar información del sistema
function showSystemInfo() {
  log('💻 Información del sistema:', 'cyan');
  log(`   OS: ${process.platform}`, 'cyan');
  log(`   Node.js: ${process.version}`, 'cyan');
  log(`   NPM: ${execSync('npm --version', { encoding: 'utf8' }).trim()}`, 'cyan');
  log(`   Electron: ${require('../package.json').devDependencies.electron}`, 'cyan');
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  showSystemInfo();
  buildElectron().catch((error) => {
    log(`❌ Error fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { buildElectron }; 