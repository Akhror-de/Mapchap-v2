<template>
  <div id="app" :data-theme="theme">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">🗺️ MapChap</h1>
        <div class="header-actions">
          <button class="btn btn-secondary" @click="toggleTheme">
            {{ theme === 'light' ? '🌙' : '☀️' }}
          </button>
          <button class="btn btn-secondary" @click="showProfile">
            👤
          </button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <!-- Контейнер карты -->
      <div class="map-section">
        <MapContainer />
        <MapControls />
      </div>
      
      <!-- Нижняя панель с предложениями -->
      <BottomSheet />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MapContainer from '@/components/map/MapContainer.vue'
import MapControls from '@/components/map/MapControls.vue'
import BottomSheet from '@/components/common/BottomSheet.vue'

const theme = ref('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const showProfile = () => {
  // Будет реализовано позже
  console.log('Открыть профиль')
}
</script>

<style scoped>
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
}

.map-section {
  flex: 1;
  position: relative;
  height: 100%;
}
</style>
