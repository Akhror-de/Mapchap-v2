<!-- src/components/business/CreateAdForm.vue -->
<template>
  <div class="create-ad-form">
    <h3>Создание объявления</h3>
    
    <div v-if="offersStore.error" class="error-message">
      {{ offersStore.error }}
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Название заведения *</label>
        <input 
          v-model="form.name" 
          type="text" 
          placeholder="Введите название"
          required
        >
      </div>

      <div class="form-group">
        <label>Категория *</label>
        <select v-model="form.category" required>
          <option value="cafe">Кафе</option>
          <option value="shop">Магазин</option>
          <option value="restaurant">Ресторан</option>
          <option value="services">Услуги</option>
          <option value="entertainment">Развлечения</option>
          <option value="beauty">Красота</option>
        </select>
      </div>

      <div class="form-group">
        <label>Район *</label>
        <select v-model="form.district" required>
          <option value="center">Центр</option>
          <option value="north">Север</option>
          <option value="south">Юг</option>
        </select>
      </div>

      <div class="form-group">
        <label>Адрес *</label>
        <input 
          v-model="form.address" 
          type="text" 
          placeholder="Введите адрес"
          required
        >
      </div>

      <div class="form-group">
        <label>Описание предложения *</label>
        <textarea 
          v-model="form.description" 
          placeholder="Опишите ваше предложение"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label>Скидка (%) *</label>
        <input 
          v-model.number="form.discount" 
          type="number" 
          min="1" 
          max="99" 
          placeholder="10"
          required
        >
      </div>

      <div class="form-group">
        <label>Время работы</label>
        <input 
          v-model="form.time" 
          type="text" 
          placeholder="10:00-22:00"
        >
      </div>

      <div class="form-group">
        <label>Телефон</label>
        <input 
          v-model="form.phone" 
          type="tel" 
          placeholder="+79991234567"
        >
      </div>

      <button 
        class="submit-btn" 
        type="submit" 
        :disabled="offersStore.isLoading"
      >
        {{ offersStore.isLoading ? 'Создание...' : 'Создать объявление' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useOffersStore } from '../../stores/offers.store.js'

const offersStore = useOffersStore()

const form = reactive({
  name: '',
  category: 'cafe',
  district: 'center',
  address: '',
  description: '',
  discount: 10,
  time: '',
  phone: ''
})

const handleSubmit = async () => {
  try {
    const newOffer = await offersStore.createOffer(form)
    console.log('Объявление создано:', newOffer)
    
    // Очистка формы после успешного создания
    Object.assign(form, {
      name: '',
      category: 'cafe',
      district: 'center',
      address: '',
      description: '',
      discount: 10,
      time: '',
      phone: ''
    })
    
    // Можно показать уведомление об успехе
    alert('Объявление успешно создано!')
  } catch (error) {
    // Ошибка уже обработана в store
    console.error('Ошибка при создании:', error)
  }
}
</script>

<style scoped>
.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #fcc;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-primary);
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent-blue);
}

.submit-btn {
  width: 100%;
  background: var(--accent-blue);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-blue-dark);
}
</style>
