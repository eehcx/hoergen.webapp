const { execSync } = require('child_process');
const fs = require('fs');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function buildSimple() {
  try {
    log('🚀 Build simple de Electron para Linux...', 'cyan');
    
    // Verificar que dist existe
    if (!fs.existsSync('dist')) {
      log('📦 Construyendo aplicación web...', 'blue');
      execSync('npm run build', { stdio: 'inherit' });
    }
    
    // Verificar archivos de Electron
    const requiredFiles = ['electron/main.cjs', 'electron/preload.cjs'];
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
      log(`❌ Archivos faltantes: ${missingFiles.join(', ')}`, 'red');
      return;
    }
    
    // Build de Electron
    log('⚡ Construyendo AppImage...', 'magenta');
    execSync('npx electron-builder --linux', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    log('✅ Build simple completado!', 'green');
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  buildSimple();
}

module.exports = { buildSimple }; 