import { CONFIG } from '../utils/constants'

export class MapService {
  constructor() {
    this.map = null
    this.markers = []
    this.isYmapsLoaded = false
    this.ymaps = null
  }

  async loadYmaps() {
    return new Promise((resolve, reject) => {
      if (window.ymaps) {
        this.ymaps = window.ymaps
        this.isYmapsLoaded = true
        resolve(window.ymaps)
        return
      }

      const script = document.createElement('script')
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${CONFIG.YANDEX_MAP_KEY}&lang=ru_RU`
      script.onload = () => {
        this.ymaps = window.ymaps
        this.ymaps.ready(() => {
          this.isYmapsLoaded = true
          resolve(this.ymaps)
        })
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async initializeMap(container) {
    try {
      if (!this.isYmapsLoaded) {
        await this.loadYmaps()
      }

      this.map = new this.ymaps.Map(container, {
        center: CONFIG.DEFAULT_MAP_CENTER,
        zoom: CONFIG.DEFAULT_ZOOM,
        controls: [] // Убираем стандартные контролы
      }, {
        suppressMapOpenBlock: true,
        suppressObsoleteBrowserNotifier: true
      })

      // Скрываем ненужные элементы Яндекс.Карт
      this.hideYmapsElements()

      // Добавляем обработчики событий
      this.setupMapEvents()

      return this.map
    } catch (error) {
      console.error('Failed to initialize map:', error)
      throw error
    }
  }

  hideYmapsElements() {
    // Скрываем копирайты и другие элементы
    const styles = `
      .ymaps-2-1-79-copyright,
      .ymaps-2-1-79-copyright__wrap,
      .ymaps-2-1-79-copyrights-pane,
      .ymaps-2-1-79-controls__control,
      .ymaps-2-1-79-controls__toolbar,
      .ymaps-2-1-79-controls__toolbar_left,
      .ymaps-2-1-79-controls__toolbar_right,
      .ymaps-2-1-79-search,
      .ymaps-2-1-79-search__suggest,
      .ymaps-2-1-79-search__suggest-item,
      .ymaps-2-1-79-search__suggest-item-text {
        display: none !important;
      }
    `
    const styleSheet = document.createElement('style')
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
  }

  setupMapEvents() {
    // Обработчик клика по карте
    this.map.events.add('click', (e) => {
      const coords = e.get('coords')
      console.log('Map clicked at:', coords)
      // Можно добавить создание метки или другие действия
    })

    // Отслеживание изменения границ карты
    this.map.events.add('boundschange', (e) => {
      // Можно использовать для подгрузки предложений в видимой области
      console.log('Map bounds changed')
    })
  }

  addMarker(coordinates, data) {
    if (!this.map) return null

    const marker = new this.ymaps.Placemark(coordinates, {
      hintContent: data.title,
      balloonContent: this.createBalloonContent(data)
    }, {
      preset: this.getPresetByCategory(data.category),
      balloonCloseButton: true,
      hideIconOnBalloonOpen: false
    })

    // Обработчик клика по метке
    marker.events.add('click', () => {
      this.openBalloon(marker, data)
    })

    this.map.geoObjects.add(marker)
    this.markers.push({ marker, data })

    return marker
  }

  createBalloonContent(data) {
    return `
      <div class="map-balloon">
        <h3>${data.title}</h3>
        <div class="balloon-discount">-${data.discount}%</div>
        <p class="balloon-description">${data.description}</p>
        <p class="balloon-address">📍 ${data.address}</p>
        <p class="balloon-time">🕒 ${data.time}</p>
        <div class="balloon-actions">
          <button class="balloon-btn favorite-btn" onclick="window.mapService.toggleFavorite(${data.id})">
            ❤️ В избранное
          </button>
          <button class="balloon-btn route-btn" onclick="window.mapService.buildRoute([${data.coordinates}])">
            🚗 Построить маршрут
          </button>
        </div>
      </div>
    `
  }

  getPresetByCategory(category) {
    const presets = {
      cafe: 'islands#blueFoodIcon',
      shop: 'islands#blueShoppingIcon',
      services: 'islands#blueServiceIcon',
      education: 'islands#blueEducationIcon',
      health: 'islands#blueHealthIcon',
      beauty: 'islands#blueBeautyIcon',
      entertainment: 'islands#blueEntertainmentIcon',
      other: 'islands#blueStarIcon'
    }
    return presets[category] || 'islands#blueStarIcon'
  }

  openBalloon(marker, data) {
    marker.balloon.open()
    
    // Центрируем карту на метке с небольшим смещением для балуна
    this.map.panTo(data.coordinates, {
      delay: 300,
      duration: 1000
    })
  }

  clearMarkers() {
    this.markers.forEach(({ marker }) => {
      this.map.geoObjects.remove(marker)
    })
    this.markers = []
  }

  setCenter(coordinates, zoom = null) {
    if (!this.map) return

    if (zoom) {
      this.map.setCenter(coordinates, zoom)
    } else {
      this.map.setCenter(coordinates)
    }
  }

  setZoom(zoom) {
    if (this.map) {
      this.map.setZoom(zoom)
    }
  }

  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!this.ymaps) {
        reject(new Error('Ymaps not loaded'))
        return
      }

      this.ymaps.geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
      }).then((result) => {
        resolve(result.geoObjects.position)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  // Построение маршрута
  buildRoute(targetCoordinates) {
    if (!this.ymaps || !this.map) return

    this.ymaps.route([
      this.map.getCenter(),
      targetCoordinates
    ]).then((route) => {
      this.map.geoObjects.add(route)
    })
  }

  // Методы для работы с избранным (заглушки)
  toggleFavorite(offerId) {
    console.log('Toggle favorite:', offerId)
    // Реализуется через store
  }

  destroy() {
    if (this.map) {
      this.map.destroy()
      this.map = null
    }
    this.markers = []
  }
}

// Создаем глобальный экземпляр
export const mapService = new MapService()
// Делаем доступным глобально для обработчиков в балунах
window.mapService = mapService
