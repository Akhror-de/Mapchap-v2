import axios from 'axios'

const API_BASE_URL = 'https://d5djdb4t6ohnfrpfaaic.ql6wied2.apigw.yandexcloud.net'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Адаптируем запросы под существующие endpoint'ы
export const apiService = {
  // Получить все предложения
  async getOffers() {
    const response = await api.get('/ads')
    return response.data
  },

  // Создать предложение
  async createOffer(offerData) {
    const response = await api.post('/ads', offerData)
    return response.data
  },

  // Проверить здоровье API
  async healthCheck() {
    const response = await api.get('/')
    return response.data
  }
}
