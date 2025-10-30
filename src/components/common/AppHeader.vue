<template>
  <header class="header">
    <div class="header-left">
      <button class="business-btn" @click="openBusinessPanel">
        <i class="fas fa-briefcase"></i> Бизнес
      </button>
      <div class="brand-name">MapChap</div>
    </div>
    <div class="header-actions">
      <button class="profile-btn" @click="openProfilePanel">
        <i class="fas fa-user"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAppStore } from '../../stores/app.store'

const appStore = useAppStore()

const openBusinessPanel = () => {
  appStore.setActivePanel('business')
}

const openProfilePanel = () => {
  appStore.setActivePanel('profile')
}
</script>
