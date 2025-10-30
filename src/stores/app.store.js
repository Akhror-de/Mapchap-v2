import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'dark',
    isLoading: false,
    activePanel: null
  }),
  actions: {
    setTheme(newTheme) {
      this.theme = newTheme
    },
    setActivePanel(panel) {
      this.activePanel = panel
    }
  }
})
