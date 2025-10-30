<template>
  <div class="controls-container">
    <button class="control-btn" @click="$emit('zoom-in')" title="Увеличить">
      <i class="fas fa-plus"></i>
    </button>
    <button class="control-btn" @click="$emit('zoom-out')" title="Уменьшить">
      <i class="fas fa-minus"></i>
    </button>
    <button class="control-btn location-btn" @click="$emit('locate')" title="Мое местоположение">
      <i class="fas fa-location-crosshairs"></i>
    </button>
    <button class="control-btn refresh-btn" @click="$emit('refresh')" title="Обновить карту">
      <i class="fas fa-refresh"></i>
    </button>
  </div>
</template>

<script setup>
defineEmits(['zoom-in', 'zoom-out', 'locate', 'refresh'])
</script>

<style scoped>
.controls-container {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1000;
  background: rgba(26, 26, 26, 0.9);
  padding: 8px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
}

.control-btn {
  width: 40px;
  height: 40px;
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: var(--accent-blue);
  transform: translateY(-1px);
}

.location-btn:hover {
  background: var(--accent-green);
}

.refresh-btn:hover {
  background: var(--accent-orange);
}
</style>
