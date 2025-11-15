import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import YMapPlugin from 'vue-yandex-maps'

// Сначала установим глобальные стили ДО создания приложения
const initializeGlobalStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    /* КРИТИЧЕСКИ ВАЖНЫЕ СТИЛИ */
    html, body {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    #app {
      height: 100vh !important;
      width: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      position: relative !important;
    }
    
    /* Принудительные стили для Яндекс.Карт */
    .ymaps-map {
      width: 100% !important;
      height: 100% !important;
      position: absolute !important;
    }
    
    .ymaps-map-container {
      width: 100% !important;
      height: 100% !important;
    }
    
    /* Убедимся, что все контейнеры имеют размер */
    .map-container, .map-area, [data-ymaps] {
      width: 100% !important;
      height: 100% !important;
    }
  `
  document.head.appendChild(style)
  console.log('✅ Глобальные стили установлены')
}

// Инициализируем стили сразу
initializeGlobalStyles()

// Создаем приложение
const app = createApp(App)

// Настройки Яндекс.Карт
const yandexMapsSettings = {
  apiKey: '07b74146-5f5a-46bf-a2b1-cf6d052a41bb',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1',
  enterprise: false
}

// Инициализируем плагин Яндекс.Карт с обработкой ошибок
try {
  app.use(YMapPlugin, yandexMapsSettings)
  console.log('✅ Плагин Яндекс.Карт успешно инициализирован')
} catch (error) {
  console.error('❌ Ошибка инициализации Яндекс.Карт:', error)
}

// Подключаем Pinia
app.use(createPinia())

// Глобальные обработчики ошибок
app.config.errorHandler = (err, instance, info) => {
  console.error('🚨 Vue Error:', err)
  console.error('Component:', instance?.$options?.name)
  console.error('Info:', info)
}

// Принудительно устанавливаем высоту после монтирования
app.mixin({
  mounted() {
    this.$nextTick(() => {
      // Принудительно устанавливаем высоту для корневых элементов
      const appElement = document.getElementById('app')
      if (appElement) {
        appElement.style.height = '100vh'
        appElement.style.display = 'flex'
        appElement.style.flexDirection = 'column'
      }
      
      document.documentElement.style.height = '100%'
      document.body.style.height = '100%'
    })
  }
})

// Монтируем приложение
app.mount('#app')

console.log('🚀 Приложение запущено')

// Дополнительная проверка через секунду
setTimeout(() => {
  const appElement = document.getElementById('app')
  const mapContainer = document.querySelector('.map-container')
  const ymap = document.querySelector('.ymaps-map')
  
  console.log('🔍 Проверка элементов:')
  console.log('- appElement:', appElement?.clientHeight, 'x', appElement?.clientWidth)
  console.log('- mapContainer:', mapContainer?.clientHeight, 'x', mapContainer?.clientWidth)
  console.log('- ymap:', ymap?.clientHeight, 'x', ymap?.clientWidth)
  
  // Принудительно перерисовываем карту если она есть
  if (window.ymaps && ymap) {
    console.log('🔄 Принудительная перерисовка карты')
    window.ymaps.ready(() => {
      const maps = document.querySelectorAll('.ymaps-map')
      maps.forEach(map => {
        // Пытаемся перерисовать карту
        const mapInstance = window.ymaps?.Map?.getMap(map)
        if (mapInstance) {
          mapInstance.container.fitToViewport()
        }
      })
    })
  }
}, 2000)
