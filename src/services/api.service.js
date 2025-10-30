class ApiService {
  constructor() {
    this.baseURL = 'https://api.mapchap.com'
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
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async getOffers() {
    return this.request('/offers')
  }

  async createAd(adData) {
    return this.request('/ads', {
      method: 'POST',
      body: JSON.stringify(adData)
    })
  }
}

export const apiService = new ApiService()
