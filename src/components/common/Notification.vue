<template>
  <transition name="slide-down">
    <div 
      v-if="notification" 
      class="notification" 
      :style="{ background: notificationTypes[notification.type] }"
    >
      <div class="notification-content">
        <i class="notification-icon" :class="getIconClass(notification.type)"></i>
        <span class="notification-message">{{ notification.message }}</span>
      </div>
      <button class="notification-close" @click="hideNotification">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { useNotifications } from '../../composables/useNotifications'

const { 
  notification, 
  hideNotification, 
  notificationTypes 
} = useNotifications()

const getIconClass = (type) => {
  const icons = {
    info: 'fas fa-info-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-exclamation-circle'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent-blue);
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  z-index: 10000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  max-width: 90%;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.notification-message {
  font-size: 14px;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-100%);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-100%);
}
</style>
