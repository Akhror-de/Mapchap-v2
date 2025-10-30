<template>
  <div class="bottom-sheet">
    <div class="bottom-sheet-handle"></div>
    <div class="bottom-sheet-content">
      <h3>Предложения по районам</h3>
      <p>Список предложений будет здесь</p>
    </div>
  </div>
</template>

<script setup>
// Bottom Sheet Component
</script>

<style scoped>
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface-bg);
  border-top: 1px solid var(--border-color);
  padding: 16px;
  border-radius: 20px 20px 0 0;
}

.bottom-sheet-handle {
  width: 40px;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  margin: 0 auto 16px;
}
</style>
