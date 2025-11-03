// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // Загружаем env файлы based on mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 3000,
      host: true,
      // Оптимизации для Node.js 22
      fs: {
        strict: false
      }
    },
    build: {
      // Оптимизации сборки для Node.js 22
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'pinia']
          }
        }
      }
    },
    // Правильное определение глобальных переменных для Node.js 22
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    optimizeDeps: {
      include: ['vue', 'pinia']
    }
  }
})
