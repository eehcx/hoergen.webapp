const { spawn } = require('child_process');
const { join } = require('path');

// Configuración
const isDev = process.env.NODE_ENV === 'development';
const vitePort = 5173;

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

// Función para manejar la salida de los procesos
function handleOutput(process, name, color) {
  process.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      log(`[${name}] ${output}`, color);
    }
  });

  process.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      log(`[${name}] ERROR: ${output}`, 'red');
    }
  });

  process.on('error', (error) => {
    log(`[${name}] Error al iniciar: ${error.message}`, 'red');
  });

  process.on('close', (code) => {
    log(`[${name}] Proceso terminado con código: ${code}`, code === 0 ? 'green' : 'red');
  });
}

// Función para esperar a que Vite esté listo
function waitForVite() {
  return new Promise((resolve) => {
    const checkVite = () => {
      const http = require('http');
      const req = http.request({
        hostname: 'localhost',
        port: vitePort,
        path: '/',
        method: 'GET'
      }, (res) => {
        if (res.statusCode === 200) {
          log('✅ Vite está listo en http://localhost:5173', 'green');
          resolve();
        } else {
          setTimeout(checkVite, 1000);
        }
      });

      req.on('error', () => {
        setTimeout(checkVite, 1000);
      });

      req.setTimeout(1000, () => {
        req.destroy();
        setTimeout(checkVite, 1000);
      });

      req.end();
    };

    checkVite();
  });
}

// Función principal
async function startDev() {
  log('🚀 Iniciando desarrollo de Electron...', 'cyan');

  // Iniciar Vite
  log('📦 Iniciando Vite...', 'blue');
  const viteProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  handleOutput(viteProcess, 'VITE', 'blue');

  // Esperar a que Vite esté listo
  await waitForVite();

  // Iniciar Electron
  log('⚡ Iniciando Electron...', 'magenta');
  const electronProcess = spawn('npx', ['electron', 'electron/main.cjs'], {
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  handleOutput(electronProcess, 'ELECTRON', 'magenta');

  // Manejar la terminación de procesos
  process.on('SIGINT', () => {
    log('\n🛑 Deteniendo procesos...', 'yellow');
    viteProcess.kill('SIGINT');
    electronProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    log('\n🛑 Deteniendo procesos...', 'yellow');
    viteProcess.kill('SIGTERM');
    electronProcess.kill('SIGTERM');
    process.exit(0);
  });

  // Manejar errores no capturados
  process.on('uncaughtException', (error) => {
    log(`❌ Error no capturado: ${error.message}`, 'red');
    viteProcess.kill();
    electronProcess.kill();
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    log(`❌ Promesa rechazada no manejada: ${reason}`, 'red');
    viteProcess.kill();
    electronProcess.kill();
    process.exit(1);
  });
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  startDev().catch((error) => {
    log(`❌ Error al iniciar desarrollo: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { startDev }; 