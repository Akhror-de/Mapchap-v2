import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Импортируем Яндекс Карты правильно
import * as VueYandexMaps from 'vue-yandex-maps'

const app = createApp(App)
app.use(createPinia())

// Настройки Яндекс Карт
const yandexMapsSettings = {
  apiKey: '07b74146-5f5a-46bf-a2b1-cf6d052a41bb',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}

app.use(VueYandexMaps.default, yandexMapsSettings)
app.mount('#app')
