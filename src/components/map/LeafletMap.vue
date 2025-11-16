<template>
  <div class="map-container">
    <div id="leaflet-map" ref="mapContainer"></div>
    <div v-if="!mapLoaded" class="debug-info">
      <p>Статус: {{ mapStatus }}</p>
      <p>Ошибка: {{ mapError }}</p>
      <button @click="forceReload">Перезагрузить карту</button>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Самый простой способ исправить иконки
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default {
  name: 'LeafletMap',
  data() {
    return {
      map: null,
      mapLoaded: false,
      mapStatus: 'Инициализация...',
      mapError: null
    }
  },
  methods: {
    initializeMap() {
      console.log('🔄 Попытка инициализации карты...')
      this.mapStatus = 'Создаем карту...'
      
      try {
        // Создаем карту с координатами Москвы
        this.map = L.map('leaflet-map').setView([55.7558, 37.6173], 10)
        
        // Самый простой слой OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(this.map)
        
        // Добавляем тестовый маркер
        L.marker([55.7558, 37.6173])
          .addTo(this.map)
          .bindPopup('Тестовый маркер - карта работает!')
          .openPopup()
        
        this.map.whenReady(() => {
          console.log('✅ Карта готова!')
          this.mapLoaded = true
          this.mapStatus = 'Карта загружена'
        })
        
      } catch (error) {
        console.error('❌ Ошибка:', error)
        this.mapError = error.message
        this.mapStatus = 'Ошибка загрузки'
      }
    },
    
    forceReload() {
      if (this.map) {
        this.map.remove()
        this.map = null
      }
      this.mapLoaded = false
      this.mapStatus = 'Перезагрузка...'
      setTimeout(() => this.initializeMap(), 100)
    }
  },
  mounted() {
    // Ждем немного чтобы DOM точно был готов
    setTimeout(() => {
      this.initializeMap()
    }, 100)
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
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

#leaflet-map {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
}

.debug-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  z-index: 1000;
  text-align: center;
}

.debug-info button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
