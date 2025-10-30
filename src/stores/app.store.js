import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const theme = ref('dark')
  const isLoading = ref(false)
  const loadingMessage = ref('')
  const activePanel = ref(null)
  const notification = ref(null)

  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    document.body.setAttribute('data-theme', newTheme)
  }

  const setLoading = (loading, message = '') => {
    isLoading.value = loading
    loadingMessage.value = message
  }

  const setActivePanel = (panel) => {
    activePanel.value = panel
  }

  const showNotification = (notif) => {
    notification.value = notif
  }

  // Initialize theme from localStorage
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }

  return {
    theme,
    isLoading,
    loadingMessage,
    activePanel,
    notification,
    setTheme,
    setLoading,
    setActivePanel,
    showNotification,
    initTheme
  }
})
