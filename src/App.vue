<template>
  <div class="app-layout">
    <!-- Верхняя панель -->
    <header class="header-panel">
      <button class="business-btn" @click="showBusinessPanel = true">
        <span>🏢 Бизнес</span>
      </button>
      <button class="profile-btn" @click="showProfilePanel = true">
        <span>👤 Профиль</span>
      </button>
    </header>

    <!-- Основная карта - LEAFLET -->
    <main class="map-area">
      <LeafletMap 
        :offers="offers"
        :selected-offer="selectedOffer"
        @offer-selected="selectOffer"
        @map-click="handleMapClick"
        @add-click="showAddForm = true"
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
            <div class="offer-category">{{ getCategoryIcon(offer.category) }}</div>
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

    <!-- Форма добавления предложения -->
    <div v-if="showAddForm" class="modal-overlay" @click="showAddForm = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Добавить предложение</h3>
          <button class="close-btn" @click="showAddForm = false">×</button>
        </div>
        
        <form @submit.prevent="handleOfferSubmit" class="offer-form">
          <div class="form-group">
            <label>Название *</label>
            <input v-model="newOffer.title" type="text" required placeholder="Что предлагаете?" maxlength="50">
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="newOffer.description" rows="3" placeholder="Подробное описание..." maxlength="200"></textarea>
          </div>
          <div class="form-group">
            <label>Категория</label>
            <select v-model="newOffer.category">
              <option value="food">🍕 Еда</option>
              <option value="entertainment">🎭 Развлечения</option>
              <option value="shopping">🛍️ Покупки</option>
              <option value="services">🔧 Услуги</option>
              <option value="other">❓ Другое</option>
            </select>
          </div>
          <div class="form-group">
            <label>Координаты</label>
            <div class="coords-display">
              Ш: {{ (newOffer.coords[0] || 0).toFixed(6) }}<br>
              Д: {{ (newOffer.coords[1] || 0).toFixed(6) }}
            </div>
          </div>
          <div class="form-actions">
            <button type="button" @click="showAddForm = false" class="btn-secondary">Отмена</button>
            <button type="submit" class="btn-primary" :disabled="!newOffer.title">Добавить предложение</button>
          </div>
        </form>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeafletMap from '@/components/map/LeafletMap.vue'
import { useOffersStore } from '@/stores/offers'
import { useUserStore } from '@/stores/user'

export default {
  name: 'App',
  components: { LeafletMap },
  data() {
    return {
      sheetExpanded: true,
      showBusinessPanel: false,
      showProfilePanel: false,
      selectedOffer: null,
      showAddForm: false,
      newOffer: { 
        title: '', 
        description: '', 
        category: 'food',
        coords: [55.7558, 37.6173]
      },
      userLocation: [55.7558, 37.6173],
      stats: { totalOffers: 0, activeUsers: 142, views: 1250 }
    }
  },
  setup() {
    const offersStore = useOffersStore()
    const userStore = useUserStore()
    return { offersStore, userStore }
  },
  computed: {
    offers() { return this.offersStore.offers || [] },
    filteredOffers() { 
      if (!Array.isArray(this.offers)) return []
      return this.offers.slice(0, 10) 
    }
  },
  methods: {
    selectOffer(offer) { 
      this.selectedOffer = offer 
    },
    
    handleMapClick(coords) { 
      console.log('Map clicked at:', coords)
      this.newOffer.coords = coords
      this.showAddForm = true
    },
    
    async handleOfferSubmit() {
      try {
        await this.offersStore.addOffer({ ...this.newOffer })
        this.showAddForm = false
        this.resetForm()
      } catch (error) { 
        console.error('Ошибка при добавлении:', error) 
      }
    },
    
    resetForm() {
      this.newOffer = { 
        title: '', 
        description: '', 
        category: 'food',
        coords: this.userLocation
      }
    },
    
    getCategoryIcon(category) {
      const icons = {
        food: '🍕', entertainment: '🎭', shopping: '🛍️', 
        services: '🔧', other: '❓'
      }
      return icons[category] || '📍'
    },
    
    calculateDistance(offerCoords) {
      if (!this.userLocation || !offerCoords) return '?'
      const [lat1, lon1] = this.userLocation
      const [lat2, lon2] = offerCoords
      const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 100
      return distance.toFixed(1)
    }
  },
  async mounted() {
    await this.offersStore.fetchOffers()
    this.stats.totalOffers = this.offers.length
    
    // Получаем геолокацию пользователя
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = [position.coords.latitude, position.coords.longitude]
          this.newOffer.coords = this.userLocation
        },
        (error) => {
          console.warn('Геолокация недоступна:', error)
        }
      )
    }
  }
}
</script>

<!-- Стили остаются БЕЗ ИЗМЕНЕНИЙ -->
<style scoped>
/* ... существующие стили App.vue ... */
</style>
