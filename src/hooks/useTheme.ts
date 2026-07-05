import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const themeStore = useThemeStore()

  return {
    theme: computed(() => themeStore.theme),
    isDark: computed(() => themeStore.theme === 'dark'),
    toggleTheme: themeStore.toggleTheme,
  }
}
