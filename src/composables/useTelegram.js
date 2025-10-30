import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user.store'

export function useTelegram() {
  const userStore = useUserStore()
  const tg = ref(null)
  const isInitialized = ref(false)

  const init = () => {
    if (window.Telegram?.WebApp) {
      tg.value = window.Telegram.WebApp
      tg.value.expand()
      tg.value.enableClosingConfirmation()
      
      // Initialize user data
      const userData = tg.value.initDataUnsafe?.user
      if (userData) {
        userStore.setUser(userData)
      }
      
      // Set theme based on Telegram
      if (tg.value.colorScheme === 'light') {
        document.body.setAttribute('data-theme', 'light')
      }
      
      isInitialized.value = true
      console.log('Telegram Web App initialized')
    }
  }

  const showAlert = (message) => {
    if (tg.value?.showPopup) {
      tg.value.showPopup({
        title: 'MapChap',
        message: message,
        buttons: [{ type: 'ok' }]
      })
    } else {
      alert(message)
    }
  }

  onMounted(() => {
    init()
  })

  return {
    tg,
    isInitialized,
    showAlert
  }
}
