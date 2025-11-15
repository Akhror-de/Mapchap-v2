import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import YMapPlugin from 'vue-yandex-maps'

const app = createApp(App)
app.use(createPinia())

// Настройки Яндекс.Карт с дополнительными параметрами
const yandexMapsSettings = {
  apiKey: '07b74146-5f5a-46bf-a2b1-cf6d052a41bb',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1',
  // Дополнительные настройки для лучшей совместимости
  enterprise: false,
  mode: 'release'
}

// Убедимся, что плагин инициализируется правильно
try {
  app.use(YMapPlugin, yandexMapsSettings)
  console.log('✅ Яндекс.Карты плагин успешно инициализирован')
} catch (error) {
  console.error('❌ Ошибка инициализации Яндекс.Карт:', error)
}

// Глобальные обработчики ошибок
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', instance)
  console.error('Info:', info)
}

// Принудительная установка высоты для корневых элементов
const setGlobalStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    html, body, #app {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
    }
    
    #app {
      display: flex !important;
      flex-direction: column !important;
    }
    
    /* Сброс стилей для Яндекс.Карт */
    .ymaps-map {
      width: 100% !important;
      height: 100% !important;
    }
    
    .ymaps-map-container {
      width: 100% !important;
      height: 100% !important;
    }
  `
  document.head.appendChild(style)
}

// Вызываем после монтирования приложения
app.mount('#app')

// Устанавливаем глобальные стили после монтирования
setTimeout(setGlobalStyles, 100)

console.log('🚀 Приложение запущено успешно')
