<template>
  <div id="app" style="padding: 20px; font-family: sans-serif;">
    <h1 style="color: #007bff;">🗺️ MapChap - Тестирование компонентов</h1>
    
    <div style="margin: 20px 0; padding: 15px; background: #f0f8ff; border-radius: 8px;">
      <h3>Тест компонентов:</h3>
      <button @click="testVue" style="padding: 10px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 5px;">
        Тест Vue
      </button>
      <button @click="testMapStore" style="padding: 10px; margin: 5px; background: #28a745; color: white; border: none; border-radius: 5px;">
        Тест Map Store
      </button>
    </div>

    <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; margin-top: 20px;">
      <h4>Статус:</h4>
      <p>Vue: <span id="vue-status">❌ Не тестировалось</span></p>
      <p>Map Store: <span id="map-store-status">❌ Не тестировалось</span></p>
      <p>API Key: <span id="api-key-status">❌ Не проверен</span></p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMapStore } from './stores/map.store'

const mapStore = useMapStore()

const testVue = () => {
  document.getElementById('vue-status').textContent = '✅ Работает'
  alert('Vue reactivity works! 🎉')
}

const testMapStore = async () => {
  try {
    document.getElementById('map-store-status').textContent = '⏳ Тестирование...'
    
    // Простой тест store
    mapStore.setCenter([55.751244, 37.618423])
    
    setTimeout(() => {
      document.getElementById('map-store-status').textContent = '✅ Store работает'
    }, 500)
    
  } catch (error) {
    document.getElementById('map-store-status').textContent = `❌ Ошибка: ${error.message}`
  }
}

const checkApiKey = () => {
  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY
  if (apiKey && apiKey !== 'your_yandex_maps_api_key_here') {
    document.getElementById('api-key-status').textContent = '✅ Настроен'
  } else {
    document.getElementById('api-key-status').textContent = '❌ Не настроен'
  }
}

onMounted(() => {
  console.log('✅ App.vue mounted')
  checkApiKey()
})
</script>
