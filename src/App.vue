<template>
  <div class="app-container" :data-theme="appStore.theme">
    <AppHeader />
    <MapContainer />
    <BottomSheet />
    
    <BusinessPanel v-if="appStore.activePanel === 'business'" />
    <ProfilePanel v-if="appStore.activePanel === 'profile'" />
  </div>
</template>

<script setup>
import { useAppStore } from './stores/app.store'
import AppHeader from './components/common/AppHeader.vue'
import MapContainer from './components/map/MapContainer.vue'
import BottomSheet from './components/common/BottomSheet.vue'
import BusinessPanel from './components/business/BusinessPanel.vue'
import ProfilePanel from './components/profile/ProfilePanel.vue'

const appStore = useAppStore()
</script>
