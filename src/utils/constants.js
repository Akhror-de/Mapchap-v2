export const CONFIG = {
  YANDEX_MAP_KEY: process.env.VITE_YANDEX_MAP_KEY || 'demo_key',
  API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://api.mapchap.com',
  DEFAULT_MAP_CENTER: [55.7558, 37.6173],
  DEFAULT_ZOOM: 12
}

export const DISTRICT_OPTIONS = [
  { value: 'all', label: 'Все районы' },
  { value: 'center', label: 'Центр' },
  { value: 'north', label: 'Север' },
  { value: 'south', label: 'Юг' }
]

export const CATEGORIES = {
  CAFE: 'cafe',
  SHOP: 'shop',
  SERVICES: 'services',
  BEAUTY: 'beauty'
}
