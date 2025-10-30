export class MapService {
  constructor() {
    this.map = null
    this.markers = []
  }

  async initializeMap(container) {
    // Заглушка для инициализации карты
    console.log('Map service initialized')
    return Promise.resolve()
  }

  addMarker(coordinates, data) {
    const marker = {
      coordinates,
      data,
      id: Date.now()
    }
    this.markers.push(marker)
    return marker
  }

  clearMarkers() {
    this.markers = []
  }
}

export const mapService = new MapService()
