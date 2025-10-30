<template>
  <div class="profile-panel">
    <div class="profile-header">
      <button class="close-btn" @click="closePanel">
        <i class="fas fa-times"></i>
      </button>
      <h2>Профиль</h2>
    </div>
    <div class="profile-content">
      <div class="user-info">
        <div class="user-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="user-name">Пользователь</div>
        <div class="user-status">Аккаунт активен</div>
      </div>
      <div class="profile-menu">
        <div class="menu-item">Настройки</div>
        <div class="menu-item">Избранное</div>
        <div class="menu-item">История</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/app.store'

const appStore = useAppStore()

const closePanel = () => {
  appStore.setActivePanel(null)
}
</script>

<style scoped>
.profile-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: var(--surface-bg);
  z-index: 1000;
}

.profile-header {
  background: var(--card-bg);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}

.close-btn {
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-info {
  text-align: center;
  padding: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: white;
  font-size: 24px;
}

.menu-item {
  padding: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  margin: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
