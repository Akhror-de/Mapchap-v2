<template>
  <div class="app-layout">
    <!-- Верхняя панель (без изменений) -->
    <header class="header-panel">
      <button class="business-btn" @click="showBusinessPanel = true">
        <span>🏢 Бизнес</span>
      </button>
      <button class="profile-btn" @click="showProfilePanel = true">
        <span>👤 Профиль</span>
      </button>
    </header>

    <!-- Основная карта - ИСПОЛЬЗУЕМ ПРОСТУЮ КАРТУ -->
    <main class="map-area">
      <SimpleMap 
        :offers="offers"
        :selected-offer="selectedOffer"
        @offer-selected="selectOffer"
        @map-click="handleMapClick"
        @add-click="showAddForm = true"
      />
    </main>

    <!-- Форма добавления предложения -->
    <div v-if="showAddForm" class="modal-overlay">
      <div class="modal-content">
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
          <div class="form-actions">
            <button type="button" @click="showAddForm = false" class="btn-secondary">Отмена</button>
            <button type="submit" class="btn-primary" :disabled="!newOffer.title">Добавить предложение</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bottom Sheet и остальные компоненты без изменений -->
    <!-- ... -->
  </div>
</template>

<script>
// ЗАМЕНЯЕМ ИМПОРТ
import SimpleMap from '@/components/map/SimpleMap.vue'
import { useOffersStore } from '@/stores/offers'
import { useUserStore } from '@/stores/user'

export default {
  name: 'App',
  components: { SimpleMap }, // ИСПОЛЬЗУЕМ SimpleMap
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
        coords: [55.7558, 37.6173] // Координаты по умолчанию
      },
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
        coords: [55.7558, 37.6173]
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
      return '?' // Упрощаем для демонстрации
    }
  },
  async mounted() {
    await this.offersStore.fetchOffers()
    this.stats.totalOffers = this.offers.length
  }
}
</script>

<!-- Стили без изменений -->
