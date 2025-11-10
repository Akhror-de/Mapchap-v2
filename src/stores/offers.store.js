import { defineStore } from 'pinia'

export const useOffersStore = defineStore('offers', {
  state: () => ({
    offers: [
      {
        id: '1',
        name: 'Кофе со скидкой 50%',
        description: 'Вкусный кофе всего за 150 рублей',
        discount: 50,
        address: 'ул. Примерная, 1',
        category: 'cafe',
        views: 150,
        likes: 25
      }
    ],
    favorites: [],
    isLoading: false
  }),
  
  actions: {
    async fetchOffers() {
      this.isLoading = true;
      await new Promise(resolve => setTimeout(resolve, 500));
      this.isLoading = false;
    },
    
    async createOffer(offerData) {
      const newOffer = {
        id: Date.now().toString(),
        ...offerData,
        views: 0,
        likes: 0
      };
      this.offers.push(newOffer);
      return newOffer;
    },
    
    loadFavorites() {
      const saved = localStorage.getItem('mapchap-favorites');
      if (saved) {
        this.favorites = JSON.parse(saved);
      }
    },
    
    toggleFavorite(offerId) {
      const index = this.favorites.indexOf(offerId);
      if (index > -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(offerId);
      }
      localStorage.setItem('mapchap-favorites', JSON.stringify(this.favorites));
    }
  }
});
