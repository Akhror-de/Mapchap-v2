// src/services/api.service.js
class ApiService {
  constructor() {
    this.baseURL = 'https://d5djdb4t6ohnfrpfaaic.ql6wied2.apigw.yandexcloud.net'
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Получить все объявления
  async getOffers(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/ads${query ? `?${query}` : ''}`)
  }

  // Создать объявление
  async createOffer(offerData) {
    return this.request('/ads', {
      method: 'POST',
      body: JSON.stringify(offerData)
    })
  }

  // Получить объявление по ID
  async getOfferById(id) {
    return this.request(`/ads/${id}`)
  }

  // Получить статистику
  async getOfferStats(id) {
    return this.request(`/ads/${id}/stats`)
  }
}

export const apiService = new ApiService()
