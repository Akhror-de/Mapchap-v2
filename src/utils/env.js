// src/utils/env.js
class EnvironmentManager {
  constructor() {
    this._validateNodeVersion()
    this._validateEnvironment()
  }

  _validateNodeVersion() {
    const nodeVersion = process.version
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
    
    if (majorVersion < 18) {
      console.warn('⚠️  Рекомендуется использовать Node.js 18 или выше')
    }
    
    console.log(`✅ Node.js ${nodeVersion} - совместим`)
  }

  _validateEnvironment() {
    const requiredEnvVars = [
      'VITE_YANDEX_MAPS_API_KEY'
    ]

    const missingVars = requiredEnvVars.filter(varName => {
      const value = import.meta.env[varName]
      return !value || value.includes('your_')
    })

    if (missingVars.length > 0) {
      console.error('❌ Отсутствуют обязательные переменные окружения:', missingVars)
      if (this.isProduction) {
        throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
      }
    }
  }

  get yandexMapsApiKey() {
    const key = import.meta.env.VITE_YANDEX_MAPS_API_KEY
    if (!key) {
      throw new Error('Yandex Maps API key is required')
    }
    return key
  }

  get apiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL || 
           (this.isDevelopment ? 'http://localhost:3001' : 'https://api.mapchap.com')
  }

  get isDevelopment() {
    return import.meta.env.DEV || import.meta.env.VITE_APP_ENV === 'development'
  }

  get isProduction() {
    return import.meta.env.PROD || import.meta.env.VITE_APP_ENV === 'production'
  }

  get nodeEnv() {
    return import.meta.env.MODE || 'development'
  }

  // Метод для безопасного получения переменных
  get(key, defaultValue = null) {
    return import.meta.env[key] || defaultValue
  }
}

// Создаем singleton instance
export const env = new EnvironmentManager()
