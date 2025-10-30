export const CONFIG = {
  YANDEX_MAP_KEY: process.env.VITE_YANDEX_MAP_KEY || 'demo_key',
  API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://api.mapchap.com',
  DEFAULT_MAP_CENTER: [55.7558, 37.6173], // Москва
  DEFAULT_ZOOM: 12,
  MAX_ZOOM: 18,
  MIN_ZOOM: 10
}

// ... остальные константы
