import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ];

  // Solo agregar obfuscator en producción si está disponible
  if (mode === 'production') {
    try {
      const obfuscatorModule = require('vite-plugin-obfuscator');
      const obfuscatorPlugin = obfuscatorModule.default || obfuscatorModule;
      if (typeof obfuscatorPlugin === 'function') {
        plugins.push(obfuscatorPlugin());
      }
    } catch (error) {
      console.warn('vite-plugin-obfuscator no encontrado, omitiendo...');
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
  };
})
