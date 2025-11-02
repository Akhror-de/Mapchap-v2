<template>
  <div class="map-container">
    <div ref="mapRef" class="map"></div>
    <div v-if="!isMapLoaded" class="map-loading">
      <div class="loading-spinner"></div>
      <p>Загрузка карты...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMapStore } from '../../stores/map.store.js'

const mapStore = useMapStore()
const mapRef = ref(null)
const isMapLoaded = ref(false)

onMounted(async () => {
  try {
    await mapStore.initMap(mapRef.value)
    isMapLoaded.value = true
    
    // Добавляем обработчики событий карты
    if (mapStore.map) {
      mapStore.map.events.add('click', (e) => {
        const coords = e.get('coords')
        mapStore.addPlacemark(coords, {
          balloonContent: `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`,
          iconCaption: 'Новая метка'
        })
      })
    }
  } catch (error) {
    console.error('Ошибка загрузки карты:', error)
    isMapLoaded.value = false
  }
})

onUnmounted(() => {
  mapStore.destroyMap()
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  z-index: 999;
}
</style>
