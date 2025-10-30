import { ref, computed } from 'vue'
import { useOffersStore } from '../stores/offers.store'
import { apiService } from '../services/api.service'

export function useOffers() {
  const offersStore = useOffersStore()
  const loading = ref(false)
  const error = ref(null)

  const filteredOffers = computed(() => {
    if (offersStore.currentDistrict === 'all') {
      return offersStore.offers
    }
    return offersStore.offers.filter(offer => 
      offer.district === offersStore.currentDistrict
    )
  })

  const loadOffers = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Mock data - replace with actual API call
      const mockOffers = [
        {
          id: 1,
          title: "Кофейня Central",
          discount: 30,
          address: "ул. Примерная, 15",
          description: "Скидка на все виды кофе при заказе через приложение",
          district: "center",
          coordinates: [55.7558, 37.6176],
          time: "до 18:00",
          category: "cafe"
        },
        {
          id: 2,
          title: "Магазин Fresh",
          discount: 20,
          address: "пр. Главный, 42",
          description: "Скидка на овощи и фрукты",
          district: "north",
          coordinates: [55.7658, 37.6276],
          time: "ежедневно",
          category: "shop"
        }
      ]
      
      offersStore.offers = mockOffers
    } catch (err) {
      error.value = 'Не удалось загрузить предложения'
      console.error('Error loading offers:', err)
    } finally {
      loading.value = false
    }
  }

  const toggleFavorite = (offerId) => {
    offersStore.toggleFavorite(offerId)
  }

  return {
    offers: filteredOffers,
    loading,
    error,
    loadOffers,
    toggleFavorite
  }
}
