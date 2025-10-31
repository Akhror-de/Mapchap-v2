cat > src/main.js << 'EOF'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Импортируем стили
import './styles/variables.css'
import './styles/base.css'
import './styles/components.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
EOF
