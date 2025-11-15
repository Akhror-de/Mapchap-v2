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
        :selectedCoords="selectedCoords"
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

    <!-- Бизнес-панель с формой создания предложения -->
    <div v-if="showBusinessPanel" class="modal-overlay" @click="showBusinessPanel = false">
      <div class="modal-panel business-panel" @click.stop>
        <div class="panel-header">
          <h3>🏢 Бизнес-панель</h3>
          <button class="close-btn" @click="showBusinessPanel = false">×</button>
        </div>
        
        <div class="business-tabs">
          <button class="tab-btn" :class="{ active: businessTab === 'stats' }" 
                  @click="businessTab = 'stats'">
            📊 Статистика
          </button>
          <button class="tab-btn" :class="{ active: businessTab === 'create' }" 
                  @click="businessTab = 'create'">
            🎯 Создать предложение
          </button>
        </div>

        <div class="panel-content">
          <!-- Вкладка статистики -->
          <div v-if="businessTab === 'stats'" class="tab-content">
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
                <div class="stat-number">{{ stats.totalLikes }}</div>
                <div class="stat-label">Всего лайков</div>
              </div>
            </div>
          </div>

          <!-- Вкладка создания предложения -->
          <div v-if="businessTab === 'create'" class="tab-content">
            <form @submit.prevent="handleOfferSubmit" class="offer-form">
              <div class="form-group">
                <label>Название предложения *</label>
                <input v-model="newOffer.title" type="text" required 
                       placeholder="Что предлагаете?" maxlength="50">
              </div>
              
              <div class="form-group">
                <label>Описание</label>
                <textarea v-model="newOffer.description" rows="3" 
                          placeholder="Подробное описание вашего предложения..." 
                          maxlength="200"></textarea>
              </div>
              
              <div class="form-group">
                <label>Категория</label>
                <div class="category-buttons">
                  <button type="button" 
                          :class="{ active: newOffer.category === 'food' }"
                          @click="newOffer.category = 'food'">
                    🍕 Еда
                  </button>
                  <button type="button"
                          :class="{ active: newOffer.category === 'entertainment' }"
                          @click="newOffer.category = 'entertainment'">
                    🎭 Развлечения
                  </button>
                  <button type="button"
                          :class="{ active: newOffer.category === 'shopping' }"
                          @click="newOffer.category = 'shopping'">
                    🛍️ Покупки
                  </button>
                  <button type="button"
                          :class="{ active: newOffer.category === 'services' }"
                          @click="newOffer.category = 'services'">
                    🔧 Услуги
                  </button>
                  <button type="button"
                          :class="{ active: newOffer.category === 'other' }"
                          @click="newOffer.category = 'other'">
                    ❓ Другое
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <label>Местоположение</label>
                <div class="coords-display">
                  Широта: {{ newOffer.coords[0].toFixed(6) }}<br>
                  Долгота: {{ newOffer.coords[1].toFixed(6) }}
                </div>
                <p class="coords-hint">📍 Нажмите на карту, чтобы изменить местоположение</p>
                <button type="button" class="btn-secondary small" @click="useCurrentLocation">
                  📍 Использовать мое местоположение
                </button>
              </div>
              
              <div class="form-actions">
                <button type="button" @click="resetOfferForm" class="btn-secondary">
                  Очистить
                </button>
                <button type="submit" class="btn-primary" :disabled="!newOffer.title">
                  🎯 Опубликовать предложение
                </button>
              </div>
            </form>
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
      selectedCoords: null,
      currentCoords: [55.751244, 37.618423],
      businessTab: 'stats',
      stats: { totalOffers: 0, activeUsers: 142, totalLikes: 0, totalViews: 0 },
      newOffer: { 
        title: '', 
        description: '', 
        category: 'food', 
        coords: [55.751244, 37.618423] 
      }
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
    
    handleMapClick(coords) { 
      this.selectedCoords = coords
      this.newOffer.coords = coords
    },
    
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
    
    async handleLike(offerId) {
      try {
        await this.offersStore.likeOffer(offerId)
        // Обновляем статистику после лайка
        this.stats.totalLikes += 1
      } catch (error) {
        console.error('Ошибка при лайке:', error)
      }
    },
    
    async handleOfferSubmit() {
      try {
        await this.offersStore.addOffer({ ...this.newOffer })
        this.resetOfferForm()
        this.showBusinessPanel = false
        this.businessTab = 'stats'
      } catch (error) { 
        console.error('Ошибка при добавлении:', error)
        alert('Ошибка при добавлении предложения')
      }
    },
    
    useCurrentLocation() {
      this.newOffer.coords = [...this.currentCoords]
      this.selectedCoords = [...this.currentCoords]
    },
    
    resetOfferForm() {
      this.newOffer = { 
        title: '', 
        description: '', 
        category: 'food', 
        coords: [...this.currentCoords] 
      }
      this.selectedCoords = null
    }
  },
  async mounted() {
    await this.offersStore.fetchOffers()
    
    // Загружаем статистику из API
    const stats = await this.offersStore.fetchStats()
    this.stats = { ...this.stats, ...stats }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentCoords = [position.coords.latitude, position.coords.longitude]
          this.newOffer.coords = [...this.currentCoords]
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
.map-area { flex: 1; position: relative; min-height: 400px; }
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

/* Бизнес-панель с вкладками */
.modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: flex-start; z-index: 2000; padding-top: 80px; }
.modal-panel { background: white; border-radius: 20px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #eee; }
.panel-header h3 { margin: 0; color: #333; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }

.business-tabs { display: flex; border-bottom: 1px solid #eee; }
.tab-btn { flex: 1; padding: 12px; background: none; border: none; cursor: pointer; transition: all 0.2s; }
.tab-btn.active { background: #007bff; color: white; }

.panel-content { padding: 20px; }

.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.stat-item { text-align: center; padding: 16px; background: #f8f9fa; border-radius: 12px; }
.stat-number { font-size: 24px; font-weight: 700; color: #007bff; margin-bottom: 4px; }
.stat-label { font-size: 12px; color: #666; }

/* Форма создания предложения */
.offer-form { padding: 0; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
.form-group input, .form-group textarea { width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 16px; box-sizing: border-box; transition: border-color 0.2s; }
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: #007bff; }

.category-buttons { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.category-buttons button { padding: 10px; border: 2px solid #e9ecef; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s; }
.category-buttons button.active { border-color: #007bff; background: #007bff; color: white; }
.category-buttons button:hover:not(.active) { border-color: #007bff; background: #f8f9ff; }

.coords-display { padding: 12px; background: #f8f9fa; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 14px; color: #666; margin-bottom: 8px; }
.coords-hint { font-size: 12px; color: #888; margin: 0 0 8px 0; }

.btn-secondary.small { padding: 8px 12px; font-size: 14px; }

.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }
.btn-primary, .btn-secondary { padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.2s; }
.btn-primary { background: #007bff; color: white; }
.btn-primary:hover:not(:disabled) { background: #0056b3; transform: translateY(-1px); }
.btn-primary:disabled { background: #ccc; cursor: not-allowed; transform: none; }
.btn-secondary { background: #6c757d; color: white; }
.btn-secondary:hover { background: #545b62; transform: translateY(-1px); }

.user-info { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.user-avatar { width: 60px; height: 60px; background: #007bff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; }
.user-details h4 { margin: 0 0 4px 0; color: #333; }
.user-details p { margin: 0; color: #666; font-size: 14px; }

@media (max-width: 768px) {
  .modal-panel { width: 95%; margin: 10px; max-height: calc(100vh - 20px); }
  .stats-grid { grid-template-columns: 1fr; }
  .category-buttons { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; }
}
</style>
