import { createApp } from 'vue'
import App from './App.vue'

// Простая инициализация без Pinia
const app = createApp(App)
app.mount('#app')

console.log('✅ Vue приложение запущено')
