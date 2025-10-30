import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const favorites = ref(new Set())
  const isVerified = ref(false)

  const setUser = (userData) => {
    user.value = userData
  }

  const toggleFavorite = (offerId) => {
    if (favorites.value.has(offerId)) {
      favorites.value.delete(offerId)
    } else {
      favorites.value.add(offerId)
    }
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify([...favorites.value]))
  }

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      favorites.value = new Set(JSON.parse(saved))
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
