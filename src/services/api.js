import axios from 'axios'

const API_BASE_URL = 'https://d5djdb4t6ohnfrpfaaic.ql6wied2.apigw.yandexcloud.net'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const apiService = {
  async getOffers() {
    try {
      const response = await api.get('/ads')
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      return [{
        id: 1,
        name: 'Тестовое предложение',
        description: 'Описание теста',
        category: 'food',
        lat: 55.751244,
        lng: 37.618423,
        likes: 5,
        views: 100,
        createdAt: new Date().toISOString()
      }]
    }
  },

  async createOffer(offerData) {
    try {
      const response = await api.post('/ads', {
        name: offerData.title,
        description: offerData.description,
        category: offerData.category,
        lat: offerData.coords[0],
        lng: offerData.coords[1]
      })
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      return {
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
    }
  },

  // ДОБАВЛЕН МЕТОД ДЛЯ ЛАЙКОВ
  async likeOffer(offerId) {
    try {
      const response = await api.post(`/ads/${offerId}/like`)
      return response.data
    } catch (error) {
      console.error('API Like Error:', error)
      throw error
    }
  },

  // ДОБАВЛЕН МЕТОД ДЛЯ СТАТИСТИКИ
  async getStats() {
    try {
      const response = await api.get('/stats')
      return response.data
    } catch (error) {
      console.error('API Stats Error:', error)
      return { totalOffers: 0, activeUsers: 0, totalLikes: 0, totalViews: 0 }
    }
  }
}
