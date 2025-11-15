methods: {
  selectOffer(offer) {
    this.selectedOffer = offer
    // Можно добавить центрирование карты на выбранном предложении
  },
  
  handleMapClick(coords) {
    console.log('Map clicked at:', coords)
    // Здесь можно добавить создание нового предложения
  },
  
  getCategoryIcon(category) {
    const icons = {
      food: '🍕',
      entertainment: '🎭',
      shopping: '🛍️',
      services: '🔧',
      other: '❓'
    }
    return icons[category] || '📍'
  },
  
  calculateDistance(offerCoords) {
    if (!this.currentCoords) return '?'
    
    const [lat1, lon1] = this.currentCoords
    const [lat2, lon2] = offerCoords
    // Упрощенный расчет расстояния
    const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 100
    return distance.toFixed(1)
  },
  
  async loadStats() {
    try {
      // Пока используем мок статистику
      this.stats = {
        totalOffers: this.offers.length,
        activeUsers: 142,
        views: 1250,
        newOffersToday: 3
      }
    } catch (error) {
      console.warn('Ошибка загрузки статистики:', error)
      // Fallback статистика
      this.stats = {
        totalOffers: this.offers.length,
        activeUsers: 0,
        views: 0,
        newOffersToday: 0
      }
    }
  }
},

async mounted() {
  // Загружаем предложения
  await this.offersStore.fetchOffers()
  
  // Загружаем статистику
  await this.loadStats()
  
  // Пробуем получить геолокацию (с обработкой ошибок)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.currentCoords = [
          position.coords.latitude,
          position.coords.longitude
        ]
        console.log('📍 Геолокация определена:', this.currentCoords)
      },
      (error) => {
        console.warn('📍 Геолокация недоступна, используем Москву по умолчанию:', error.message)
        // Используем Москву как fallback
        this.currentCoords = [55.751244, 37.618423]
      },
      {
        enableHighAccuracy: false, // Увеличиваем шансы на успех
        timeout: 10000,
        maximumAge: 60000
      }
    )
  } else {
    console.warn('📍 Геолокация не поддерживается браузером')
    this.currentCoords = [55.751244, 37.618423]
  }
}
