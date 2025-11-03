// src/main.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

console.log('🚀 Starting MapChap application...')

// Простая инициализация
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

console.log('✅ App mounted successfully')
