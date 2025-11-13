<template>
  <div id="app">
    <header class="app-header">
      <button @click="showBusinessPanel" class="header-btn">
        <span>🏢 Бизнес</span>
      </button>
      
      <div class="app-logo">
        <h1>🗺️ MapChap</h1>
        <div class="version">v4.0.5</div>
      </div>

      <button @click="showProfile" class="header-btn">
        <span>👤 Профиль</span>
      </button>
    </header>

    <main class="app-main">
      <div class="status-panel">
        <div class="status-item">
          <span class="status-label">Статус:</span>
          <span class="status-value success">✅ Работает</span>
        </div>
        <div class="status-item">
          <span class="status-label">Telegram:</span>
          <span class="status-value" :class="isTelegram ? 'success' : 'neutral'">
            {{ isTelegram ? '✅ Подключен' : '🌐 Браузер' }}
          </span>
        </div>
        <div class="status-item">
          <span class="status-label">Node.js:</span>
          <span class="status-value success">22</span>
        </div>
        <div class="status-item">
          <span class="status-label">Сборка:</span>
          <span class="status-value success">Production</span>
        </div>
      </div>

      <div class="map-container">
        <h2>Карта предложений MapChap</h2>
        <div class="map-visualization">
          <div class="map-area">
            <div 
              v-for="offer in offers" 
              :key="offer.id"
              class="map-offer"
              :style="{
                left: offer.position.x + '%',
                top: offer.position.y + '%'
              }"
              @click="selectOffer(offer)"
            >
              <div class="offer-badge">-{{ offer.discount }}%</div>
              <div class="offer-name">{{ offer.name }}</div>
            </div>
          </div>
        </div>
        <p class="map-hint">Нажмите на предложения для подробной информации</p>
      </div>
    </main>

    <BusinessPanel 
      v-if="activePanel === 'business'" 
      @close="activePanel = null" 
    />

    <ProfilePanel 
      v-if="activePanel === 'profile'" 
      @close="activePanel = null" 
    />

    <div v-if="isTelegram" class="telegram-badge">
      🔗 Telegram Web App
    </div>
  </div>
</template>

<script>
import BusinessPanel from './components/business/BusinessPanel.vue'
import ProfilePanel from './components/profile/ProfilePanel.vue'

export default {
  name: 'App',
  components: {
    BusinessPanel,
    ProfilePanel
  },
  data() {
    return {
      activePanel: null,
      isTelegram: false,
      offers: [
        {
          id: 1,
          name: 'Кофе',
          discount: 50,
          position: { x: 30, y: 40 },
          description: 'Вкусный кофе со скидкой 50%'
        },
        {
          id: 2,
          name: 'Пицца',
          discount: 30,
          position: { x: 60, y: 25 },
          description: 'Пицца по специальной цене'
        },
        {
          id: 3,
          name: 'Суши',
          discount: 20,
          position: { x: 45, y: 70 },
          description: 'Свежие суши со скидкой'
        }
      ]
    }
  },
  mounted() {
    this.initTelegram()
    console.log('MapChap Frontend v4.0.5 - Node.js 22')
  },
  methods: {
    initTelegram() {
      if (window.Telegram?.WebApp) {
        this.isTelegram = true
        const tg = window.Telegram.WebApp
        tg.expand()
        tg.enableClosingConfirmation()
        console.log('✅ Telegram WebApp initialized')
      }
    },
    showBusinessPanel() {
      this.activePanel = 'business'
    },
    showProfile() {
      this.activePanel = 'profile'
    },
    selectOffer(offer) {
      console.log('Selected offer:', offer)
      alert(`${offer.name}\nСкидка: ${offer.discount}%\n\n${offer.description}`)
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #ffffff;
  color: #1f2937;
  overflow: hidden;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.app-logo {
  text-align: center;
}

.app-logo h1 {
  font-size: 1.4rem;
  color: #1e40af;
  margin-bottom: 2px;
}

.version {
  font-size: 0.7rem;
  color: #6b7280;
}

.header-btn {
  background: none;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.header-btn:hover {
  background: #f3f4f6;
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.status-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.status-item {
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.status-label {
  display: block;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 4px;
}

.status-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.status-value.success {
  color: #059669;
}

.status-value.neutral {
  color: #6b7280;
}

.map-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.map-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #1e40af;
}

.map-visualization {
  width: 100%;
  margin-bottom: 16px;
}

.map-area {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #1e3a8a, #3730a3);
  border-radius: 8px;
  position: relative;
  border: 3px solid #4f46e5;
}

.map-offer {
  position: absolute;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  text-align: center;
}

.map-offer:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.offer-badge {
  background: #ef4444;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.offer-name {
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.map-hint {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.telegram-badge {
  position: fixed;
  top: 10px;
  right: 10px;
  background: #0088cc;
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.7rem;
  z-index: 1000;
}

/* Поддержка безопасных зон */
@supports(padding: max(0px)) {
  .app-header {
    padding-top: max(12px, env(safe-area-inset-top));
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
  }
  
  .app-main {
    padding-left: max(20px, env(safe-area-inset-left));
    padding-right: max(20px, env(safe-area-inset-right));
    padding-bottom: max(20px, env(safe-area-inset-bottom));
  }
}

@media (max-width: 600px) {
  .status-panel {
    grid-template-columns: 1fr 1fr;
  }
  
  .map-area {
    height: 300px;
  }
}
</style>
