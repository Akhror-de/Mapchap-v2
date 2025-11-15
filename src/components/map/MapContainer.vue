<template>
  <div class="map-container">
    <div ref="mapContainer" style="width: 100%; height: 100%"></div>
    
    <!-- Кнопки управления -->
    <button class="floating-btn add-offer-btn" @click="showAddForm = true">
      <span>＋</span>
    </button>

    <button class="floating-btn location-btn" @click="getMyLocation">
      <span>📍</span>
    </button>
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
      map: null,
      currentCoords: [55.751244, 37.618423],
      zoom: 10,
      showAddForm: false,
      markers: []
    }
  },
  setup() {
    const offersStore = useOffersStore()
    return { offersStore }
  },
  mounted() {
    this.loadYandexMap()
    this.getMyLocation()
  },
  methods: {
    loadYandexMap() {
      // Динамическая загрузка Яндекс.Карт
      const script = document.createElement('script')
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=07b74146-5f5a-46bf-a2b1-cf6d052a41bb&lang=ru_RU`
      script.onload = () => {
        ymaps.ready(this.initMap)
      }
      document.head.appendChild(script)
    },

    initMap() {
      this.map = new ymaps.Map(this.$refs.mapContainer, {
        center: this.currentCoords,
        zoom: this.zoom,
        controls: ['zoomControl', 'fullscreenControl']
      })

      // Добавляем обработчик клика по карте
      this.map.events.add('click', (e) => {
        const coords = e.get('coords')
        this.$emit('map-click', coords)
      })

      this.updateMarkers()
    },

    updateMarkers() {
      // Удаляем старые маркеры
      this.markers.forEach(marker => {
        this.map.geoObjects.remove(marker)
      })
      this.markers = []

      // Добавляем новые маркеры
      this.offers.forEach(offer => {
        const marker = new ymaps.Placemark(
          offer.coords,
          {
            hintContent: offer.title,
            balloonContentHeader: offer.title,
            balloonContentBody: offer.description || 'Описание отсутствует',
            balloonContentFooter: this.getCategoryLabel(offer.category)
          },
          {
            preset: this.getPresetByCategory(offer.category),
            iconColor: this.getColorByCategory(offer.category)
          }
        )

        marker.events.add('click', () => {
          this.$emit('offer-selected', offer)
        })

        this.map.geoObjects.add(marker)
        this.markers.push(marker)
      })
    },

    getMyLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentCoords = [
              position.coords.latitude,
              position.coords.longitude
            ]
            if (this.map) {
              this.map.setCenter(this.currentCoords, 14)
            }
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
    }
  },
  watch: {
    offers: {
      handler() {
        if (this.map) {
          this.updateMarkers()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
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
</style>
