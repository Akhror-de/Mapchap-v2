import { defineStore } from 'pinia'

export const useOffersStore = defineStore('offers', {
  state: () => ({
    offers: [],
    currentDistrict: 'all'
  })
})
