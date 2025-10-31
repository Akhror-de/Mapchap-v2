cat > src/App.vue << 'EOF'
<template>
  <div id="app" :data-theme="theme">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">🗺️ MapChap</h1>
        <button class="btn btn-secondary" @click="toggleTheme">
          {{ theme === 'light' ? '🌙' : '☀️' }}
        </button>
      </div>
    </header>

    <main class="app-main">
      <div class="welcome-section">
        <h2>Добро пожаловать в MapChap!</h2>
        <p>Карта выгодных предложений успешно запущена 🎉</p>
        
        <div class="status-cards">
          <div class="card">
            <h3>✅ Статус</h3>
            <p>Приложение работает корректно</p>
          </div>
          <div class="card">
            <h3>🎯 Следующие шаги</h3>
            <ul>
              <li>Настроить Яндекс.Карты</li>
              <li>Добавить компоненты карты</li>
              <li>Реализовать бизнес-логику</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const theme = ref('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<style scoped>
.app-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.welcome-section {
  text-align: center;
}

.welcome-section h2 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.welcome-section p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.card ul {
  text-align: left;
  margin-top: 0.5rem;
}

.card li {
  margin-bottom: 0.5rem;
}
</style>
EOF
