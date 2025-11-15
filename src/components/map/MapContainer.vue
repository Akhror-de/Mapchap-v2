<template>
  <div class="map-container" ref="mapContainer">
    <yandex-map
      :settings="mapSettings"
      :coords="currentCoords"
      :zoom="zoom"
      style="width: 100%; height: 100%"
      @click="onMapClick"
      :behaviors="['default']"
      :controls="['zoomControl', 'fullscreenControl']"
      @init="onMapInit"
      @error="onMapError"
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

    <button class="floating-btn add-offer-btn" @click="showAddForm = true">＋</button>
    <button class="floating-btn location-btn" @click="getMyLocation">📍</button>

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
          <div class="form-group">
            <label>Координаты</label>
            <div class="coords-display">
              Ш: {{ newOffer.coords[0].toFixed(6) }}<br>
              Д: {{ newOffer.coords[1].toFixed(6) }}
            </div>
          </div>
          <div class="form-actions">
            <button type="button" @click="showAddForm = false" class="btn-secondary">Отмена</button>
            <button type="submit" class="btn-primary" :disabled="!newOffer.title">Добавить предложение</button>
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
      newOffer: { title: '', description: '', category: 'food', coords: [55.751244, 37.618423] },
      mapInitialized: false
    }
  },
  setup() {
    const offersStore = useOffersStore()
    return { offersStore }
  },
  methods: {
    onMapInit() {
      console.log('✅ Карта инициализирована')
      this.mapInitialized = true
      
      // Принудительная перерисовка карты
      this.$nextTick(() => {
        setTimeout(() => {
          this.forceMapRedraw()
        }, 500)
      })
    },
    
    onMapError(error) {
      console.error('❌ Ошибка карты:', error)
      this.mapInitialized = false
    },
    
    forceMapRedraw() {
      if (this.$refs.yandexMap && this.$refs.yandexMap.$map) {
        try {
          const map = this.$refs.yandexMap.$map
          map.container.fitToViewport()
          console.log('🔄 Карта перерисована')
        } catch (e) {
          console.warn('Не удалось перерисовать карту:', e)
        }
      }
    },
    
    onMapClick(e) {
      const coords = e.get('coords')
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
      }
    },
    
    getMyLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentCoords = [position.coords.latitude, position.coords.longitude]
            this.zoom = 14
            this.forceMapRedraw()
          },
          (error) => { 
            console.warn('Геолокация недоступна:', error)
          }
        )
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
      this.newOffer = { title: '', description: '', category: 'food', coords: this.currentCoords }
    }
  },
  mounted() {
    console.log('🗺️ MapContainer mounted')
    
    // Принудительно устанавливаем размеры контейнера
    this.$nextTick(() => {
      const container = this.$refs.mapContainer
      if (container) {
        container.style.height = '100%'
        container.style.width = '100%'
        container.style.position = 'absolute'
      }
    })
    
    this.getMyLocation()
    
    // Резервная перерисовка
    setTimeout(() => {
      this.forceMapRedraw()
    }, 2000)
  }
}
</script>

<style scoped>
.map-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 500px !important;
  background: #f0f0f0; /* Серый фон пока карта не загрузилась */
}

/* Убедимся, что карта занимает весь контейнер */
.map-container >>> .ymaps-map {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
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
.floating-btn:hover { transform: scale(1.1); background: #f8f9fa; }
.add-offer-btn { bottom: 100px; right: 20px; background: #007bff; color: white; }
.location-btn { bottom: 160px; right: 20px; font-size: 18px; }
.modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; }
.modal-content { background: white; border-radius: 12px; padding: 0; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #eee; }
.modal-header h3 { margin: 0; color: #333; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #666; }
.offer-form { padding: 20px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 500; color: #333; }
.form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
.coords-display { padding: 10px; background: #f8f9fa; border-radius: 6px; font-family: monospace; font-size: 12px; color: #666; }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 30px; }
.btn-primary, .btn-secondary { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.btn-primary { background: #007bff; color: white; }
.btn-primary:disabled { background: #ccc; cursor: not-allowed; }
.btn-secondary { background: #6c757d; color: white; }
</style>
