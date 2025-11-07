// src/stores/offers.store.js
import { defineStore } from 'pinia'
import { apiService } from '../services/api.service.js'

export const useOffersStore = defineStore('offers', {
  state: () => ({
    offers: [],
    currentDistrict: 'all',
    selectedOffer: null,
    isLoading: false,
    error: null
  }),

  getters: {
    filteredOffers: (state) => {
      if (state.currentDistrict === 'all') return state.offers
      return state.offers.filter(offer => offer.district === state.currentDistrict)
    }
  },

  actions: {
    async fetchOffers(filters = {}) {
      this.isLoading = true
      this.error = null
      try {
        this.offers = await apiService.getOffers(filters)
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch offers:', error)
      } finally {
        this.isLoading = false
      }
    },

    async createOffer(offerData) {
      this.isLoading = true
      this.error = null
      try {
        const newOffer = await apiService.createOffer(offerData)
        this.offers.push(newOffer)
        return newOffer
      } catch (error) {
        this.error = error.message
        console.error('Failed to create offer:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchOfferById(id) {
      try {
        this.selectedOffer = await apiService.getOfferById(id)
        return this.selectedOffer
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch offer:', error)
        throw error
      }
    },

    setDistrict(district) {
      this.currentDistrict = district
    },

    clearError() {
      this.error = null
    }
  }
})

// Добавьте этот метод в off
async deleteOffer(id) {
  this.isLoading = true
  this.error = null
  try {
    // Моковая реализация - удаляем из локального состояния
    this.offers = this.offers.filter(offer => offer.id !== id)
    return true
  } catch (error) {
    this.error = error.message
    console.error('Failed to delete offer:', error)
    throw error
  } finally {
    this.isLoading = false
  }
}
  this.isLoading = true
  this.error = null
  try {
    // Пока используем моковый DELETE - потом заменим на реальный API
    // await apiService.request(`/ads/${id}`, { method: 'DELETE' })
    
    // Моковая реализация - удаляем из локального состояния
    this.offers = this.offers.filter(offer => offer.id !== id)
    return true
  } catch (error) {
    this.error = error.message
    console.error('Failed to delete offer:', error)
    throw error
  } finally {
    this.isLoading = false
  }
}
