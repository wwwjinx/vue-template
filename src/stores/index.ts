import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(
  createPersistedState({
    storage: localStorage,
  }),
)

export default store

export * from './app'
export * from './counter'
