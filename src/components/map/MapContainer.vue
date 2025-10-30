<template>
  <div class="map-container">
    <div id="map" ref="mapElement" class="map"></div>
    
    <MapPlaceholder v-if="!isMapReady && !mapError" />
    <MapControls 
      @zoom-in="zoomIn"
      @zoom-out="zoomOut" 
      @locate="locateUser"
    />
    
    <div v-if="mapError" class="map-error">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ mapError }}</p>
      <button @click="initializeMap" class="retry-btn">Повторить попытку</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../../stores/app.store'
import { mapService } from '../../services/map.service'
import MapPlaceholder from './MapPlaceholder.vue'
import MapControls from './MapControls.vue'

const mapElement = ref(null)
const isMapReady = ref(false)
const mapError = ref(null)

const appStore = useAppStore()

// Mock offers data
const mockOffers = [
  {
    id: 1,
    title: "Кофейня Central",
    discount: 30,
    address: "ул. Примерная, 15",
    description: "Скидка на все виды кофе при заказе через приложение",
    district: "center",
    coordinates: [55.7558, 37.6176],
    time: "до 18:00",
    category: "cafe"
  },
  {
    id: 2,
    title: "Магазин Fresh",
    discount: 20,
    address: "пр. Главный, 42",
    description: "Скидка на овощи и фрукты",
    district: "north", 
    coordinates: [55.7658, 37.6276],
    time: "ежедневно",
    category: "shop"
  },
  {
    id: 3,
    title: "Салон красоты Elite",
    discount: 25,
    address: "ул. Цветочная, 8", 
    description: "Скидка на стрижку и укладку",
    district: "south",
    coordinates: [55.7458, 37.6076],
    time: "по будням",
    category: "beauty"
  }
]

const initializeMap = async () => {
  try {
    appStore.setLoading(true, 'Инициализация карты...')
    mapError.value = null

    await mapService.initializeMap(mapElement.value)
    
    // Добавляем тестовые метки
    mockOffers.forEach(offer => {
      mapService.addMarker(offer.coordinates, offer)
    })
    
    isMapReady.value = true
    appStore.showNotification({ message: 'Карта загружена', type: 'success' })
    
  } catch (error) {
    console.error('Map error:', error)
    mapError.value = 'Ошибка загрузки карты. Проверьте интернет-соединение и API ключ.'
    appStore.showNotification({ message: 'Ошибка загрузки карты', type: 'error' })
  } finally {
    appStore.setLoading(false)
  }
}

const zoomIn = () => mapService.setZoom(mapService.map.getZoom() + 1)
const zoomOut = () => mapService.setZoom(mapService.map.getZoom() - 1)

const locateUser = async () => {
  try {
    appStore.setLoading(true, 'Определение местоположения...')
    const location = await mapService.getUserLocation()
    mapService.setCenter(location, 15)
    appStore.showNotification({ message: 'Местоположение определено', type: 'success' })
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

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  mapService.destroy()
})
</script>
