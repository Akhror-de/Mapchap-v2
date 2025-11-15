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
      this.error = null
      
      try {
        // Получаем предложения из API
        const apiOffers = await apiService.getOffers()
        
        // Получаем локальные предложения из localStorage
        const localOffers = apiService.getLocalOffers()
        
        // Объединяем и убираем дубликаты
        const allOffers = [...apiOffers, ...localOffers]
        const uniqueOffers = this.removeDuplicates(allOffers)
        
        this.offers = uniqueOffers.map(offer => ({
          id: offer.id,
          title: offer.name || offer.title,
          description: offer.description || '',
          category: offer.category || 'other',
          coords: [offer.lat || 55.75, offer.lng || 37.61],
          likes: offer.likes || 0,
          views: offer.views || 0,
          createdAt: offer.createdAt || new Date().toISOString()
        }))
        
      } catch (error) {
        this.error = error.message
        console.error('Ошибка загрузки предложений:', error)
        // Используем только мок данные как последний резерв
        this.offers = this.getMockOffers()
      } finally {
        this.loading = false
      }
    },
    
    async addOffer(offerData) {
      try {
        const newOffer = await apiService.createOffer(offerData)
        
        // Форматируем для фронтенда
        const frontendOffer = {
          id: newOffer.id,
          title: newOffer.name || newOffer.title,
          description: newOffer.description,
          category: newOffer.category,
          coords: [newOffer.lat, newOffer.lng],
          likes: newOffer.likes || 0,
          views: newOffer.views || 0,
          createdAt: newOffer.createdAt || new Date().toISOString()
        }
        
        // Добавляем в store
        this.offers.unshift(frontendOffer)
        return frontendOffer
        
      } catch (error) {
        this.error = error.message
        console.error('Ошибка добавления предложения:', error)
        throw error
      }
    },
    
    removeDuplicates(offers) {
      const seen = new Set()
      return offers.filter(offer => {
        const key = `${offer.id}-${offer.lat}-${offer.lng}`
        if (seen.has(key)) {
          return false
        }
        seen.add(key)
        return true
      })
    },
    
    getMockOffers() {
      return [
        {
          id: 1,
          title: '🍕 Пиццерия "Вкусно и Точка"',
          description: 'Свежая пицца и паста. Доставка 30 минут',
          category: 'food',
          coords: [55.751244, 37.618423],
          likes: 15,
          views: 230
        }
      ]
    }
  }
})
