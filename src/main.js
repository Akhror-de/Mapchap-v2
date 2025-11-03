// src/main.js - ОБНОВИТЕ
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import { validateEnvironment } from './utils/env'

// Валидируем окружение перед запуском приложения
try {
  validateEnvironment()
  
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.mount('#app')
  
  console.log('✅ MapChap application started successfully')
} catch (error) {
  console.error('❌ Failed to start application:', error)
  
  // Показываем ошибку пользователю
  document.getElementById('app').innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
      <h1 style="color: #dc3545;">⚠️ Ошибка запуска приложения</h1>
      <p>${error.message}</p>
      <p><small>Пожалуйста, свяжитесь с поддержкой</small></p>
    </div>
  `
}
