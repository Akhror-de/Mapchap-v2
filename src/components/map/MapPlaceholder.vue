<template>
  <div class="map-placeholder">
    <div class="placeholder-content">
      <i class="fas fa-map-marked-alt"></i>
      <h3>Загрузка карты...</h3>
      <p>Инициализация Яндекс.Карт</p>
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Map Placeholder Component
</script>

<style scoped>
.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--surface-bg);
  color: var(--text-secondary);
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.placeholder-content i {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.placeholder-content h3 {
  margin-bottom: 8px;
  color: var(--text-primary);
}

.loading-dots {
  display: flex;
  gap: 4px;
  margin-top: 16px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-blue);
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}
</style>
