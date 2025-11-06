// src/stores/user.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService } from '../services/api.service.js'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const favorites = ref(new Set())
  const isVerified = ref(false)

  const setUser = (userData) => {
    user.value = userData
  }

  const toggleFavorite = async (offerId) => {
    try {
      if (favorites.value.has(offerId)) {
        await apiService.request(`/favorites?user_id=${user.value?.id}&offer_id=${offerId}`, {
          method: 'DELETE'
        })
        favorites.value.delete(offerId)
      } else {
        await apiService.request('/favorites', {
          method: 'POST',
          body: JSON.stringify({ 
            user_id: user.value?.id, 
            offer_id: offerId 
          })
        })
        favorites.value.add(offerId)
      }
      
      // Сохраняем в localStorage
      localStorage.setItem('favorites', JSON.stringify([...favorites.value]))
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      throw error
    }
  }

  const loadFavorites = async () => {
    try {
      if (user.value?.id) {
        const userFavorites = await apiService.request(`/favorites?user_id=${user.value.id}`)
        favorites.value = new Set(userFavorites.map(fav => fav.offer_id))
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('favorites')
        if (saved) {
          favorites.value = new Set(JSON.parse(saved))
        }
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
      // Fallback to localStorage
      const saved = localStorage.getItem('favorites')
      if (saved) {
        favorites.value = new Set(JSON.parse(saved))
      }
    }
  }

  const isFavorite = (offerId) => {
    return favorites.value.has(offerId)
  }

  return {
    user,
    favorites,
    isVerified,
    setUser,
    toggleFavorite,
    loadFavorites,
    isFavorite
  }
})
