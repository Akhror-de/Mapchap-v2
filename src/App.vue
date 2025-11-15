<template>
  <div class="app-layout">
    <header class="header-panel">
      <button class="business-btn" @click="showBusinessPanel = true">
        <span>🏢 Бизнес</span>
      </button>
      <button class="profile-btn" @click="showProfilePanel = true">
        <span>👤 Профиль</span>
      </button>
    </header>

    <main class="map-area">
      <MapContainer 
        :offers="offers"
        @offer-selected="selectOffer"
        @map-click="handleMapClick"
      />
    </main>

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
            <div class="offer-category">{{ getCategoryIcon(offer.category) }}</div>
            <div class="offer-content">
              <h4 class="offer-title">{{ offer.title }}</h4>
              <p class="offer-description">{{ offer.description }}</p>
              <div class="offer-meta">
                <span class="offer-distance">{{ calculateDistance(offer.coords) }} км</span>
                <!-- ИЗМЕНЕНИЕ: заменяем span на кнопку лайка -->
                <button class="like-btn" @click.stop="handleLike(offer.id)" 
                        :class="{ liked: offer.likes > 0 }">
                  ❤️ {{ offer.likes }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
            <!-- ИЗМЕНЕНИЕ: добавляем статистику лайков -->
            <div class="stat-item">
              <div class="stat-number">{{ stats.totalLikes }}</div>
              <div class="stat-label">Всего лайков</div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  components: { MapContainer },
  data() {
    return {
      sheetExpanded: true,
      showBusinessPanel: false,
      showProfilePanel: false,
      selectedOffer: null,
      currentCoords: [55.751244, 37.618423],
      // ИЗМЕНЕНИЕ: добавляем totalLikes в stats
      stats: { totalOffers: 0, activeUsers: 142, totalLikes: 0, totalViews: 0 }
    }
  },
  setup() {
    const offersStore = useOffersStore()
    const userStore = useUserStore()
    return { offersStore, userStore }
  },
  computed: {
    offers() { return this.offersStore.offers },
    filteredOffers() { return this.offers.slice(0, 10) }
  },
  methods: {
    selectOffer(offer) { this.selectedOffer = offer },
    handleMapClick(coords) { console.log('Map clicked at:', coords) },
    getCategoryIcon(category) {
      const icons = { food: '🍕', entertainment: '🎭', shopping: '🛍️', services: '🔧', other: '❓' }
      return icons[category] || '📍'
    },
    calculateDistance(offerCoords) {
      const [lat1, lon1] = this.currentCoords
      const [lat2, lon2] = offerCoords
      const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 100
      return distance.toFixed(1)
    },
    
    // ИЗМЕНЕНИЕ: добавляем метод для лайков
    async handleLike(offerId) {
      try {
        await this.offersStore.likeOffer(offerId)
        // Обновляем статистику после лайка
        this.stats.totalLikes += 1
      } catch (error) {
        console.error('Ошибка при лайке:', error)
      }
    }
  },
  async mounted() {
    await this.offersStore.fetchOffers()
    this.stats.totalOffers = this.offers.length
    
    // ИЗМЕНЕНИЕ: загружаем статистику из API
    const stats = await this.offersStore.fetchStats()
    this.stats = { ...this.stats, ...stats }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentCoords = [position.coords.latitude, position.coords.longitude]
        },
        (error) => { console.warn('Геолокация недоступна:', error) }
      )
    }
  }
}
</script>

<style scoped>
.app-layout { height: 100vh; display: flex; flex-direction: column; position: relative; background: #f5f5f5; }
.header-panel { position: absolute; top: 0; left: 0; right: 0; height: 60px; display: flex; justify-content: space-between; align-items: center; padding: 0 16px; z-index: 1000; background: transparent; pointer-events: none; }
.header-panel button { pointer-events: auto; background: white; border: none; padding: 10px 16px; border-radius: 20px; font-weight: 500; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.2s; }
.header-panel button:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(0,0,0,0.15); }
.business-btn { color: #007bff; }
.profile-btn { color: #28a745; }
.map-area { flex: 1; position: relative; }
.bottom-sheet { position: absolute; bottom: 0; left: 0; right: 0; background: white; border-top-left-radius: 20px; border-top-right-radius: 20px; box-shadow: 0 -2px 20px rgba(0,0,0,0.15); z-index: 900; transition: transform 0.3s ease; max-height: 40vh; }
.bottom-sheet:not(.sheet-expanded) { transform: translateY(calc(100% - 80px)); }
.sheet-handle { padding: 12px 0; display: flex; justify-content: center; cursor: pointer; }
.handle-bar { width: 40px; height: 4px; background: #ddd; border-radius: 2px; }
.sheet-content { padding: 0 16px 20px; max-height: calc(40vh - 60px); overflow-y: auto; }
.offers-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 0 8px; }
.offers-header h3 { margin: 0; color: #333; font-size: 18px; }
.offers-count { color: #666; font-size: 14px; }
.offers-list { display: flex; flex-direction: column; gap: 12px; }
.offer-card { display: flex; padding: 12px; background: #f8f9fa; border-radius: 12px; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
.offer-card:hover, .offer-card.active { background: white; border-color: #007bff; transform: translateY(-1px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.offer-category { font-size: 24px; margin-right: 12px; display: flex; align-items: center; }
.offer-content { flex: 1; }
.offer-title { margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #333; }
.offer-description { margin: 0 0 8px 0; font-size: 14px; color: #666; line-height: 1.4; }
.offer-meta { display: flex; justify-content: space-between; font-size: 12px; color: #888; }

/* ИЗМЕНЕНИЕ: добавляем стили для кнопки лайка */
.like-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.like-btn:hover {
  background: #fff0f0;
  border-color: #ff6b6b;
}

.like-btn.liked {
  background: #fff0f0;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: flex-start; z-index: 2000; padding-top: 80px; }
.modal-panel { background: white; border-radius: 20px; width: 90%; max-width: 400px; max-height: 70vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #eee; }
.panel-header h3 { margin: 0; color: #333; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
.panel-content { padding: 20px; }

/* ИЗМЕНЕНИЕ: обновляем сетку для 3 элементов */
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.stat-item { text-align: center; padding: 16px; background: #f8f9fa; border-radius: 12px; }
.stat-number { font-size: 24px; font-weight: 700; color: #007bff; margin-bottom: 4px; }
.stat-label { font-size: 12px; color: #666; }
.user-info { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.user-avatar { width: 60px; height: 60px; background: #007bff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; }
.user-details h4 { margin: 0 0 4px 0; color: #333; }
.user-details p { margin: 0; color: #666; font-size: 14px; }
</style>
