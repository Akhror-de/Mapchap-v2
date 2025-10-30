<template>
  <div class="map-container">
    <div id="map" ref="mapElement" class="map"></div>
    
    <MapPlaceholder v-if="!isMapReady" />
    <MapControls 
      @zoom-in="zoomIn"
      @zoom-out="zoomOut" 
      @locate="locateUser"
      @refresh="refreshMap"
    />
    
    <div v-if="mapError" class="map-error">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Не удалось загрузить карту</p>
      <button @click="initializeMap" class="retry-btn">Повторить</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMapStore } from '../../stores/map.store'
import { useAppStore } from '../../stores/app.store'
import { useOffers } from '../../composables/useOffers'
import { mapService } from '../../services/map.service'
import MapPlaceholder from './MapPlaceholder.vue'
import MapControls from './MapControls.vue'

const mapElement = ref(null)
const isMapReady = ref(false)
const mapError = ref(null)

const mapStore = useMapStore()
const appStore = useAppStore()
const { offers, loadOffers } = useOffers()

const initializeMap = async () => {
  try {
    appStore.setLoading(true, 'Загрузка карты...')
    mapError.value = null

    const map = await mapService.initializeMap(mapElement.value)
    mapStore.setMap(map)
    
    // Загружаем предложения и добавляем метки
    await loadOffers()
    addOffersToMap()
    
    isMapReady.value = true
  } catch (error) {
    console.error('Map initialization error:', error)
    mapError.value = 'Ошибка загрузки карты. Проверьте подключение к интернету.'
  } finally {
    appStore.setLoading(false)
  }
}

const addOffersToMap = () => {
  if (!offers.value.length) return

  offers.value.forEach(offer => {
    mapService.addMarker(offer.coordinates, offer)
  })
}

const zoomIn = () => {
  if (mapStore.map) {
    const currentZoom = mapStore.map.getZoom()
    mapStore.map.setZoom(currentZoom + 1)
  }
}

const zoomOut = () => {
  if (mapStore.map) {
    const currentZoom = mapStore.map.getZoom()
    mapStore.map.setZoom(currentZoom - 1)
  }
}

const locateUser = async () => {
  try {
    appStore.setLoading(true, 'Определение местоположения...')
    
    const location = await mapService.getUserLocation()
    mapStore.setUserLocation(location)
    mapService.setCenter(location, 15)
    
    appStore.showNotification({
      message: 'Местоположение определено',
      type: 'success'
    })
  } catch (error) {
    console.error('Location error:', error)
    appStore.showNotification({
      message: 'Не удалось определить местоположение',
      type: 'error'
    })
  } finally {
    appStore.setLoading(false)
  }
}

const refreshMap = () => {
  initializeMap()
}

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  mapService.destroy()
})
</script>

<style scoped>
.map-container {
  flex: 1;
  position: relative;
  background: var(--surface-bg);
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.map-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--error);
  background: var(--card-bg);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--error);
}

.map-error i {
  font-size: 48px;
  margin-bottom: 12px;
}

.retry-btn {
  background: var(--accent-blue);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  margin-top: 12px;
  cursor: pointer;
}
</style>
