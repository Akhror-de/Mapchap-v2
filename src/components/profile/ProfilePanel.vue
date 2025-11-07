<template>
  <div class="profile-panel">
    <div class="profile-header">
      <button class="close-btn" @click="closePanel">
        ✕
      </button>
      <h2>Профиль</h2>
    </div>

    <div class="profile-content">
      <!-- Информация пользователя -->
      <div class="user-info">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        <div class="user-details">
          <h3 class="user-name">{{ userName }}</h3>
          <div class="user-stats">
            <div class="stat">
              <span class="stat-number">{{ userStore.favorites.size }}</span>
              <span class="stat-label">Избранное</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ userAdsCount }}</span>
              <span class="stat-label">Объявления</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Меню профиля -->
      <div class="profile-menu">
        <div 
          v-for="item in menuItems" 
          :key="item.id"
          class="menu-item"
          :class="{ active: activeMenuItem === item.id }"
          @click="handleMenuItemClick(item)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-text">{{ item.name }}</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>

      <!-- Контент выбранного раздела -->
      <div class="profile-section">
        <!-- Избранное -->
        <div v-if="activeMenuItem === 'favorites'" class="favorites-section">
          <h3>Избранные предложения</h3>
          <div v-if="favoriteOffers.length === 0" class="empty-state">
            <p>У вас пока нет избранных предложений</p>
            <p class="empty-hint">Добавляйте предложения в избранное, нажимая на звёздочку</p>
          </div>
          <div v-else class="favorites-list">
            <div 
              v-for="offer in favoriteOffers" 
              :key="offer.id" 
              class="favorite-item"
            >
              <div class="favorite-info">
                <h4>{{ offer.name }}</h4>
                <p class="offer-category">{{ getCategoryName(offer.category) }}</p>
                <p class="offer-address">{{ offer.address }}</p>
                <div class="offer-stats">
                  <span>👁️ {{ offer.views || 0 }}</span>
                  <span>❤️ {{ offer.likes || 0 }}</span>
                  <span class="discount">-{{ offer.discount }}%</span>
                </div>
              </div>
              <button 
                @click="removeFromFavorites(offer.id)"
                class="remove-favorite-btn"
                title="Удалить из избранного"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- О приложении -->
        <div v-else-if="activeMenuItem === 'about'" class="about-section">
          <h3>О приложении MapChap</h3>
          <div class="app-info">
            <div class="app-description">
              <p><strong>MapChap</strong> - инновационный сервис для поиска скидочных предложений и акций в вашем городе.</p>
              <p>Мы помогаем бизнесу привлекать новых клиентов, а пользователям - находить лучшие предложения рядом.</p>
            </div>

            <div class="founders-info">
              <h4>Основатели проекта</h4>
              
              <div class="founder-card">
                <div class="founder-avatar">АХ</div>
                <div class="founder-details">
                  <h5>Хабибуллаев Ахрор</h5>
                  <p class="founder-role">Основатель и CEO</p>
                  <p class="founder-bio">Идеолог и создатель платформы MapChap. Отвечает за стратегическое развитие и общее руководство проектом.</p>
                </div>
              </div>

              <div class="founder-card">
                <div class="founder-avatar">ЯИ</div>
                <div class="founder-details">
                  <h5>Яна Владимировна Ивченко</h5>
                  <p class="founder-role">Директор по финансам (CFO)</p>
                  <p class="founder-bio">Управляет финансовыми потоками, инвестициями и экономической стратегией развития компании.</p>
                </div>
              </div>
            </div>

            <div class="app-details">
              <div class="version">Версия 1.0.0</div>
              <div class="mission">
                <h5>Наша миссия</h5>
                <p>Сделать поиск выгодных предложений простым, удобным и доступным для каждого.</p>
              </div>
            </div>

            <div class="links">
              <a href="#" class="link">Политика конфиденциальности</a>
              <a href="#" class="link">Условия использования</a>
              <a href="#" class="link">Служба поддержки</a>
            </div>
          </div>
        </div>

        <!-- Настройки -->
        <div v-else-if="activeMenuItem === 'settings'" class="settings-section">
          <h3>Настройки</h3>
          <div class="setting-item">
            <label>Уведомления о новых предложениях</label>
            <div class="toggle-switch">
              <input type="checkbox" id="notifications" v-model="notificationsEnabled">
              <label for="notifications" class="toggle-slider"></label>
            </div>
          </div>
          <div class="setting-item">
            <label>Тёмная тема</label>
            <div class="toggle-switch">
              <input type="checkbox" id="dark-mode" v-model="darkModeEnabled">
              <label for="dark-mode" class="toggle-slider"></label>
            </div>
          </div>
          <div class="setting-item">
            <label>Геолокация</label>
            <div class="toggle-switch">
              <input type="checkbox" id="geolocation" v-model="geolocationEnabled">
              <label for="geolocation" class="toggle-slider"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../../stores/user.store'
import { useOffersStore } from '../../stores/offers.store'

const userStore = useUserStore()
const offersStore = useOffersStore()

const activeMenuItem = ref('about') // По умолчанию открываем "О приложении"
const notificationsEnabled = ref(true)
const darkModeEnabled = ref(false)
const geolocationEnabled = ref(true)

const menuItems = [
  { id: 'about', name: 'О приложении', icon: 'ℹ️' },
  { id: 'favorites', name: 'Избранное', icon: '⭐' },
  { id: 'settings', name: 'Настройки', icon: '⚙️' }
]

// Вычисляемые свойства
const userName = computed(() => {
  return userStore.user?.name || 'Пользователь'
})

const userInitials = computed(() => {
  return userStore.user?.name 
    ? userStore.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'П'
})

const userAds = computed(() => {
  if (!userStore.user) return []
  return offersStore.offers.filter(ad => ad.user_id === userStore.user.id)
})

const userAdsCount = computed(() => userAds.value.length)

const favoriteOffers = computed(() => {
  return offersStore.offers.filter(offer => 
    userStore.favorites.has(offer.id)
  )
})

// Методы
const closePanel = () => {
  const emit = defineEmits(['close'])
  emit('close')
}

const handleMenuItemClick = (item) => {
  activeMenuItem.value = item.id
}

const removeFromFavorites = async (offerId) => {
  try {
    await userStore.toggleFavorite(offerId)
  } catch (error) {
    console.error('Ошибка при удалении из избранного:', error)
  }
}

const getCategoryName = (category) => {
  const categories = {
    cafe: 'Кафе',
    shop: 'Магазин', 
    restaurant: 'Ресторан',
    services: 'Услуги',
    entertainment: 'Развлечения',
    beauty: 'Красота'
  }
  return categories[category] || category
}

// Загрузка данных при открытии профиля
onMounted(() => {
  userStore.loadFavorites()
})
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
  display: flex;
  flex-direction: column;
}

.profile-header {
  background: var(--card-bg);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}

.profile-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-info {
  background: var(--card-bg);
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--border-color);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 18px;
}

.user-stats {
  display: flex;
  gap: 20px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: var(--accent-blue);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.profile-menu {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--border-color);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: var(--bg-secondary);
}

.menu-item.active {
  background: var(--accent-blue-light);
  color: var(--accent-blue);
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-size: 16px;
}

.menu-arrow {
  color: var(--text-secondary);
  font-size: 18px;
}

.profile-section {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* Стили для раздела "О приложении" */
.about-section h3 {
  margin-bottom: 20px;
  color: var(--text-primary);
}

.app-info {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-color);
}

.app-description {
  margin-bottom: 24px;
  line-height: 1.6;
}

.app-description p {
  margin-bottom: 12px;
}

.founders-info {
  margin-bottom: 24px;
}

.founders-info h4 {
  margin-bottom: 16px;
  color: var(--text-primary);
  border-bottom: 2px solid var(--accent-blue);
  padding-bottom: 8px;
}

.founder-card {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.founder-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
}

.founder-details h5 {
  margin: 0 0 4px 0;
  color: var(--text-primary);
  font-size: 16px;
}

.founder-role {
  color: var(--accent-blue);
  font-weight: 500;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.founder-bio {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.app-details {
  margin-bottom: 24px;
}

.version {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
  padding: 8px;
  background: var(--bg-secondary);
  border-radius: 6px;
}

.mission h5 {
  margin-bottom: 8px;
  color: var(--text-primary);
}

.mission p {
  color: var(--text-secondary);
  line-height: 1.5;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
}

.link {
  color: var(--accent-blue);
  text-decoration: none;
  font-size: 14px;
  padding: 8px 0;
}

.link:hover {
  text-decoration: underline;
}

/* Остальные стили (избранное, настройки) остаются такими же */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.empty-hint {
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.7;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
}

.favorite-info h4 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.offer-category {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 8px;
}

.offer-address {
  color: var(--text-secondary);
  font-size: 12px;
  margin-bottom: 8px;
}

.offer-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.discount {
  color: var(--accent-green);
  font-weight: bold;
}

.remove-favorite-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
}

.remove-favorite-btn:hover {
  color: var(--error-color);
}

.settings-section h3 {
  margin-bottom: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--accent-blue);
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
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
  font-size: 16px;
}
</style>
