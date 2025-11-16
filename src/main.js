import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Импортируем правильным способом для Vue 3
import YMapPlugin from 'vue-yandex-maps'

const app = createApp(App)
app.use(createPinia())

// Правильные настройки Яндекс.Карт
const yandexMapsSettings = {
  apiKey: '07b74146-5f5a-46bf-a2b1-cf6d052a41bb',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1',
  enterprise: false
}

app.use(YMapPlugin, yandexMapsSettings)
app.mount('#app')
