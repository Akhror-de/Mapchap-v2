// src/stores/map.store.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const map = ref(null)
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  const initMap = async (container) => {
    try {
      isLoading.value = true
      error.value = null
      
      await loadYmaps()
      
      if (!container) {
        throw new Error('Map container not found')
      }
      
      map.value = new ymaps.Map(container, {
        center: [55.751244, 37.618423],
        zoom: 10,
        controls: [],
        suppressMapOpenBlock: true,
        suppressObsoleteBrowserNotifier: true,
      })

      // Отключаем ненужные поведения
      map.value.behaviors.disable('scrollZoom')
      map.value.behaviors.disable('dblClickZoom')
      map.value.behaviors.disable('rightMouseButtonMagnifier')
      map.value.behaviors.disable('multiTouch')

      console.log('✅ Яндекс.Карты инициализированы')
      isLoaded.value = true
      isLoading.value = false
      
    } catch (err) {
      console.error('❌ Ошибка инициализации карты:', err)
      error.value = err.message
      isLoading.value = false
      isLoaded.value = false
    }
  }

  const loadYmaps = () => {
    return new Promise((resolve, reject) => {
      // Используем API ключ из переменной окружения Vite
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY
      
      if (!apiKey || apiKey === 'your_yandex_maps_api_key_here') {
        reject(new Error('Yandex Maps API key is not configured. Please check your .env file'))
        return
      }

      if (window.ymaps) {
        window.ymaps.ready(resolve)
        return
      }

      const script = document.createElement('script')
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
      script.onload = () => {
        console.log('✅ Яндекс.Карты API загружены')
        window.ymaps.ready(resolve)
      }
      script.onerror = () => {
        const error = new Error('Failed to load Yandex Maps API')
        console.error('❌', error)
        reject(error)
      }
      document.head.appendChild(script)
    })
  }

  const destroyMap = () => {
    if (map.value) {
      map.value.destroy()
      map.value = null
      isLoaded.value = false
    }
  }

  const setCenter = (coordinates) => {
    if (map.value) {
      map.value.setCenter(coordinates)
    }
  }

  const setZoom = (newZoom) => {
    if (map.value) {
      map.value.setZoom(Math.min(Math.max(newZoom, 1), 19))
    }
  }

  const getZoom = () => {
    return map.value ? map.value.getZoom() : 10
  }

  const getCenter = () => {
    return map.value ? map.value.getCenter() : [55.751244, 37.618423]
  }

  const addPlacemark = (coordinates, properties = {}, options = {}) => {
    if (map.value) {
      const placemark = new ymaps.Placemark(coordinates, properties, {
        preset: 'islands#blueIcon',
        ...options
      })
      map.value.geoObjects.add(placemark)
      return placemark
    }
  }

  const removeAllPlacemarks = () => {
    if (map.value) {
      map.value.geoObjects.removeAll()
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    map,
    isLoaded,
    isLoading,
    error,
    initMap,
    destroyMap,
    setCenter,
    setZoom,
    getZoom,
    getCenter,
    addPlacemark,
    removeAllPlacemarks,
    clearError
  }
})
