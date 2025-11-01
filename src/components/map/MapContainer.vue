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
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const mapRef = ref(null)
const isMapLoaded = ref(false)

onMounted(async () => {
  await mapStore.initMap(mapRef.value)
  isMapLoaded.value = true
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
}
</style>
