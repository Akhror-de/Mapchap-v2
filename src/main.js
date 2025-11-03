// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Импортируем для side effects (валидация)
import './utils/env'

const initApp = () => {
  try {
    console.log('🚀 Запуск MapChap на Node.js', process.version)
    
    const app = createApp(App)
    const pinia = createPinia()

    // Глобальные обработчики ошибок
    app.config.errorHandler = (err, instance, info) => {
      console.error('Vue Error:', err)
      console.log('Instance:', instance)
      console.log('Info:', info)
    }

    app.use(pinia)
    app.mount('#app')
    
    console.log('✅ MapChap успешно запущен')
    
  } catch (error) {
    console.error('❌ Критическая ошибка при запуске:', error)
    showFatalError(error)
  }
}

const showFatalError = (error) => {
  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.innerHTML = `
      <div class="fatal-error">
        <div class="error-content">
          <h1>⚠️ Ошибка запуска приложения</h1>
          <p>${error.message}</p>
          <div class="error-details">
            <p><strong>Node.js:</strong> ${process.version}</p>
            <p><strong>Браузер:</strong> ${navigator.userAgent}</p>
          </div>
          <button onclick="window.location.reload()">Перезагрузить</button>
        </div>
      </div>
    `
  }
}

// Запускаем приложение
initApp()
