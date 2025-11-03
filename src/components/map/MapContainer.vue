<!-- src/components/map/MapContainer.vue - ОБНОВИТЕ -->
<template>
  <div class="map-container">
    <div ref="mapRef" class="map"></div>
    
    <!-- Состояние загрузки -->
    <div v-if="mapStore.isLoading" class="map-overlay">
      <div class="loading-spinner"></div>
      <p>Загрузка карты...</p>
    </div>
    
    <!-- Состояние ошибки -->
    <div v-else-if="mapStore.error" class="map-overlay error">
      <div class="error-icon">⚠️</div>
      <h3>Не удалось загрузить карту</h3>
      <p>{{ mapStore.error }}</p>
      <button class="btn btn-primary" @click="retryLoading">
        Попробовать снова
      </button>
      <div class="error-help">
        <p><small>Проверьте:</small></p>
        <ul>
          <li><small>Подключение к интернету</small></li>
          <li><small>Настройки API-ключа в .env файле</small></li>
        </ul>
      </div>
    </div>
    
    <!-- Состояние "карта не загружена" -->
    <div v-else-if="!mapStore.isLoaded" class="map-overlay">
      <div class="loading-spinner"></div>
      <p>Подготовка карты...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMapStore } from '../../stores/map.store.js'

const mapStore = useMapStore()
const mapRef = ref(null)

const initMapWithHandling = async () => {
  try {
    await mapStore.initMap(mapRef.value)
    
    if (mapStore.map) {
      // Добавляем обработчик кликов по карте
      mapStore.map.events.add('click', (e) => {
        const coords = e.get('coords')
        mapStore.addPlacemark(coords, {
          balloonContent: `
            <strong>Координаты:</strong><br>
            Широта: ${coords[0].toFixed(6)}<br>
            Долгота: ${coords[1].toFixed(6)}
          `,
          iconCaption: 'Новая метка'
        }, {
          preset: 'islands#greenDotIcon'
        })
      })
    }
  } catch (error) {
    console.error('Ошибка в компоненте карты:', error)
  }
}

const retryLoading = () => {
  mapStore.clearError()
  initMapWithHandling()
}

onMounted(() => {
  initMapWithHandling()
})

onUnmounted(() => {
  mapStore.destroyMap()
})
</script>

<style scoped>
.map-overlay {
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
  text-align: center;
  padding: 2rem;
}

.map-overlay.error {
  background: var(--bg-primary);
  color: var(--error-color);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-help {
  margin-top: 1rem;
  text-align: left;
  color: var(--text-secondary);
}

.error-help ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.error-help li {
  margin: 0.25rem 0;
}
</style>
