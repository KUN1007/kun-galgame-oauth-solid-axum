export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_KEY = 'kun_theme'

export const getTheme = (): ThemeMode => {
  const theme = localStorage.getItem(THEME_KEY) as ThemeMode | null
  return theme || 'system'
}

const apply = (mode: ThemeMode) => {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const setDark = (on: boolean) => {
    root.classList.toggle('kun-dark-mode', on)
    root.style.colorScheme = on ? 'dark' : 'light'
  }

  if (mode === 'light') {
    setDark(false)
    root.setAttribute('data-theme', 'light')
  } else if (mode === 'dark') {
    setDark(true)
    root.setAttribute('data-theme', 'dark')
  } else {
    setDark(prefersDark)
    root.setAttribute('data-theme', 'system')
  }
}

export const setTheme = (mode: ThemeMode) => {
  localStorage.setItem(THEME_KEY, mode)
  apply(mode)
}
