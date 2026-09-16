import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'

export interface AppStoreState {
  theme: Theme
}

export const useAppStore = defineStore('app', {
  state: (): AppStoreState => ({
    theme: 'light',
  }),
  persist: {
    storage: localStorage,
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
