<template>
  <div class="create-ad-form">
    <h3>Создание объявления</h3>
    <div class="form-group">
      <label>Название заведения</label>
      <input type="text" placeholder="Введите название">
    </div>
    <div class="form-group">
      <label>Описание предложения</label>
      <textarea placeholder="Опишите ваше предложение"></textarea>
    </div>
    <button class="submit-btn">Создать объявление</button>
  </div>
</template>

<script setup>
// Create Ad Form Component
</script>

<style scoped>
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-primary);
}

.submit-btn {
  width: 100%;
  background: var(--accent-blue);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
