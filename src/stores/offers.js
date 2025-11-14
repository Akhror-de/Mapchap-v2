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
        // Преобразуем данные из формата /ads в формат фронтенда
        this.offers = offers.map(offer => ({
          id: offer.id,
          title: offer.name || offer.title, // используем name из /ads
          description: offer.description || '',
          category: offer.category || 'other',
          coords: [offer.lat || 55.75, offer.lng || 37.61], // добавьте координаты если есть
          likes: offer.likes || 0,
          views: offer.views || 0,
          createdAt: offer.createdAt || new Date().toISOString(),
          properties: {
            hintContent: offer.name || offer.title,
            balloonContentHeader: offer.name || offer.title,
            balloonContentBody: offer.description || 'Описание отсутствует',
            balloonContentFooter: `Категория: ${this.getCategoryLabel(offer.category)}`
          }
        }))
      } catch (error) {
        this.error = error.message
        console.error('Ошибка загрузки предложений:', error)
        // Fallback на мок данные
        this.offers = this.getMockOffers()
      } finally {
        this.loading = false
      }
    },
    
    async addOffer(offerData) {
      try {
        // Преобразуем данные для /ads endpoint
        const adData = {
          name: offerData.title,
          description: offerData.description,
          category: offerData.category,
          lat: offerData.coords[0],
          lng: offerData.coords[1]
          // добавьте другие поля если нужно
        }
        
        const newAd = await apiService.createOffer(adData)
        
        // Преобразуем ответ обратно во фронтенд формат
        const newOffer = {
          id: newAd.id,
          title: newAd.name,
          description: newAd.description,
          category: newAd.category,
          coords: [newAd.lat, newAd.lng],
          likes: 0,
          views: 0,
          createdAt: newAd.createdAt || new Date().toISOString(),
          properties: {
            hintContent: newAd.name,
            balloonContentHeader: newAd.name,
            balloonContentBody: newAd.description || 'Описание отсутствует',
            balloonContentFooter: `Категория: ${this.getCategoryLabel(newAd.category)}`
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
      return [
        {
          id: '1',
          title: 'Тестовое предложение',
          description: 'Это тестовое предложение',
          category: 'food',
          coords: [55.751244, 37.618423],
          likes: 5,
          views: 100,
          properties: {
            hintContent: 'Тестовое предложение',
            balloonContentHeader: 'Тестовое предложение',
            balloonContentBody: 'Это тестовое предложение',
            balloonContentFooter: 'Категория: 🍕 Еда'
          }
        }
      ]
    }
  }
})
