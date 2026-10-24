import { useCallback, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'dark' | 'light'

const THEME_KEY = 'ciphervault-theme'

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(THEME_KEY)
    return (stored as Theme | null) ?? null
  } catch {
    return null
  }
}

interface ThemeToggleProps {
  iconOnly?: boolean
}

export function ThemeToggle({ iconOnly = false }: ThemeToggleProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = getStoredTheme()
    return stored ?? 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    try {
      window.localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* no-op */
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-outline transition-all ${iconOnly ? '' : 'flex items-center gap-space-xs px-space-md py-space-sm font-label-lg text-label-lg shadow-sm'}`}
      type="button"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      {!iconOnly && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
    </button>
  )
}
