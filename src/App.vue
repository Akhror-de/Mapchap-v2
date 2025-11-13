<template>
  <div id="app">
    <div class="container">
      <h1>🗺️ MapChap</h1>
      <p class="version">Версия 4.0.6</p>
      
      <div class="status">
        <div class="status-item">
          <span class="status-dot"></span>
          Приложение загружено
        </div>
        <div class="status-item" v-if="isTelegram">
          <span class="status-dot telegram"></span>
          Telegram Web App
        </div>
      </div>

      <div class="map-preview">
        <h2>Карта предложений</h2>
        <div class="map-placeholder">
          <div class="map-point" style="left: 30%; top: 40%;">-50%</div>
          <div class="map-point" style="left: 60%; top: 25%;">-30%</div>
          <div class="map-point" style="left: 45%; top: 70%;">-20%</div>
        </div>
        <p>Нажмите на точки для просмотра предложений</p>
      </div>

      <div class="buttons">
        <button class="btn" @click="showBusiness">🏢 Бизнес-панель</button>
        <button class="btn" @click="showProfile">👤 Профиль</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isTelegram: false
    }
  },
  mounted() {
    console.log('MapChap App mounted');
    
    // Проверяем Telegram
    if (window.Telegram?.WebApp) {
      this.isTelegram = true;
      const tg = window.Telegram.WebApp;
      tg.expand();
      tg.enableClosingConfirmation();
      console.log('Telegram WebApp initialized');
    }
  },
  methods: {
    showBusiness() {
      alert('Бизнес-панель будет здесь');
    },
    showProfile() {
      alert('Профиль будет здесь');
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
  background: #f8fafc;
  color: #1f2937;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #1e40af;
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.version {
  color: #6b7280;
  margin-bottom: 24px;
  font-size: 0.9rem;
}

.status {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  margin-right: 8px;
}

.status-dot.telegram {
  background: #0088cc;
}

.map-preview {
  margin-bottom: 24px;
}

.map-preview h2 {
  color: #1e40af;
  margin-bottom: 16px;
  font-size: 1.5rem;
}

.map-placeholder {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #1e3a8a, #3730a3);
  border-radius: 12px;
  position: relative;
  margin-bottom: 16px;
  border: 3px solid #4f46e5;
}

.map-point {
  position: absolute;
  width: 60px;
  height: 60px;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 3px solid white;
}

.map-point:hover {
  transform: translate(-50%, -50%) scale(1.1);
  background: #f59e0b;
}

.buttons {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.btn {
  background: #1e40af;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background: #3730a3;
}

/* Поддержка безопасных зон */
@supports(padding: max(0px)) {
  #app {
    padding: max(20px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
  }
}

@media (max-width: 600px) {
  .container {
    padding: 20px;
    margin: 10px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .map-placeholder {
    height: 250px;
  }
}
</style>
