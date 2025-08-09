const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function diagnoseElectron() {
  log('🔍 Diagnóstico de Electron para Hoergen', 'cyan');
  log('=====================================', 'cyan');

  // 1. Verificar archivos de Electron
  log('\n📁 Verificando archivos de Electron...', 'blue');
  const electronFiles = [
    'electron/main.cjs',
    'electron/preload.cjs',
    'resources/icon.png'
  ];

  electronFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`, 'green');
    } else {
      log(`❌ ${file} - NO ENCONTRADO`, 'red');
    }
  });

  // 2. Verificar build de producción
  log('\n📦 Verificando build de producción...', 'blue');
  const distFiles = [
    'dist/index.html',
    'dist/assets'
  ];

  distFiles.forEach(file => {
    if (fs.existsSync(file)) {
      if (fs.statSync(file).isDirectory()) {
        const files = fs.readdirSync(file);
        log(`✅ ${file} (${files.length} archivos)`, 'green');
      } else {
        const stats = fs.statSync(file);
        log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`, 'green');
      }
    } else {
      log(`❌ ${file} - NO ENCONTRADO`, 'red');
    }
  });

  // 3. Verificar AppImage
  log('\n📦 Verificando AppImage...', 'blue');
  const releaseDir = 'release';
  if (fs.existsSync(releaseDir)) {
    const files = fs.readdirSync(releaseDir);
    const appImageFiles = files.filter(file => file.endsWith('.AppImage'));
    
    if (appImageFiles.length > 0) {
      appImageFiles.forEach(file => {
        const stats = fs.statSync(path.join(releaseDir, file));
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        log(`✅ ${file} (${sizeInMB} MB)`, 'green');
      });
    } else {
      log('❌ No se encontraron archivos AppImage', 'red');
    }
  } else {
    log('❌ Directorio release no encontrado', 'red');
  }

  // 4. Verificar configuración de package.json
  log('\n⚙️ Verificando configuración...', 'blue');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Verificar scripts de Electron
    const electronScripts = ['dev:electron', 'build:electron', 'build:electron-simple'];
    electronScripts.forEach(script => {
      if (packageJson.scripts[script]) {
        log(`✅ Script ${script} configurado`, 'green');
      } else {
        log(`❌ Script ${script} NO CONFIGURADO`, 'red');
      }
    });

    // Verificar dependencias de Electron
    const electronDeps = ['electron', 'electron-builder'];
    electronDeps.forEach(dep => {
      if (packageJson.devDependencies[dep]) {
        log(`✅ Dependencia ${dep}: ${packageJson.devDependencies[dep]}`, 'green');
      } else {
        log(`❌ Dependencia ${dep} NO INSTALADA`, 'red');
      }
    });

    // Verificar configuración de build
    if (packageJson.build) {
      log('✅ Configuración de build encontrada', 'green');
      if (packageJson.build.linux) {
        log('✅ Configuración de Linux encontrada', 'green');
      } else {
        log('❌ Configuración de Linux NO ENCONTRADA', 'red');
      }
    } else {
      log('❌ Configuración de build NO ENCONTRADA', 'red');
    }

  } catch (error) {
    log(`❌ Error leyendo package.json: ${error.message}`, 'red');
  }

  // 5. Verificar TypeScript
  log('\n📝 Verificando TypeScript...', 'blue');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    log('✅ TypeScript sin errores', 'green');
  } catch (error) {
    log('❌ Errores de TypeScript encontrados', 'red');
    log('Ejecuta: npm run lint para ver los errores', 'yellow');
  }

  // 6. Recomendaciones
  log('\n💡 Recomendaciones:', 'cyan');
  log('1. Si tienes problemas de "Not Found":', 'yellow');
  log('   - Verifica que el build de producción esté actualizado', 'yellow');
  log('   - Ejecuta: npm run build:electron-simple', 'yellow');
  
  log('\n2. Si tienes problemas de persistencia:', 'yellow');
  log('   - Verifica que localStorage esté habilitado', 'yellow');
  log('   - Abre las herramientas de desarrollo (F12)', 'yellow');
  log('   - Ejecuta: window.electronDebug.diagnoseAuth()', 'yellow');
  
  log('\n3. Para diagnosticar problemas:', 'yellow');
  log('   - Abre la consola de Electron (Ctrl+Shift+I)', 'yellow');
  log('   - Ejecuta: window.electronDebug.diagnoseAuth()', 'yellow');
  log('   - Ejecuta: window.electronDebug.clearAllState() para limpiar', 'yellow');

  log('\n✅ Diagnóstico completado', 'green');
}

// Ejecutar diagnóstico
if (require.main === module) {
  diagnoseElectron();
}

module.exports = { diagnoseElectron }; 