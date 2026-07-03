import { defineStore } from 'pinia'

export interface AppStoreState {
  theme: 'light'| 'dark'
}

export const useAppStore = defineStore('app', {
  state: (): AppStoreState => ({
    theme: 'light'
  }),
  getters: {
  },
  actions: {
   
  },
  persist: {
    storage: localStorage
  }
})
