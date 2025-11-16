<template>
  <div class="map-container">
    <!-- Контейнер для карты -->
    <div id="yandex-map" ref="mapContainer"></div>
    
    <!-- Статус загрузки -->
    <div v-if="!mapLoaded" class="map-status">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Загружаем карту...</p>
        <button v-if="loadAttempts > 1" @click="initializeMap" class="retry-btn">
          Попробовать снова
        </button>
      </div>
    </div>

    <!-- Кнопки управления -->
    <button class="map-btn location-btn" @click="centerToUser">📍</button>
    <button class="map-btn add-btn" @click="$emit('add-click')">＋</button>
  </div>
</template>

<script>
export default {
  name: 'SimpleMap',
  props: {
    offers: {
      type: Array,
      default: () => []
    },
    selectedOffer: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      map: null,
      mapLoaded: false,
      loadAttempts: 0,
      markers: [],
      defaultCoords: [55.7558, 37.6173], // Москва, широкий охват
      defaultZoom: 10 // Умеренный зум
    }
  },
  methods: {
    // Инициализация карты
    initializeMap() {
      this.loadAttempts++
      console.log(`🗺️ Попытка загрузки карты #${this.loadAttempts}`)

      // Если API уже загружено
      if (window.ymaps) {
        this.createMap()
        return
      }

      // Загружаем API Яндекс.Карт
      const script = document.createElement('script')
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=07b74146-5f5a-46bf-a2b1-cf6d052a41bb&lang=ru_RU`
      
      script.onload = () => {
        console.log('✅ Яндекс.Карты API загружено')
        ymaps.ready(() => {
          this.createMap()
        })
      }

      script.onerror = (error) => {
        console.error('❌ Ошибка загрузки Яндекс.Карт:', error)
        this.mapLoaded = false
        // Показываем fallback сообщение
        this.showFallbackMessage()
      }

      document.head.appendChild(script)
    },

    // Создание карты
    createMap() {
      try {
        console.log('🛠️ Создаем карту...')
        
        this.map = new ymaps.Map(this.$refs.mapContainer, {
          center: this.defaultCoords,
          zoom: this.defaultZoom,
          controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
        }, {
          // Настройки для избежания ошибок тайлов
          suppressMapOpenBlock: true,
          yandexMapDisablePoiInteractivity: true
        })

        // События карты
        this.map.events.add('load', () => {
          console.log('✅ Карта успешно загружена')
          this.mapLoaded = true
          this.addMarkers()
          this.centerToUser() // Пытаемся центрировать на пользователе
        })

        this.map.events.add('click', (e) => {
          const coords = e.get('coords')
          this.$emit('map-click', coords)
        })

        // Обработка ошибок тайлов
        this.map.events.add('tileloaderror', (event) => {
          console.warn('⚠️ Ошибка загрузки тайла:', event)
        })

      } catch (error) {
        console.error('❌ Ошибка создания карты:', error)
        this.mapLoaded = false
        this.showFallbackMessage()
      }
    },

    // Добавление маркеров
    addMarkers() {
      if (!this.map || !this.offers) return

      // Удаляем старые маркеры
      this.markers.forEach(marker => {
        this.map.geoObjects.remove(marker)
      })
      this.markers = []

      // Добавляем новые маркеры
      this.offers.forEach(offer => {
        if (!offer.coords || !Array.isArray(offer.coords)) return

        try {
          const marker = new ymaps.Placemark(
            offer.coords,
            {
              hintContent: offer.title || 'Предложение',
              balloonContent: this.getBalloonContent(offer)
            },
            {
              preset: 'islands#blueIcon',
              iconColor: this.getMarkerColor(offer.category)
            }
          )

          marker.events.add('click', () => {
            this.$emit('offer-selected', offer)
          })

          this.map.geoObjects.add(marker)
          this.markers.push(marker)
        } catch (error) {
          console.warn('Ошибка создания маркера:', error, offer)
        }
      })
    },

    // Центрирование на пользователе
    centerToUser() {
      if (!navigator.geolocation) {
        console.warn('Геолокация не поддерживается')
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [
            position.coords.latitude,
            position.coords.longitude
          ]
          
          console.log('📍 Пользователь находится:', userCoords)
          
          if (this.map) {
            this.map.setCenter(userCoords, 13) // Ближе, но не слишком
          }
        },
        (error) => {
          console.warn('📍 Не удалось получить геолокацию:', error.message)
          // Оставляем карту с видом на Москву
          if (this.map) {
            this.map.setCenter(this.defaultCoords, this.defaultZoom)
          }
        },
        {
          enableHighAccuracy: false, // Не требовать высокой точности
          timeout: 10000,
          maximumAge: 600000
        }
      )
    },

    // Содержимое балуна
    getBalloonContent(offer) {
      return `
        <div style="padding: 10px; max-width: 250px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${offer.title || 'Без названия'}</h4>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${offer.description || ''}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #888; font-size: 12px;">${this.getCategoryLabel(offer.category)}</span>
            <span style="color: #888; font-size: 12px;">❤️ ${offer.likes || 0}</span>
          </div>
        </div>
      `
    },

    // Цвет маркера по категории
    getMarkerColor(category) {
      const colors = {
        food: '#28a745',
        entertainment: '#ffc107', 
        shopping: '#dc3545',
        services: '#17a2b8',
        other: '#6c757d'
      }
      return colors[category] || '#007bff'
    },

    // Метка категории
    getCategoryLabel(category) {
      const labels = {
        food: '🍕 Еда',
        entertainment: '🎭 Развлечения',
        shopping: '🛍️ Покупки',
        services: '🔧 Услуги',
        other: '❓ Другое'
      }
      return labels[category] || '📍 Предложение'
    },

    // Сообщение если карта не загрузилась
    showFallbackMessage() {
      const container = this.$refs.mapContainer
      if (container) {
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; background: #f8f9fa; color: #666; padding: 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
            <h3 style="margin: 0 0 8px 0;">Не удалось загрузить карту</h3>
            <p style="margin: 0 0 16px 0;">Проверьте подключение к интернету и обновите страницу</p>
            <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Обновить страницу
            </button>
          </div>
        `
      }
    }
  },

  watch: {
    offers: {
      handler(newOffers) {
        if (this.mapLoaded && newOffers) {
          this.addMarkers()
        }
      },
      deep: true
    },

    selectedOffer: {
      handler(newSelection) {
        if (newSelection && newSelection.coords && this.map) {
          this.map.setCenter(newSelection.coords, 15)
        }
      }
    }
  },

  mounted() {
    console.log('🗺️ Инициализация упрощенной карты')
    this.initializeMap()
    
    // Резервная инициализация через 3 секунды
    setTimeout(() => {
      if (!this.mapLoaded && this.loadAttempts === 1) {
        console.log('🔄 Резервная инициализация карты...')
        this.initializeMap()
      }
    }, 3000)
  },

  beforeUnmount() {
    if (this.map) {
      this.map.destroy()
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f0f0f0;
}

#yandex-map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.map-status {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content p {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.retry-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: #0056b3;
}

.map-btn {
  position: absolute;
  z-index: 900;
  background: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.map-btn:hover {
  transform: scale(1.1);
  background: #f8f9fa;
}

.location-btn {
  bottom: 100px;
  right: 20px;
  font-size: 18px;
}

.add-btn {
  bottom: 160px;
  right: 20px;
  background: #007bff;
  color: white;
}
</style>
