// src/utils/env.js
export const env = {
  // Яндекс.Карты
  get yandexMapsApiKey() {
    const key = import.meta.env.VITE_YANDEX_MAPS_API_KEY
    if (!key || key === 'your_yandex_maps_api_key_here') {
      throw new Error('Yandex Maps API key is not configured. Please check your .env file')
    }
    return key
  },

  // Базовый URL API
  get apiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL || 'https://api.mapchap.com'
  },

  // Режим разработки
  get isDevelopment() {
    return import.meta.env.DEV
  },

  // Режим продакшена
  get isProduction() {
    return import.meta.env.PROD
  }
}

// Валидация окружения при запуске
export const validateEnvironment = () => {
  const errors = []

  if (!import.meta.env.VITE_YANDEX_MAPS_API_KEY) {
    errors.push('VITE_YANDEX_MAPS_API_KEY is not set')
  }

  if (errors.length > 0) {
    console.error('❌ Environment configuration errors:', errors)
    if (import.meta.env.PROD) {
      throw new Error(`Environment misconfiguration: ${errors.join(', ')}`)
    }
  } else {
    console.log('✅ Environment configuration is valid')
  }
}
