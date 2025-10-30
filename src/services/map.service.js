import { CONFIG } from '../utils/constants'

export class MapService {
  constructor() {
    this.map = null
    this.markers = []
    this.isYmapsLoaded = false
  }

  async loadYmaps() {
    return new Promise((resolve, reject) => {
      if (window.ymaps) {
        this.isYmapsLoaded = true
        window.ymaps.ready(resolve)
        return
      }

      const script = document.createElement('script')
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${CONFIG.YANDEX_MAP_KEY}&lang=ru_RU`
      script.onload = () => {
        window.ymaps.ready(() => {
          this.isYmapsLoaded = true
          resolve()
        })
      }
      script.onerror = () => reject(new Error('Failed to load Yandex Maps'))
      document.head.appendChild(script)
    })
  }

  async initializeMap(container) {
    try {
      if (!this.isYmapsLoaded) {
        await this.loadYmaps()
      }

      this.map = new window.ymaps.Map(container, {
        center: CONFIG.DEFAULT_MAP_CENTER,
        zoom: CONFIG.DEFAULT_ZOOM,
        controls: []
      }, {
        suppressMapOpenBlock: true,
        suppressObsoleteBrowserNotifier: true
      })

      this.hideYmapsElements()
      this.setupMapEvents()

      console.log('Yandex Map initialized successfully')
      return this.map

    } catch (error) {
      console.error('Map initialization failed:', error)
      throw error
    }
  }

  hideYmapsElements() {
    const style = document.createElement('style')
    style.textContent = `
      .ymaps-2-1-79-copyright,
      .ymaps-2-1-79-copyright__wrap,
      .ymaps-2-1-79-copyrights-pane,
      .ymaps-2-1-79-controls__control,
      .ymaps-2-1-79-controls__toolbar,
      .ymaps-2-1-79-search,
      .ymaps-2-1-79-search__suggest {
        display: none !important;
      }
    `
    document.head.appendChild(style)
  }

  setupMapEvents() {
    this.map.events.add('click', (e) => {
      const coords = e.get('coords')
      console.log('Map clicked at:', coords)
    })
  }

  addMarker(coordinates, data) {
    if (!this.map) return null

    const marker = new window.ymaps.Placemark(coordinates, {
      hintContent: data.title,
      balloonContent: this.createBalloonContent(data)
    }, {
      preset: this.getPresetByCategory(data.category),
      balloonCloseButton: true
    })

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
          <button class="balloon-btn favorite-btn" onclick="window.toggleFavorite(${data.id})">
            ❤️ В избранное
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
      beauty: 'islands#blueBeautyIcon',
      other: 'islands#blueStarIcon'
    }
    return presets[category] || 'islands#blueStarIcon'
  }

  openBalloon(marker, data) {
    marker.balloon.open()
    this.map.panTo(data.coordinates, { duration: 1000 })
  }

  clearMarkers() {
    this.markers.forEach(({ marker }) => {
      this.map.geoObjects.remove(marker)
    })
    this.markers = []
  }

  setCenter(coordinates, zoom = null) {
    if (!this.map) return
    zoom ? this.map.setCenter(coordinates, zoom) : this.map.setCenter(coordinates)
  }

  setZoom(zoom) {
    if (this.map) this.map.setZoom(zoom)
  }

  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      )
    })
  }

  destroy() {
    if (this.map) {
      this.map.destroy()
      this.map = null
    }
    this.markers = []
  }
}

// Глобальный экземпляр
export const mapService = new MapService()

// Глобальные функции для балунов
window.toggleFavorite = (offerId) => {
  console.log('Toggle favorite from balloon:', offerId)
  // Будет подключено к store позже
}
