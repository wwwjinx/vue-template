type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(t: Theme) {
  const html = document.documentElement
  html.setAttribute('data-theme', t)
  html.classList.toggle('dark', t === 'dark')
}

const theme = ref<Theme>(getInitialTheme())

applyTheme(theme.value)

export function useTheme() {
  watchEffect(() => {
    applyTheme(theme.value)
    localStorage.setItem(STORAGE_KEY, theme.value)
  })

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(t: Theme) {
    theme.value = t
  }

  return {
    theme: computed(() => theme.value),
    isDark: computed(() => theme.value === 'dark'),
    toggleTheme,
    setTheme,
  }
}
