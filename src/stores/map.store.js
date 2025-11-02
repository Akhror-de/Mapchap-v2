import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const map = ref(null)
  const isLoaded = ref(false)
  
  // Убираем реактивные переменные для центра и зума
  // чтобы избежать лишних перерисовок

  const initMap = async (container) => {
    try {
      // Загружаем Яндекс.Карты
      await loadYmaps()
      
      // Создаем карту БЕЗ элементов управления Яндекс
      map.value = new ymaps.Map(container, {
        center: [55.751244, 37.618423], // Москва
        zoom: 10,
        controls: [], // Полностью убираем элементы управления Яндекс
        suppressMapOpenBlock: true,
        suppressObsoleteBrowserNotifier: true,
      })

      // Отключаем ненужные поведения
      map.value.behaviors.disable('scrollZoom')
      map.value.behaviors.disable('dblClickZoom')
      map.value.behaviors.disable('rightMouseButtonMagnifier')
      map.value.behaviors.disable('multiTouch')

      console.log('Карта Яндекс инициализирована (чистая версия)')
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

  const getZoom = () => {
    return map.value ? map.value.getZoom() : 10
  }

  const getCenter = () => {
    return map.value ? map.value.getCenter() : [55.751244, 37.618423]
  }

  const addPlacemark = (coordinates, properties = {}) => {
    if (map.value) {
      const placemark = new ymaps.Placemark(coordinates, properties, {
        preset: 'islands#blueIcon'
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

  return {
    map,
    isLoaded,
    initMap,
    destroyMap,
    setCenter,
    setZoom,
    getZoom,
    getCenter,
    addPlacemark,
    removeAllPlacemarks
  }
})
