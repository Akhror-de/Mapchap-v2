import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useOffersStore = defineStore('offers', {
  state: () => ({
    offers: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchOffers(filters = {}) {
      this.loading = true
      this.error = null
      
      try {
        const params = new URLSearchParams()
        if (filters.category) params.append('category', filters.category)
        if (filters.lat) params.append('lat', filters.lat)
        if (filters.lng) params.append('lng', filters.lng)
        if (filters.radius) params.append('radius', filters.radius)
        
        const response = await api.get(`/offers?${params}`)
        this.offers = response.data.map(offer => ({
          id: offer._id,
          title: offer.title,
          description: offer.description,
          category: offer.category,
          coords: [offer.lat, offer.lng],
          userId: offer.userId,
          userName: offer.userName,
          likes: offer.likes,
          views: offer.views,
          createdAt: offer.createdAt,
          properties: {
            hintContent: offer.title,
            balloonContentHeader: offer.title,
            balloonContentBody: offer.description || 'Описание отсутствует',
            balloonContentFooter: `Категория: ${this.getCategoryLabel(offer.category)}`
          }
        }))
      } catch (error) {
        this.error = error.message
        console.error('Ошибка загрузки предложений:', error)
        
        // Fallback: мок данные если бэкенд недоступен
        if (error.response?.status >= 500) {
          this.offers = this.getMockOffers()
        }
      } finally {
        this.loading = false
      }
    },
    
    async addOffer(offerData) {
      try {
        const response = await api.post('/offers', {
          title: offerData.title,
          description: offerData.description,
          category: offerData.category,
          lat: offerData.coords[0],
          lng: offerData.coords[1],
          userId: offerData.userId || 'telegram_user',
          userName: offerData.userName || 'Telegram User'
        })
        
        const newOffer = {
          id: response.data._id,
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
          coords: [response.data.lat, response.data.lng],
          userId: response.data.userId,
          userName: response.data.userName,
          likes: response.data.likes,
          views: response.data.views,
          createdAt: response.data.createdAt,
          properties: {
            hintContent: response.data.title,
            balloonContentHeader: response.data.title,
            balloonContentBody: response.data.description || 'Описание отсутствует',
            balloonContentFooter: `Категория: ${this.getCategoryLabel(response.data.category)}`
          }
        }
        
        this.offers.unshift(newOffer)
        return newOffer
        
      } catch (error) {
        this.error = error.message
        console.error('Ошибка добавления предложения:', error)
        throw error
      }
    },
    
    async likeOffer(offerId) {
      try {
        const offer = this.offers.find(o => o.id === offerId)
        if (!offer) return
        
        const newLikes = offer.likes + 1
        await api.patch(`/offers/${offerId}`, { likes: newLikes })
        
        offer.likes = newLikes
      } catch (error) {
        console.error('Ошибка лайка:', error)
        // В оффлайн-режиме просто обновляем локально
        const offer = this.offers.find(o => o.id === offerId)
        if (offer) offer.likes += 1
      }
    },
    
    getCategoryLabel(category) {
      const labels = {
        food: '🍕 Еда',
        entertainment: '🎭 Развлечения',
        shopping: '🛍️ Покупки',
        services: '🔧 Услуги',
        other: '❓ Другое'
      }
      return labels[category] || category
    },
    
    getMockOffers() {
      // Мок данные для разработки
      return [
        {
          id: '1',
          title: 'Пример предложения 1',
          description: 'Это тестовое предложение',
          category: 'food',
          coords: [55.751244, 37.618423],
          likes: 5,
          views: 100,
          properties: {
            hintContent: 'Пример предложения 1',
            balloonContentHeader: 'Пример предложения 1',
            balloonContentBody: 'Это тестовое предложение',
            balloonContentFooter: 'Категория: 🍕 Еда'
          }
        }
      ]
    }
  }
})
