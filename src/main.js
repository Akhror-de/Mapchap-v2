import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Создаем экземпляр приложения
const app = createApp(App)

// Подключаем Pinia для управления состоянием
const pinia = createPinia()
app.use(pinia)

// Монтируем приложение
app.mount('#app')

// Опционально: глобальная обработка ошибок
app.config.errorHandler = (err, instance, info) => {
  console.error('🚨 Глобальная ошибка Vue:', err)
  console.error('📝 Информация:', info)
}

// Вывод в консоль для отладки
console.log('🚀 Приложение MapChap запущено!')
console.log('📍 Версия:', '4.0.6')
console.log('🕒 Время запуска:', new Date().toLocaleString())
