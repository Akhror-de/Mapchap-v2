<template>
  <div class="map-controls">
    <button class="control-btn" @click="locateMe" title="Мое местоположение">
      📍
    </button>
    <div class="zoom-controls">
      <button class="control-btn" @click="zoomIn" title="Увеличить">
        ➕
      </button>
      <button class="control-btn" @click="zoomOut" title="Уменьшить">
        ➖
      </button>
    </div>
  </div>
</template>

<script setup>
import { useMapStore } from '@/stores/map.store'

const mapStore = useMapStore()

const locateMe = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        mapStore.setCenter([latitude, longitude])
        mapStore.setZoom(15)
      },
      (error) => {
        console.error('Ошибка геолокации:', error)
      }
    )
  }
}

const zoomIn = () => {
  mapStore.setZoom(mapStore.zoom + 1)
}

const zoomOut = () => {
  mapStore.setZoom(mapStore.zoom - 1)
}
</script>

<style scoped>
.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.control-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 8px;
  background: var(--bg-primary);
  box-shadow: var(--shadow);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: var(--bg-hover);
  transform: scale(1.05);
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
