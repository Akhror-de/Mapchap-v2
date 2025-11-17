import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Минимальная конфигурация для совместимости
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist'
  }
})
