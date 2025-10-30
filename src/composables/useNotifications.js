import { ref } from 'vue'
import { useAppStore } from '../stores/app.store'

export function useNotifications() {
  const appStore = useAppStore()
  const notification = ref(null)
  const timeoutId = ref(null)

  const showNotification = (message, type = 'info', duration = 3000) => {
    // Clear existing notification
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }

    notification.value = {
      message,
      type,
      id: Date.now()
    }

    // Auto hide after duration
    timeoutId.value = setTimeout(() => {
      notification.value = null
    }, duration)
  }

  const hideNotification = () => {
    notification.value = null
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }
  }

  // Notification types with colors
  const notificationTypes = {
    info: 'var(--accent-blue)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)'
  }

  return {
    notification,
    showNotification,
    hideNotification,
    notificationTypes
  }
}
