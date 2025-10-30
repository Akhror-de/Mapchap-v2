import { ref } from 'vue'
import { useMapStore } from '../stores/map.store'

export function useGeolocation() {
  const mapStore = useMapStore()
  const isLocating = ref(false)
  const error = ref(null)

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        error.value = 'Геолокация не поддерживается вашим браузером'
        reject(new Error(error.value))
        return
      }

      isLocating.value = true
      error.value = null

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [
            position.coords.latitude,
            position.coords.longitude
          ]
          
          mapStore.setUserLocation(location)
          isLocating.value = false
          resolve(location)
        },
        (err) => {
          isLocating.value = false
          error.value = this.getErrorMessage(err.code)
          reject(err)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  const getErrorMessage = (code) => {
    switch (code) {
      case 1:
        return 'Доступ к геолокации запрещен. Разрешите доступ в настройках браузера.'
      case 2:
        return 'Не удалось определить местоположение. Проверьте подключение к интернету.'
      case 3:
        return 'Время ожидания определения местоположения истекло.'
      default:
        return 'Произошла неизвестная ошибка при определении местоположения.'
    }
  }

  return {
    getUserLocation,
    isLocating,
    error
  }
}
