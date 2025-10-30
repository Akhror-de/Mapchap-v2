<template>
  <div class="app-container" :data-theme="appStore.theme">
    <AppHeader />
    <MapContainer />
    <BottomSheet />
  </div>
</template>

<script setup>
import { useAppStore } from './stores/app.store'
import AppHeader from './components/common/AppHeader.vue'
import MapContainer from './components/map/MapContainer.vue'
import BottomSheet from './components/common/BottomSheet.vue'

const appStore = useAppStore()
</script>

<style>
/* Базовые стили уже подключены в main.js */
</style>
