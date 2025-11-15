<template>
  <div class="map-container">
    <yandex-map
      :settings="mapSettings"
      :coords="currentCoords"
      :zoom="zoom"
      style="width: 100%; height: 100%; min-height: 400px;"
      @click="onMapClick"
      :behaviors="['default']"
      :controls="['zoomControl', 'fullscreenControl']"
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

    <!-- Наши кастомные контролы (оставляем только нужные) -->
    <div class="custom-controls">
      <button class="control-btn location" @click="getMyLocation">📍</button>
      <button class="control-btn add-offer" @click="$emit('add-offer-click')">🎯</button>
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
  </div>
</template>

<script>
import { useOffersStore } from '@/stores/offers'

export default {
  name: 'MapContainer',
  props: { 
    offers: { type: Array, default: () => [] },
    selectedCoords: { type: Array, default: null }
  },
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
      selectedOffer: null
    }
  },
  setup() {
    const offersStore = useOffersStore()
    return { offersStore }
  },
  watch: {
    selectedCoords(newCoords) {
      if (newCoords) {
        this.currentCoords = newCoords
        this.zoom = 15
      }
    }
  },
  methods: {
    onMapClick(e) {
      const coords = e.get('coords')
      this.$emit('map-click', coords)
    },
    
    onMarkerClick(offer) { 
      this.selectedOffer = offer
      this.$emit('offer-selected', offer) 
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
          }
        )
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
    }
  },
  mounted() {
    this.getMyLocation()
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  min-height: 400px;
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
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  background: #f8f9fa;
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
}
</style>
