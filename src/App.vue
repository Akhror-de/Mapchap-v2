<template>
  <div id="app">
    <!-- Верхняя панель с кнопками -->
    <header class="app-header">
      <!-- Кнопка бизнеса слева -->
      <button @click="showBusinessPanel" class="header-btn business-btn">
        <span class="btn-icon">🏢</span>
        <span class="btn-text">Бизнес</span>
      </button>

      <!-- Логотип по центру -->
      <div class="app-logo">
        <h1>🗺️ MapChap</h1>
      </div>

      <!-- Кнопка профиля справа -->
      <button @click="showProfile" class="header-btn profile-btn">
        <span class="btn-icon">👤</span>
        <span class="btn-text">Профиль</span>
      </button>
    </header>

    <!-- Основной контент - карта -->
    <main class="app-main">
      <MapContainer />
    </main>

    <!-- Нижний лист с предложениями -->
    <BottomSheet />

    <!-- Бизнес-панель -->
    <BusinessPanel 
      v-if="activePanel === 'business'" 
      @close="activePanel = null" 
    />

    <!-- Панель профиля -->
    <ProfilePanel 
      v-if="activePanel === 'profile'" 
      @close="activePanel = null" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOffersStore } from './stores/offers.store'
import { useUserStore } from './stores/user.store'
import MapContainer from './components/map/MapContainer.vue'
import BottomSheet from './components/common/BottomSheet.vue'
import BusinessPanel from './components/business/BusinessPanel.vue'
import ProfilePanel from './components/profile/ProfilePanel.vue'

const offersStore = useOffersStore()
const userStore = useUserStore()
const activePanel = ref(null)

// Загрузка данных при старте приложения
onMounted(async () => {
  await offersStore.fetchOffers()
  userStore.loadFavorites()
})

const showBusinessPanel = () => {
  activePanel.value = 'business'
}

const showProfile = () => {
  activePanel.value = 'profile'
}
</script>

<style>
/* Базовые стили */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --card-bg: #ffffff;
  --surface-bg: #ffffff;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --border-color: #dee2e6;
  --accent-blue: #007bff;
  --accent-blue-light: #e3f2fd;
  --accent-green: #28a745;
  --error-color: #dc3545;
  --shadow: 0 2px 10px rgba(0,0,0,0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Шапка приложения */
.app-header {
  background: var(--card-bg);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  position: relative;
  z-index: 100;
  height: 60px;
}

.app-logo h1 {
  font-size: 20px;
  font-weight: 600;
  color: var(--accent-blue);
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.header-btn:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
}

.header-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  display: none;
}

/* Основной контент */
.app-main {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* Адаптивность */
@media (min-width: 768px) {
  .btn-text {
    display: inline;
  }
  
  .app-header {
    padding: 12px 20px;
  }
  
  .header-btn {
    padding: 10px 16px;
  }
}

/* Темная тема */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #121212;
    --bg-secondary: #1e1e1e;
    --card-bg: #2d2d2d;
    --surface-bg: #1e1e1e;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --border-color: #404040;
    --accent-blue: #4dabf7;
    --accent-blue-light: #1a3d5c;
    --accent-green: #51cf66;
  }
}
</style>
