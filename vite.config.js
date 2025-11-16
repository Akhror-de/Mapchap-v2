import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Простая конфигурация без сложных импортов
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
})
