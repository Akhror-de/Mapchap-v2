<template>
  <div class="map-container">
    <div class="map-placeholder">
      <i class="fas fa-map-marked-alt"></i>
      <h3>Карта MapChap</h3>
      <p>Интеграция с Яндекс.Картами будет добавлена</p>
    </div>
  </div>
</template>

<script setup>
import { useMapStore } from '../../stores/map.store'

const mapStore = useMapStore()
</script>

<style scoped>
.map-container {
  flex: 1;
  background: var(--surface-bg);
  position: relative;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  text-align: center;
}
</style>
