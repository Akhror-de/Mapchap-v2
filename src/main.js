import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Импортируем стили
import './styles/variables.css'
import './styles/base.css'
import './styles/components.css'
import './styles/map.css' // ✅ Добавляем стили для карты

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
