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
    <button class="control-btn" @click="addTestMarker" title="Добавить метку">
      📌
    </button>
  </div>
</template>

<script setup>
import { useMapStore } from '../../stores/map.store.js'

const mapStore = useMapStore()

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
  mapStore.setZoom(mapStore.zoom + 1)
}

const zoomOut = () => {
  mapStore.setZoom(mapStore.zoom - 1)
}

const addTestMarker = () => {
  // Добавляем тестовую метку в центре карты
  const [lat, lon] = mapStore.center
  mapStore.addPlacemark([lat, lon], {
    balloonContent: 'Тестовая метка',
    iconCaption: 'Тест'
  })
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
