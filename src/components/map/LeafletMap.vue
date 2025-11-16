<template>
  <div class="map-container">
    <div id="leaflet-map" ref="mapContainer"></div>
    
    <!-- Кнопка выбора стиля карты -->
    <button class="map-btn style-btn" @click="toggleStylePanel" title="Стиль карты">
      <i class="fas fa-layer-group"></i>
    </button>
    
    <button class="map-btn location-btn" @click="centerToUser" title="Мое местоположение">
      <i class="fas fa-crosshairs"></i>
    </button>
    
    <button class="map-btn add-btn" @click="$emit('add-click')" title="Добавить предложение">
      <i class="fas fa-plus"></i>
    </button>

    <!-- Панель выбора стиля -->
    <div v-if="showStylePanel" class="style-panel">
      <div class="panel-header">
        <h4>Стиль карты</h4>
        <button class="close-panel" @click="showStylePanel = false">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="style-options">
        <div 
          v-for="style in mapStyles" 
          :key="style.name"
          class="style-option"
          :class="{ active: currentStyle === style.name }"
          @click="changeMapStyle(style.name)"
        >
          <div class="style-preview" :style="{ background: style.color }">
            <i :class="style.icon"></i>
          </div>
          <span class="style-name">{{ style.label }}</span>
        </div>
      </div>
    </div>

    <div v-if="!mapLoaded" class="map-status">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Загрузка карты...</p>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'LeafletMap',
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
      markers: [],
      userLocation: [55.7558, 37.6173],
      userMarker: null,
      showStylePanel: false,
      currentStyle: 'light',
      baseLayers: {},
      
      // ВСЕ ДОСТУПНЫЕ СТИЛИ КАРТ
      mapStyles: [
        {
          name: 'light',
          label: 'Светлая',
          icon: 'fas fa-sun',
          color: '#f8f9fa',
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          attribution: '© OpenStreetMap, © CartoDB'
        },
        {
          name: 'dark',
          label: 'Темная', 
          icon: 'fas fa-moon',
          color: '#2c3e50',
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '© OpenStreetMap, © CartoDB'
        },
        {
          name: 'standard',
          label: 'Стандартная',
          icon: 'fas fa-map',
          color: '#e9ecef',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '© OpenStreetMap contributors'
        },
        {
          name: 'satellite',
          label: 'Спутник',
          icon: 'fas fa-satellite',
          color: '#1a252f',
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '© Esri'
        },
        {
          name: 'topographic',
          label: 'Топографическая',
          icon: 'fas fa-mountain',
          color: '#d4edda',
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: '© OpenStreetMap, © OpenTopoMap'
        },
        {
          name: 'terrain',
          label: 'Ландшафтная',
          icon: 'fas fa-tree',
          color: '#d1ecf1',
          url: 'https://stamen-tiles-{s}.a.ssl.fastly.com/terrain/{z}/{x}/{y}{r}.png',
          attribution: '© Stamen, © OpenStreetMap'
        },
        {
          name: 'minimal',
          label: 'Минимализм',
          icon: 'fas fa-brush',
          color: '#ffffff',
          url: 'https://stamen-tiles-{s}.a.ssl.fastly.com/toner-lite/{z}/{x}/{y}{r}.png',
          attribution: '© Stamen, © OpenStreetMap'
        },
        {
          name: 'watercolor',
          label: 'Акварель',
          icon: 'fas fa-paint-brush',
          color: '#e3f2fd',
          url: 'https://stamen-tiles-{s}.a.ssl.fastly.com/watercolor/{z}/{x}/{y}.jpg',
          attribution: '© Stamen, © OpenStreetMap'
        }
      ]
    }
  },
  methods: {
    initializeMap() {
      console.log('🗺️ Инициализация карты с выбором стилей...')
      
      try {
        // Создаем карту
        this.map = L.map(this.$refs.mapContainer, {
          zoomControl: false
        }).setView(this.userLocation, 12)
        
        // Инициализируем все стили карт
        this.initializeMapStyles()
        
        // Добавляем выбранный стиль по умолчанию
        const defaultStyle = this.mapStyles.find(s => s.name === this.currentStyle)
        this.baseLayers[defaultStyle.label] = L.tileLayer(defaultStyle.url, {
          attribution: defaultStyle.attribution,
          maxZoom: 19
        }).addTo(this.map)
        
        // Добавляем контролы
        L.control.zoom({ position: 'topright' }).addTo(this.map)
        L.control.layers(this.baseLayers).addTo(this.map)
        
        // Обработчик клика
        this.map.on('click', (e) => {
          this.$emit('map-click', [e.latlng.lat, e.latlng.lng])
        })
        
        // Событие загрузки
        this.map.whenReady(() => {
          console.log('✅ Карта загружена')
          this.mapLoaded = true
          this.addMarkers()
        })
        
      } catch (error) {
        console.error('❌ Ошибка инициализации карты:', error)
        this.mapLoaded = true
      }
    },
    
    // Инициализация всех стилей карт
    initializeMapStyles() {
      this.mapStyles.forEach(style => {
        this.baseLayers[style.label] = L.tileLayer(style.url, {
          attribution: style.attribution,
          maxZoom: 19
        })
      })
    },
    
    // Смена стиля карты
    changeMapStyle(styleName) {
      this.currentStyle = styleName
      const newStyle = this.mapStyles.find(s => s.name === styleName)
      
      // Удаляем все текущие тайловые слои
      this.map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          this.map.removeLayer(layer)
        }
      })
      
      // Добавляем новый стиль
      this.baseLayers[newStyle.label].addTo(this.map)
      this.showStylePanel = false
      
      console.log(`🎨 Стиль карты изменен на: ${newStyle.label}`)
    },
    
    toggleStylePanel() {
      this.showStylePanel = !this.showStylePanel
    },
    
    // Профессиональные маркеры (остаются без изменений)
    createProfessionalMarker(offer) {
      const categoryConfig = {
        food: { color: '#e74c3c', icon: 'utensils' },
        entertainment: { color: '#9b59b6', icon: 'theater-masks' },
        shopping: { color: '#3498db', icon: 'shopping-bag' },
        services: { color: '#f39c12', icon: 'tools' },
        other: { color: '#2ecc71', icon: 'map-marker-alt' }
      }
      
      const config = categoryConfig[offer.category] || categoryConfig.other
      
      return L.divIcon({
        className: `professional-marker ${offer.category}-marker`,
        html: `
          <div class="marker-container" style="
            background: ${config.color};
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            <div style="transform: rotate(45deg); color: white; font-size: 12px;">
              <i class="fas fa-${config.icon}"></i>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      })
    },
    
    centerToUser() {
      if (!navigator.geolocation) return
      
      this.mapLoaded = false
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [position.coords.latitude, position.coords.longitude]
          this.userLocation = userCoords
          
          if (this.userMarker) {
            this.map.removeLayer(this.userMarker)
          }
          
          this.userMarker = L.marker(userCoords, {
            icon: L.divIcon({
              className: 'user-marker',
              html: `
                <div style="
                  background: #007bff;
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 3px 10px rgba(0,123,255,0.4);
                  border: 2px solid white;
                  color: white;
                  font-size: 14px;
                ">
                  <i class="fas fa-user"></i>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })
          })
            .addTo(this.map)
            .bindPopup('📍 Ваше местоположение')
          
          this.map.setView(userCoords, 15)
          this.mapLoaded = true
        },
        (error) => {
          console.warn('Геолокация недоступна:', error)
          this.map.setView([55.7558, 37.6173], 12)
          this.mapLoaded = true
        }
      )
    },
    
    addMarkers() {
      if (!this.map) return
      
      this.markers.forEach(marker => this.map.removeLayer(marker))
      this.markers = []
      
      this.offers.forEach(offer => {
        if (!offer.coords) return
        
        const marker = L.marker(offer.coords, {
          icon: this.createProfessionalMarker(offer)
        })
          .addTo(this.map)
          .bindPopup(this.getPopupContent(offer))
        
        marker.on('click', () => {
          this.$emit('offer-selected', offer)
        })
        
        this.markers.push(marker)
      })
    },
    
    getPopupContent(offer) {
      const categoryIcons = {
        food: 'utensils', entertainment: 'theater-masks', 
        shopping: 'shopping-bag', services: 'tools', other: 'map-marker-alt'
      }
      
      const categoryColors = {
        food: '#e74c3c', entertainment: '#9b59b6',
        shopping: '#3498db', services: '#f39c12', other: '#2ecc71'
      }
      
      const icon = categoryIcons[offer.category]
      const color = categoryColors[offer.category]
      
      return `
        <div style="min-width: 250px; padding: 0; border-radius: 8px; overflow: hidden;">
          <div style="background: ${color}; padding: 15px; color: white;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="background: rgba(255,255,255,0.2); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-${icon}"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-size: 16px;">${offer.title || 'Без названия'}</h4>
                <p style="margin: 0; opacity: 0.9; font-size: 12px;">${this.getCategoryLabel(offer.category)}</p>
              </div>
            </div>
          </div>
          <div style="padding: 15px;">
            <p style="margin: 0 0 10px 0; color: #555;">${offer.description || 'Описание отсутствует'}</p>
            <div style="display: flex; justify-content: space-between; color: #666; font-size: 12px;">
              <span><i class="fas fa-heart" style="color: #e74c3c;"></i> ${offer.likes || 0}</span>
              <span><i class="fas fa-eye" style="color: #3498db;"></i> ${offer.views || 0}</span>
            </div>
          </div>
        </div>
      `
    },
    
    getCategoryLabel(category) {
      const labels = {
        food: 'Еда и рестораны',
        entertainment: 'Развлечения',
        shopping: 'Магазины',
        services: 'Услуги',
        other: 'Другие предложения'
      }
      return labels[category] || 'Предложение'
    }
  },
  
  watch: {
    offers: {
      handler() { this.mapLoaded && this.addMarkers() },
      deep: true
    }
  },
  
  mounted() {
    this.addFontAwesome()
    this.initializeMap()
    setTimeout(() => this.centerToUser(), 1000)
  },
  
  methods: {
    addFontAwesome() {
      if (!document.querySelector('#font-awesome-css')) {
        const link = document.createElement('link')
        link.id = 'font-awesome-css'
        link.rel = 'stylesheet'
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        document.head.appendChild(link)
      }
    }
  },
  
  beforeUnmount() {
    if (this.map) this.map.remove()
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #1a1a1a;
}

#leaflet-map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* Кнопки управления */
.map-btn {
  position: absolute;
  z-index: 1000;
  background: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #333;
}

.map-btn:hover {
  transform: scale(1.1);
  background: #f8f9fa;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

.style-btn {
  top: 20px;
  right: 20px;
}

.location-btn {
  bottom: 100px;
  right: 20px;
}

.add-btn {
  bottom: 160px;
  right: 20px;
  background: #007bff;
  color: white;
}

.add-btn:hover {
  background: #0056b3;
}

/* Панель выбора стиля */
.style-panel {
  position: absolute;
  top: 80px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  padding: 15px;
  min-width: 200px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.panel-header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.close-panel {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
}

.style-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.style-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.style-option:hover {
  background: #f8f9fa;
}

.style-option.active {
  border-color: #007bff;
  background: #f0f8ff;
}

.style-preview {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: white;
  font-size: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.style-name {
  font-size: 12px;
  color: #333;
  text-align: center;
  font-weight: 500;
}

/* Индикатор загрузки */
.map-status {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.loading-content {
  text-align: center;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}
</style>
