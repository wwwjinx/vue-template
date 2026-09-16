import type { Theme } from '@/stores/app'
import { useAppStore } from '@/stores/app'

function applyTheme(theme: Theme) {
  const html = document.documentElement
  html.setAttribute('data-theme', theme)
  html.classList.toggle('dark', theme === 'dark')
}

let started = false

export function useTheme() {
  const appStore = useAppStore()

  if (!started) {
    started = true
    watch(() => appStore.theme, applyTheme, { immediate: true })
  }

  function toggleTheme() {
    appStore.theme = appStore.theme === 'dark' ? 'light' : 'dark'
  }

  function setTheme(theme: Theme) {
    appStore.theme = theme
  }

  return {
    theme: computed(() => appStore.theme),
    isDark: computed(() => appStore.theme === 'dark'),
    toggleTheme,
    setTheme,
  }
}
