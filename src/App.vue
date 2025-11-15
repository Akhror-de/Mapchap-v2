<template>
  <div class="app-layout">
    <!-- Верхняя панель -->
    <header class="header-panel">
      <!-- Левая кнопка - Бизнес -->
      <button class="business-btn" @click="showBusinessPanel = true">
        <span>🏢 Бизнес</span>
      </button>

      <!-- Правая кнопка - Профиль -->
      <button class="profile-btn" @click="showProfilePanel = true">
        <span>👤 Профиль</span>
      </button>
    </header>

    <!-- Основная карта -->
    <main class="map-area">
      <MapContainer 
        :offers="offers"
        @offer-selected="selectOffer"
        @map-click="handleMapClick"
      />
    </main>

    <!-- Bottom Sheet с предложениями -->
    <div class="bottom-sheet" :class="{ 'sheet-expanded': sheetExpanded }">
      <div class="sheet-handle" @click="sheetExpanded = !sheetExpanded">
        <div class="handle-bar"></div>
      </div>
      
      <div class="sheet-content">
        <div class="offers-header">
          <h3>📍 Предложения рядом</h3>
          <span class="offers-count">{{ filteredOffers.length }} предложений</span>
        </div>
        
        <div class="offers-list">
          <div 
            v-for="offer in filteredOffers" 
            :key="offer.id"
            class="offer-card"
            :class="{ active: selectedOffer?.id === offer.id }"
            @click="selectOffer(offer)"
          >
            <div class="offer-category">
              {{ getCategoryIcon(offer.category) }}
            </div>
            <div class="offer-content">
              <h4 class="offer-title">{{ offer.title }}</h4>
              <p class="offer-description">{{ offer.description }}</p>
              <div class="offer-meta">
                <span class="offer-distance">{{ calculateDistance(offer.coords) }} км</span>
                <span class="offer-likes">❤️ {{ offer.likes }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Бизнес панель -->
    <div v-if="showBusinessPanel" class="modal-overlay" @click="showBusinessPanel = false">
      <div class="modal-panel business-panel" @click.stop>
        <div class="panel-header">
          <h3>📊 Бизнес-панель</h3>
          <button class="close-btn" @click="showBusinessPanel = false">×</button>
        </div>
        <div class="panel-content">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ stats.totalOffers }}</div>
              <div class="stat-label">Всего предложений</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.activeUsers }}</div>
              <div class="stat-label">Активных пользователей</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.views }}</div>
              <div class="stat-label">Просмотров</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Профиль панель -->
    <div v-if="showProfilePanel" class="modal-overlay" @click="showProfilePanel = false">
      <div class="modal-panel profile-panel" @click.stop>
        <div class="panel-header">
          <h3>👤 Профиль</h3>
          <button class="close-btn" @click="showProfilePanel = false">×</button>
        </div>
        <div class="panel-content">
          <div class="user-info">
            <div class="user-avatar">👤</div>
            <div class="user-details">
              <h4>Тестовый пользователь</h4>
              <p>Участник с ноября 2024</p>
            </div>
          </div>
          <div class="profile-stats">
            <div class="profile-stat">
              <span class="stat-value">5</span>
              <span class="stat-label">Мои предложения</span>
            </div>
            <div class="profile-stat">
              <span class="stat-value">12</span>
              <span class="stat-label">Лайков</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapContainer from '@/components/map/MapContainer.vue'
import { useOffersStore } from '@/stores/offers'
import { useUserStore } from '@/stores/user'

export default {
  name: 'App',
  components: {
    MapContainer
  },
  data() {
    return {
      sheetExpanded: true,
      showBusinessPanel: false,
      showProfilePanel: false,
      selectedOffer: null,
      currentCoords: [55.751244, 37.618423],
      stats: {
        totalOffers: 0,
        activeUsers: 142,
        views: 1250
      }
    }
  },
  setup() {
    const offersStore = useOffersStore()
    const userStore = useUserStore()
    return { offersStore, userStore }
  },
  computed: {
    offers() {
      return this.offersStore.offers
    },
    filteredOffers() {
      // Можно добавить фильтрацию по расстоянию
      return this.offers.slice(0, 10) // Показываем первые 10
    }
  },
  methods: {
    selectOffer(offer) {
      this.selectedOffer = offer
      // Можно добавить центрирование карты на выбранном предложении
    },
    
    handleMapClick(coords) {
      console.log('Map clicked at:', coords)
      // Здесь можно добавить создание нового предложения
    },
    
    getCategoryIcon(category) {
      const icons = {
        food: '🍕',
        entertainment: '🎭',
        shopping: '🛍️',
        services: '🔧',
        other: '❓'
      }
      return icons[category] || '📍'
    },
    
    calculateDistance(offerCoords) {
      // Простой расчет расстояния (можно заменить на более точный)
      const [lat1, lon1] = this.currentCoords
      const [lat2, lon2] = offerCoords
      const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 100
      return distance.toFixed(1)
    },

    async loadStats() {
      try {
        // Пока используем мок статистику
        this.stats = {
          totalOffers: this.offers.length,
          activeUsers: 142,
          views: 1250,
          newOffersToday: 3
        }
      } catch (error) {
        console.warn('Ошибка загрузки статистики:', error)
        // Fallback статистика
        this.stats = {
          totalOffers: this.offers.length,
          activeUsers: 0,
          views: 0,
          newOffersToday: 0
        }
      }
    }
  },
  async mounted() {
    // Загружаем предложения
    await this.offersStore.fetchOffers()
    
    // Загружаем статистику
    await this.loadStats()
    
    // Получаем текущую геолокацию
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentCoords = [
            position.coords.latitude,
            position.coords.longitude
          ]
        },
        (error) => {
          console.warn('Геолокация недоступна:', error)
          // Используем Москву как fallback
          this.currentCoords = [55.751244, 37.618423]
        }
      )
    }
  }
}
</script>

<style scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #f5f5f5;
}

/* Верхняя панель */
.header-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
  background: transparent;
  pointer-events: none;
}

.header-panel button {
  pointer-events: auto;
  background: white;
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.header-panel button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.business-btn {
  color: #007bff;
}

.profile-btn {
  color: #28a745;
}

/* Основная область карты */
.map-area {
  flex: 1;
  position: relative;
}

/* Bottom Sheet */
.bottom-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -2px 20px rgba(0,0,0,0.15);
  z-index: 900;
  transition: transform 0.3s ease;
  max-height: 40vh;
}

.bottom-sheet:not(.sheet-expanded) {
  transform: translateY(calc(100% - 80px));
}

.sheet-handle {
  padding: 12px 0;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.handle-bar {
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
}

.sheet-content {
  padding: 0 16px 20px;
  max-height: calc(40vh - 60px);
  overflow-y: auto;
}

.offers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}

.offers-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.offers-count {
  color: #666;
  font-size: 14px;
}

.offers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.offer-card {
  display: flex;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.offer-card:hover,
.offer-card.active {
  background: white;
  border-color: #007bff;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.offer-category {
  font-size: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.offer-content {
  flex: 1;
}

.offer-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.offer-description {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.offer-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

/* Модальные панели */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 2000;
  padding-top: 80px;
}

.modal-panel {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.panel-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-content {
  padding: 20px;
}

/* Бизнес панель */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

/* Профиль панель */
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.user-details h4 {
  margin: 0 0 4px 0;
  color: #333;
}

.user-details p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  border-top: 1px solid #eee;
}

.profile-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}
</style>
