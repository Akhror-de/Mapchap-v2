<template>
  <div class="map-container">
    <!-- Добавляем проверку загрузки карты -->
    <div v-if="mapError" class="map-error">
      <p>⚠️ Не удалось загрузить карту</p>
      <button @click="initializeMap">Попробовать снова</button>
    </div>
    
    <div v-else-if="!mapLoaded" class="map-loading">
      <p>Загрузка карты...</p>
    </div>

    <yandex-map
      v-else
      :settings="mapSettings"
      :coords="currentCoords"
      :zoom="zoom"
      style="width: 100%; height: 100%"
      @click="onMapClick"
      @init="onMapInit"
      @error="onMapError"
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

    <!-- Кнопки управления -->
    <button class="floating-btn add-offer-btn" @click="showAddForm = true">＋</button>
    <button class="floating-btn location-btn" @click="getMyLocation">📍</button>

    <!-- Форма добавления предложения (остается без изменений) -->
    <div v-if="showAddForm" class="modal-overlay">
      <!-- ... существующий код формы ... -->
    </div>
  </div>
</template>

<script>
import { useOffersStore } from '@/stores/offers'

export default {
  name: 'MapContainer',
  props: { 
    offers: { 
      type: Array, 
      default: () => [] 
    } 
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
      zoom: 10,
      showAddForm: false,
      newOffer: { 
        title: '', 
        description: '', 
        category: 'food', 
        coords: [55.751244, 37.618423] 
      },
      mapLoaded: false,
      mapError: false
    }
  },
  setup() {
    const offersStore = useOffersStore()
    return { offersStore }
  },
  methods: {
    onMapInit() {
      console.log('✅ Карта успешно инициализирована')
      this.mapLoaded = true
      this.mapError = false
    },
    
    onMapError(error) {
      console.error('❌ Ошибка загрузки карты:', error)
      this.mapLoaded = false
      this.mapError = true
    },
    
    initializeMap() {
      this.mapError = false
      this.mapLoaded = false
      // Принудительно переинициализируем карту
      setTimeout(() => {
        this.mapLoaded = true
      }, 1000)
    },

    onMapClick(e) {
      try {
        const coords = e.get('coords')
        console.log('📍 Координаты клика:', coords)
        this.$emit('map-click', coords)
        
        // Обновляем координаты в форме
        if (this.showAddForm) {
          this.newOffer.coords = coords
        }
      } catch (error) {
        console.error('Ошибка получения координат:', error)
      }
    },
    
    onMarkerClick(offer) { 
      this.$emit('offer-selected', offer) 
    },
    
    async handleOfferSubmit() {
      try {
        // Проверяем, что координаты установлены
        if (!this.newOffer.coords || !Array.isArray(this.newOffer.coords)) {
          this.newOffer.coords = this.currentCoords
        }
        
        await this.offersStore.addOffer({ ...this.newOffer })
        this.showAddForm = false
        this.resetForm()
      } catch (error) { 
        console.error('Ошибка при добавлении:', error) 
      }
    },

    getMyLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentCoords = [
              position.coords.latitude, 
              position.coords.longitude
            ]
            this.zoom = 14
            console.log('📍 Текущее местоположение:', this.currentCoords)
          },
          (error) => { 
            console.warn('Геолокация недоступна:', error)
            // Используем координаты по умолчанию
            this.currentCoords = [55.751244, 37.618423]
            this.zoom = 10
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        )
      } else {
        console.warn('Геолокация не поддерживается браузером')
        this.currentCoords = [55.751244, 37.618423]
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
    console.log('🗺️ Инициализация карты...')
    this.getMyLocation()
    
    // Автоматическая инициализация через 2 секунды
    setTimeout(() => {
      if (!this.mapLoaded && !this.mapError) {
        this.mapLoaded = true
      }
    }, 2000)
  }
}
</script>

<style scoped>
.map-container { 
  width: 100%; 
  height: 100%; 
  position: relative; 
  background: #f0f0f0; /* Фон на случай если карта не загрузится */
}

.map-error, .map-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  color: #666;
  font-size: 16px;
}

.map-error button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.floating-btn { 
  position: absolute; 
  z-index: 1000; 
  background: white; 
  border: none; 
  border-radius: 50%; 
  width: 50px; 
  height: 50px; 
  cursor: pointer; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.2); 
  font-size: 20px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  transition: all 0.2s; 
}
.floating-btn:hover { 
  transform: scale(1.1); 
  background: #f8f9fa; 
}
.add-offer-btn { 
  bottom: 100px; 
  right: 20px; 
  background: #007bff; 
  color: white; 
}
.location-btn { 
  bottom: 160px; 
  right: 20px; 
  font-size: 18px; 
}

/* Остальные стили остаются без изменений */
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
}
/* ... остальные стили */
</style>
