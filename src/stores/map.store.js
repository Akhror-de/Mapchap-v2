import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const map = ref(null)
  const center = ref([55.751244, 37.618423]) // Москва
  const zoom = ref(10)
  const isLoaded = ref(false)

  const initMap = async (container) => {
    try {
      // Загружаем Яндекс.Карты
      await loadYmaps()
      
      // Создаем карту
      map.value = new ymaps.Map(container, {
        center: center.value,
        zoom: zoom.value,
        controls: []
      })

      // Добавляем базовые элементы управления
      map.value.controls.add('zoomControl')
      map.value.controls.add('geolocationControl')
      
      // Подписываемся на события
      map.value.events.add('boundschange', (e) => {
        center.value = e.get('newCenter')
        zoom.value = e.get('newZoom')
      })

      isLoaded.value = true
      
    } catch (error) {
      console.error('Ошибка инициализации карты:', error)
    }
  }

  const loadYmaps = () => {
    return new Promise((resolve, reject) => {
      if (window.ymaps) {
        window.ymaps.ready(resolve)
        return
      }

      const script = document.createElement('script')
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=07b74146-5f5a-46bf-a2b1-cf6d052a41bb&lang=ru_RU`
      script.onload = () => window.ymaps.ready(resolve)
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const destroyMap = () => {
    if (map.value) {
      map.value.destroy()
      map.value = null
    }
  }

  const setCenter = (coordinates) => {
    if (map.value) {
      map.value.setCenter(coordinates)
    }
  }

  const setZoom = (newZoom) => {
    if (map.value) {
      map.value.setZoom(newZoom)
    }
  }

  return {
    map,
    center,
    zoom,
    isLoaded,
    initMap,
    destroyMap,
    setCenter,
    setZoom
  }
})
