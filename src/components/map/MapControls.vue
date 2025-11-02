<template>
  <div class="map-controls">
    <button class="control-btn" @click="locateMe" title="Мое местоположение">
      📍
    </button>
    <div class="zoom-controls">
      <button class="control-btn" @click="zoomIn" title="Увеличить">
        ➕
      </button>
      <div class="zoom-level">{{ currentZoom }}x</div>
      <button class="control-btn" @click="zoomOut" title="Уменьшить">
        ➖
      </button>
    </div>
    <button class="control-btn" @click="addTestMarker" title="Добавить метку">
      📌
    </button>
    <button class="control-btn" @click="clearMarkers" title="Очистить метки">
      🗑️
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMapStore } from '../../stores/map.store.js'

const mapStore = useMapStore()
const currentZoom = ref(10)
let updateInterval

onMounted(() => {
  // Обновляем отображение зума каждые 500мс
  updateInterval = setInterval(() => {
    if (mapStore.map) {
      currentZoom.value = mapStore.getZoom()
    }
  }, 500)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

const locateMe = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        mapStore.setCenter([latitude, longitude])
        mapStore.setZoom(15)
        
        // Добавляем метку на текущее местоположение
        mapStore.addPlacemark([latitude, longitude], {
          balloonContent: 'Ваше местоположение',
          iconCaption: 'Вы здесь'
        })
      },
      (error) => {
        console.error('Ошибка геолокации:', error)
        alert('Не удалось определить ваше местоположение')
      }
    )
  } else {
    alert('Геолокация не поддерживается вашим браузером')
  }
}

const zoomIn = () => {
  const current = mapStore.getZoom()
  if (current < 19) { // Максимальный зум Яндекс.Карт
    mapStore.setZoom(current + 1)
  }
}

const zoomOut = () => {
  const current = mapStore.getZoom()
  if (current > 1) { // Минимальный зум Яндекс.Карт
    mapStore.setZoom(current - 1)
  }
}

const addTestMarker = () => {
  const center = mapStore.getCenter()
  mapStore.addPlacemark(center, {
    balloonContent: 'Тестовая метка',
    iconCaption: 'Тест'
  })
}

const clearMarkers = () => {
  mapStore.removeAllPlacemarks()
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

.control-btn:active {
  transform: scale(0.95);
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

.zoom-level {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
}
</style>
