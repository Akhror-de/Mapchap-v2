<template>
  <div id="app">
    <!-- Шапка приложения -->
    <header class="app-header">
      <h1>🗺️ MapChap</h1>
      <div class="header-actions">
        <button @click="showBusinessPanel" class="btn-primary">
          Бизнес-панель
        </button>
        <button @click="showProfile" class="btn-secondary">
          Профиль
        </button>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="app-main">
      <!-- Карта -->
      <div class="map-section">
        <MapContainer />
      </div>

      <!-- Список объявлений -->
      <div class="offers-section">
        <div class="section-header">
          <h3>Предложения рядом</h3>
          <select v-model="offersStore.currentDistrict" @change="handleDistrictChange">
            <option value="all">Все районы</option>
            <option value="center">Центр</option>
            <option value="north">Север</option>
            <option value="south">Юг</option>
          </select>
        </div>

        <div v-if="offersStore.isLoading" class="loading">
          Загрузка предложений...
        </div>

        <div v-else-if="offersStore.error" class="error">
          {{ offersStore.error }}
          <button @click="loadOffers" class="btn-retry">Повторить</button>
        </div>

        <div v-else class="offers-list">
          <div 
            v-for="offer in offersStore.filteredOffers" 
            :key="offer.id" 
            class="offer-card"
            @click="selectOffer(offer)"
          >
            <div class="offer-header">
              <h4>{{ offer.name }}</h4>
              <span class="discount-badge">-{{ offer.discount }}%</span>
            </div>
            <p class="offer-category">{{ getCategoryName(offer.category) }}</p>
            <p class="offer-address">{{ offer.address }}</p>
            <p class="offer-description">{{ offer.description }}</p>
            <div class="offer-footer">
              <span class="offer-views">👁️ {{ offer.views || 0 }}</span>
              <span class="offer-likes">❤️ {{ offer.likes || 0 }}</span>
              <button 
                @click.stop="toggleFavorite(offer.id)"
                class="favorite-btn"
                :class="{ active: userStore.isFavorite(offer.id) }"
              >
                {{ userStore.isFavorite(offer.id) ? '★' : '☆' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Бизнес-панель (модальное окно) -->
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
import BusinessPanel from './components/business/BusinessPanel.vue'
import ProfilePanel from './components/profile/ProfilePanel.vue'

const offersStore = useOffersStore()
const userStore = useUserStore()
const activePanel = ref(null)

// Загрузка данных при старте приложения
onMounted(async () => {
  await loadOffers()
  userStore.loadFavorites()
})

const loadOffers = async () => {
  await offersStore.fetchOffers()
}

const handleDistrictChange = () => {
  console.log('Выбран район:', offersStore.currentDistrict)
}

const showBusinessPanel = () => {
  activePanel.value = 'business'
}

const showProfile = () => {
  activePanel.value = 'profile'
}

const selectOffer = (offer) => {
  console.log('Выбрано предложение:', offer)
}

const toggleFavorite = async (offerId) => {
  try {
    await userStore.toggleFavorite(offerId)
  } catch (error) {
    console.error('Ошибка при изменении избранного:', error)
  }
}

const getCategoryName = (category) => {
  const categories = {
    cafe: 'Кафе',
    shop: 'Магазин',
    restaurant: 'Ресторан',
    services: 'Услуги',
    entertainment: 'Развлечения',
    beauty: 'Красота'
  }
  return categories[category] || category
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
  --accent-blue-dark: #0056b3;
  --accent-green: #28a745;
  --error-color: #dc3545;
}

/* Темная тема (можно добавить переключатель позже) */
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Стили компонента */
.app-header {
  background: var(--card-bg);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-main {
  display: grid;
  grid-template-columns: 1fr 400px;
  height: calc(100vh - 80px);
}

.map-section {
  position: relative;
}

.offers-section {
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text-primary);
}

.offers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.offer-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.offer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.discount-badge {
  background: var(--accent-green);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
}

.offer-category {
  color: var(--accent-blue);
  font-size: 14px;
  margin-bottom: 4px;
}

.offer-address {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 8px;
}

.offer-description {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 12px;
}

.offer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary);
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

.favorite-btn.active {
  color: gold;
}

.loading, .error {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.btn-retry {
  background: var(--accent-blue);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  margin-top: 8px;
  cursor: pointer;
}

.btn-primary, .btn-secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: var(--accent-blue);
  color: white;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
</style>
