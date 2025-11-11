<template>
  <div class="panel-overlay" @click.self="$emit('close')">
    <div class="panel">
      <div class="panel-header">
        <h2>Бизнес-панель</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="panel-content">
        <p>Здесь будет управление бизнес-предложениями</p>
        <button class="add-btn">Добавить предложение</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessPanel'
}
</script>

<style scoped>
.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: flex-end;
}

.panel {
  width: 90%;
  max-width: 400px;
  height: 100%;
  background: white;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.panel-content {
  padding: 20px;
}

.add-btn {
  width: 100%;
  padding: 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
