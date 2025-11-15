import axios from 'axios'

const API_BASE_URL = 'https://d5djdb4t6ohnfrpfaaic.ql6wied2.apigw.yandexcloud.net'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Уменьшаем таймаут для быстрого fallback
})

// Улучшенный сервис с надежным fallback
export const apiService = {
  async getOffers() {
    try {
      console.log('🔄 Fetching offers from API...')
      const response = await api.get('/ads')
      console.log('✅ API response:', response.data)
      return response.data
    } catch (error) {
      console.warn('❌ API недоступен, используем мок данные:', error.message)
      return this.getMockOffers()
    }
  },

  async createOffer(offerData) {
    try {
      console.log('🔄 Creating offer via API...')
      const response = await api.post('/ads', {
        name: offerData.title,
        description: offerData.description,
        category: offerData.category,
        lat: offerData.coords[0],
        lng: offerData.coords[1]
      })
      console.log('✅ Offer created:', response.data)
      return response.data
    } catch (error) {
      console.warn('❌ Не удалось создать предложение в API, создаем локально:', error.message)
      return this.createLocalOffer(offerData)
    }
  },

  getMockOffers() {
    return [
      {
        id: 1,
        name: '🍕 Пиццерия "Вкусно и Точка"',
        description: 'Свежая пицца и паста. Доставка 30 минут',
        category: 'food',
        lat: 55.751244,
        lng: 37.618423,
        likes: 15,
        views: 230,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '🎭 Кинотеатр "Октябрь"',
        description: 'Новые фильмы в комфортных залах',
        category: 'entertainment',
        lat: 55.753244,
        lng: 37.620423,
        likes: 8,
        views: 150,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: '🛍️ Магазин "Стильные вещи"',
        description: 'Модная одежда по доступным ценам',
        category: 'shopping',
        lat: 55.749244,
        lng: 37.616423,
        likes: 12,
        views: 180,
        createdAt: new Date().toISOString()
      }
    ]
  },

  createLocalOffer(offerData) {
    const localOffer = {
      id: Date.now(),
      name: offerData.title,
      description: offerData.description,
      category: offerData.category,
      lat: offerData.coords[0],
      lng: offerData.coords[1],
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString()
    }
    
    // Сохраняем в localStorage для сохранности между сессиями
    this.saveToLocalStorage(localOffer)
    
    return localOffer
  },

  saveToLocalStorage(offer) {
    try {
      const storedOffers = JSON.parse(localStorage.getItem('mapchap_local_offers') || '[]')
      storedOffers.push(offer)
      localStorage.setItem('mapchap_local_offers', JSON.stringify(storedOffers))
    } catch (error) {
      console.warn('Не удалось сохранить в localStorage:', error)
    }
  },

  getLocalOffers() {
    try {
      return JSON.parse(localStorage.getItem('mapchap_local_offers') || '[]')
    } catch (error) {
      return []
    }
  },

  // Метод для получения статистики (заглушка)
  async getStats() {
    try {
      // Пока возвращаем мок статистику
      return {
        totalOffers: 25,
        activeUsers: 142,
        views: 1250,
        newOffersToday: 3
      }
    } catch (error) {
      console.warn('Stats API недоступен:', error)
      return {
        totalOffers: 0,
        activeUsers: 0,
        views: 0,
        newOffersToday: 0
      }
    }
  }
}
