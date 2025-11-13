import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

console.log('🚀 MapChap Frontend started successfully!')
console.log('📍 Version: 4.0.5')
console.log('⚡ Node.js: 22')
