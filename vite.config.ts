import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  const plugins = [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ]

  if (isProd) {
    try {
      const obfuscatorModule = require('vite-plugin-obfuscator')
      const obfuscatorPlugin = obfuscatorModule.default || obfuscatorModule
      if (typeof obfuscatorPlugin === 'function') {
        plugins.push(obfuscatorPlugin())
      }
    } catch {
      console.warn('vite-plugin-obfuscator no encontrado, omitiendo...')
    }
  }

  return {
    base: "./",
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
    esbuild: isProd
      ? {
          drop: ['console', 'debugger'],
        }
      : undefined,
    // Ensure proper handling of Electron environment
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  }
})
