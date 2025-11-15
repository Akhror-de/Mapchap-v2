import { defineStore } from 'pinia'
import { apiService } from '@/services/api'

export const useOffersStore = defineStore('offers', {
  state: () => ({
    offers: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchOffers() {
      this.loading = true
      try {
        const offers = await apiService.getOffers()
        this.offers = offers.map(offer => ({
          id: offer.id,
          title: offer.name,
          description: offer.description,
          category: offer.category,
          coords: [offer.lat, offer.lng],
          likes: offer.likes || 0,
          views: offer.views || 0,
          createdAt: offer.createdAt
        }))
      } catch (error) {
        this.error = error.message
        console.error('Ошибка загрузки предложений:', error)
        this.offers = this.getMockOffers()
      } finally {
        this.loading = false
      }
    },
    
    async addOffer(offerData) {
      try {
        const newOffer = await apiService.createOffer(offerData)
        const formattedOffer = {
          id: newOffer.id,
          title: newOffer.name,
          description: newOffer.description,
          category: newOffer.category,
          coords: [newOffer.lat, newOffer.lng],
          likes: newOffer.likes || 0,
          views: newOffer.views || 0,
          createdAt: newOffer.createdAt
        }
        this.offers.unshift(formattedOffer)
        return formattedOffer
      } catch (error) {
        this.error = error.message
        console.error('Ошибка добавления предложения:', error)
        throw error
      }
    },
    
    // ДОБАВЛЕН МЕТОД ДЛЯ ЛАЙКОВ
    async likeOffer(offerId) {
      try {
        const updatedOffer = await apiService.likeOffer(offerId)
        const offerIndex = this.offers.findIndex(offer => offer.id === offerId)
        if (offerIndex !== -1) {
          this.offers[offerIndex].likes = updatedOffer.likes
        }
        return updatedOffer
      } catch (error) {
        console.error('Ошибка лайка:', error)
        throw error
      }
    },
    
    // ДОБАВЛЕН МЕТОД ДЛЯ СТАТИСТИКИ
    async fetchStats() {
      try {
        return await apiService.getStats()
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error)
        return { totalOffers: 0, activeUsers: 0, totalLikes: 0, totalViews: 0 }
      }
    },
    
    getMockOffers() {
      return [{
        id: 1,
        title: 'Тестовое предложение',
        description: 'Это тестовое предложение для разработки',
        category: 'food',
        coords: [55.751244, 37.618423],
        likes: 5,
        views: 100
      }]
    }
  }
})
