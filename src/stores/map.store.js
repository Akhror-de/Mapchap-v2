import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const map = ref(null)
  const userLocation = ref(null)
  const currentZoom = ref(12)
  const currentCenter = ref([55.7558, 37.6173])
  const isMapReady = ref(false)

  const setMap = (mapInstance) => {
    map.value = mapInstance
    isMapReady.value = true
    
    // Следим за изменением зума и центра
    mapInstance.events.add('boundschange', () => {
      currentZoom.value = mapInstance.getZoom()
      currentCenter.value = mapInstance.getCenter()
    })
  }

  const setUserLocation = (location) => {
    userLocation.value = location
  }

  const setCenter = (coordinates, zoom = null) => {
    if (map.value) {
      if (zoom) {
        map.value.setCenter(coordinates, zoom)
      } else {
        map.value.setCenter(coordinates)
      }
      currentCenter.value = coordinates
    }
  }

  const setZoom = (zoom) => {
    if (map.value) {
      map.value.setZoom(zoom)
      currentZoom.value = zoom
    }
  }

  return {
    map,
    userLocation,
    currentZoom,
    currentCenter,
    isMapReady,
    setMap,
    setUserLocation,
    setCenter,
    setZoom
  }
})
