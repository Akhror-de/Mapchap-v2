<template>
  <transition name="slide-up">
    <div v-if="showPrompt" class="install-prompt">
      <div class="install-header">
        <div class="install-icon">
          <i class="fas fa-map-marked-alt"></i>
        </div>
        <div class="install-text">
          <h3>Установить MapChap</h3>
          <p>Для быстрого доступа и работы в офлайн-режиме</p>
        </div>
      </div>
      <div class="install-actions">
        <button class="install-btn install-primary" @click="installApp">
          Установить
        </button>
        <button class="install-btn install-secondary" @click="dismissPrompt">
          Позже
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showPrompt = ref(false)
let deferredPrompt = null

const beforeInstallHandler = (e) => {
  e.preventDefault()
  deferredPrompt = e
  showPrompt.value = true
}

const installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('PWA installed')
    }
    deferredPrompt = null
  }
  showPrompt.value = false
}

const dismissPrompt = () => {
  showPrompt.value = false
  // Store dismissal in localStorage to not show again for some time
  localStorage.setItem('installPromptDismissed', Date.now().toString())
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', beforeInstallHandler)
  
  // Check if user recently dismissed the prompt
  const dismissed = localStorage.getItem('installPromptDismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed)
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - dismissedTime < oneWeek) {
      showPrompt.value = false
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', beforeInstallHandler)
})
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 400px;
  width: 90%;
}

.install-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.install-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.install-text h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.install-text p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.install-actions {
  display: flex;
  gap: 12px;
}

.install-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.install-primary {
  background: var(--accent-blue);
  color: white;
}

.install-secondary {
  background: var(--surface-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(100%);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(100%);
}
</style>
