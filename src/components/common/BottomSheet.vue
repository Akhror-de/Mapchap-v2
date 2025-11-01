<template>
  <div class="bottom-sheet" :class="{ expanded: isExpanded }">
    <div class="sheet-handle" @click="toggleSheet">
      <div class="handle-bar"></div>
    </div>
    <div class="sheet-content">
      <h3>🎯 Предложения поблизости</h3>
      <div class="offers-list">
        <div v-for="offer in sampleOffers" :key="offer.id" class="offer-card">
          <div class="offer-header">
            <h4>{{ offer.title }}</h4>
            <span class="offer-distance">{{ offer.distance }} м</span>
          </div>
          <p class="offer-description">{{ offer.description }}</p>
          <div class="offer-footer">
            <span class="offer-price">{{ offer.price }}</span>
            <span class="offer-category">{{ offer.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isExpanded = ref(false)

const toggleSheet = () => {
  isExpanded.value = !isExpanded.value
}

// Пример данных - позже заменим на реальные
const sampleOffers = ref([
  {
    id: 1,
    title: 'Кофе со скидкой 50%',
    description: 'Вкусный кофе всего за 150 рублей',
    distance: 250,
    price: '150 ₽',
    category: 'Еда'
  },
  {
    id: 2,
    title: 'Скидка в магазине одежды',
    description: 'Распродажа осенней коллекции',
    distance: 500,
    price: 'до -70%',
    category: 'Одежда'
  },
  {
    id: 3,
    title: 'Бесплатная доставка',
    description: 'Заказы от 1000 рублей',
    distance: 800,
    price: 'Бесплатно',
    category: 'Доставка'
  }
])
</script>

<style scoped>
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(calc(100% - 80px));
  transition: transform 0.3s ease;
  z-index: 1000;
  max-height: 70vh;
}

.bottom-sheet.expanded {
  transform: translateY(0);
}

.sheet-handle {
  padding: 12px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
}

.handle-bar {
  width: 40px;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
}

.sheet-content {
  padding: 20px;
  max-height: calc(70vh - 60px);
  overflow-y: auto;
}

.sheet-content h3 {
  margin-bottom: 16px;
  color: var(--text-primary);
}

.offers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.offer-card {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-secondary);
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.offer-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.offer-distance {
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.offer-description {
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-size: 0.875rem;
}

.offer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.offer-price {
  font-weight: 600;
  color: var(--primary-color);
}

.offer-category {
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
}
</style>
