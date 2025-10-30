<template>
  <div class="app-container" :data-theme="appStore.theme">
    <AppHeader />
    <MapContainer />
    <BottomSheet />
    
    <BusinessPanel v-if="appStore.activePanel === 'business'" />
    <ProfilePanel v-if="appStore.activePanel === 'profile'" />
    
    <Notification />
    <LoadingOverlay />
    <InstallPrompt />
    <OfflineIndicator />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/app.store'
import { useUserStore } from './stores/user.store'
import AppHeader from './components/common/AppHeader.vue'
import MapContainer from './components/map/MapContainer.vue'
import BottomSheet from './components/common/BottomSheet.vue'
import BusinessPanel from './components/business/BusinessPanel.vue'
import ProfilePanel from './components/profile/ProfilePanel.vue'
import Notification from './components/common/Notification.vue'
import LoadingOverlay from './components/common/LoadingOverlay.vue'
import InstallPrompt from './components/common/InstallPrompt.vue'
import OfflineIndicator from './components/common/OfflineIndicator.vue'

const appStore = useAppStore()
const userStore = useUserStore()

onMounted(() => {
  appStore.initTheme()
  userStore.loadFavorites()
})
</script>
