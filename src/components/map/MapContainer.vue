<template>
  <div class="map-container">
    <yandex-map
      :settings="mapSettings"
      :coords="currentCoords"
      :zoom="zoom"
      style="width: 100%; height: 100%"
      @click="onMapClick"
      :behaviors="behaviors"
      :controls="controls"
      ref="yandexMap"
    >
      <yandex-marker
        v-for="offer in offers"
        :key="offer.id"
        :marker-id="offer.id"
        :coords="offer.coords"
        :properties="{
          hintContent: offer.title,
          balloonContentHeader: offer.title,
          balloonContentBody: offer.description,
          balloonContentFooter: getCategoryLabel(offer.category)
        }"
        :options="{
          preset: getPresetByCategory(offer.category),
          iconColor: getColorByCategory(offer.category)
        }"
        @click="onMarkerClick(offer)"
      />
    </yandex-map>

    <!-- Наши кастомные контролы -->
    <div class="custom-controls">
      <button class="control-btn zoom-in" @click="zoomIn">＋</button>
      <button class="control-btn zoom-out" @click="zoomOut">－</button>
      <button class="control-btn fullscreen" @click="toggleFullscreen">
        {{ isFullscreen ? '⤢' : '⤡' }}
      </button>
      <button class="control-btn location" @click="getMyLocation">📍</button>
      <button class="control-btn add-offer" @click="showAddForm = true">🎯</button>
    </div>

    <!-- Панель деталей предложения -->
    <div v-if="selectedOffer" class="offer-details-panel">
      <div class="offer-header">
        <h3>{{ selectedOffer.title }}</h3>
        <button class="close-details" @click="selectedOffer = null">×</button>
      </div>
      <p class="offer-description">{{ selectedOffer.description }}</p>
      <div class="offer-actions">
        <button class="action-btn like" @click="handleLike(selectedOffer.id)" 
                :class="{ liked: selectedOffer.likes > 0 }">
          ❤️ {{ selectedOffer.likes }}
        </button>
        <span class="offer-category-badge">{{ getCategoryLabel(selectedOffer.category) }}</span>
      </div>
    </div>

    <!-- Модальное окно добавления предложения -->
    <div v-if="showAddForm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>🎯 Добавить предложение</h3>
          <button class="close-btn" @click="showAddForm = false">×</button>
        </div>
        
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
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showAddForm = false" class="btn-secondary">
              Отмена
            </button>
            <button type="submit" class="btn-primary" :disabled="!newOffer.title">
              🎯 Опубликовать предложение
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useOffersStore } from '@/stores/offers'

export default {
  name: 'MapContainer',
  props: { offers: { type: Array, default: () => [] } },
  data() {
    return {
      mapSettings: {
        apiKey: '07b74146-5f5a-46bf-a2b1-cf6d052a41bb',
        lang: 'ru_RU',
        coordorder: 'latlong',
        version: '2.1'
      },
      currentCoords: [55.751244, 37.618423],
      zoom: 12,
      showAddForm: false,
      selectedOffer: null,
      isFullscreen: false,
      // Убираем стандартные контролы Яндекс.Карт
      controls: [],
      // Настраиваем поведения карты
      behaviors: ['drag', 'scrollZoom', 'dblClickZoom', 'multiTouch'],
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
    return { offersStore }
  },
  methods: {
    onMapClick(e) {
      const coords = e.get('coords')
      this.newOffer.coords = coords
      this.$emit('map-click', coords)
    },
    
    onMarkerClick(offer) { 
      this.selectedOffer = offer
      this.$emit('offer-selected', offer) 
    },
    
    async handleOfferSubmit() {
      try {
        await this.offersStore.addOffer({ ...this.newOffer })
        this.showAddForm = false
        this.resetForm()
      } catch (error) { 
        console.error('Ошибка при добавлении:', error)
        alert('Ошибка при добавлении предложения')
      }
    },
    
    getMyLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentCoords = [position.coords.latitude, position.coords.longitude]
            this.zoom = 15
          },
          (error) => { 
            console.warn('Геолокация недоступна:', error)
            alert('Не удалось определить ваше местоположение')
          }
        )
      }
    },
    
    zoomIn() {
      if (this.zoom < 19) this.zoom += 1
    },
    
    zoomOut() {
      if (this.zoom > 9) this.zoom -= 1
    },
    
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen
      const mapContainer = this.$el
      if (this.isFullscreen) {
        mapContainer.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
    },
    
    async handleLike(offerId) {
      try {
        await this.offersStore.likeOffer(offerId)
        if (this.selectedOffer && this.selectedOffer.id === offerId) {
          this.selectedOffer.likes += 1
        }
      } catch (error) {
        console.error('Ошибка при лайке:', error)
      }
    },
    
    getPresetByCategory(category) {
      const presets = {
        food: 'islands#blueFoodIcon',
        entertainment: 'islands#blueEntertainmentIcon',
        shopping: 'islands#blueShoppingIcon',
        services: 'islands#blueServiceIcon',
        other: 'islands#blueCircleDotIcon'
      }
      return presets[category] || 'islands#blueIcon'
    },
    
    getColorByCategory(category) {
      const colors = {
        food: '#28a745',
        entertainment: '#ffc107',
        shopping: '#dc3545',
        services: '#17a2b8',
        other: '#6c757d'
      }
      return colors[category] || '#007bff'
    },
    
    getCategoryLabel(category) {
      const labels = {
        food: '🍕 Еда',
        entertainment: '🎭 Развлечения',
        shopping: '🛍️ Покупки',
        services: '🔧 Услуги',
        other: '❓ Другое'
      }
      return labels[category] || category
    },
    
    resetForm() {
      this.newOffer = { 
        title: '', 
        description: '', 
        category: 'food', 
        coords: this.currentCoords 
      }
    }
  },
  mounted() {
    this.getMyLocation()
    
    // Обработчик выхода из полноэкранного режима
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement
    })
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Кастомные контролы */
.custom-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
}

.control-btn {
  width: 44px;
  height: 44px;
  background: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  background: #f8f9fa;
}

.control-btn:active {
  transform: translateY(0);
}

.control-btn.add-offer {
  background: #007bff;
  color: white;
  font-size: 20px;
}

.control-btn.add-offer:hover {
  background: #0056b3;
}

.control-btn.location {
  background: #28a745;
  color: white;
}

.control-btn.location:hover {
  background: #1e7e34;
}

.control-btn.fullscreen {
  background: #6c757d;
  color: white;
}

.control-btn.fullscreen:hover {
  background: #545b62;
}

/* Панель деталей предложения */
.offer-details-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  max-width: 320px;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.offer-header h3 {
  margin: 0;
  flex: 1;
  margin-right: 10px;
  color: #333;
  font-size: 18px;
  line-height: 1.3;
}

.close-details {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
}

.close-details:hover {
  background: #f8f9fa;
}

.offer-description {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.4;
  font-size: 14px;
}

.offer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-btn.like {
  background: none;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn.like:hover {
  background: #fff0f0;
  border-color: #ff6b6b;
}

.action-btn.like.liked {
  background: #fff0f0;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.offer-category-badge {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

/* Модальное окно */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 0;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f8f9fa;
}

.offer-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
}

.category-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.category-buttons button {
  padding: 10px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.category-buttons button.active {
  border-color: #007bff;
  background: #007bff;
  color: white;
}

.category-buttons button:hover:not(.active) {
  border-color: #007bff;
  background: #f8f9ff;
}

.coords-display {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.coords-hint {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
  transform: translateY(-1px);
}

/* Адаптивность */
@media (max-width: 768px) {
  .custom-controls {
    top: 10px;
    right: 10px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .offer-details-panel {
    top: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
  }
  
  .modal-content {
    margin: 10px;
    max-height: calc(100vh - 20px);
  }
  
  .category-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
