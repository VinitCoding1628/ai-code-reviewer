import { createContext, useContext, useEffect, useState, createElement } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'theme'
const ThemeContext = createContext(null)

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = (event) => {
    const isDark = theme === 'dark'
    const nextTheme = isDark ? 'light' : 'dark'

    const isAppearanceTransition =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isAppearanceTransition) {
      setTheme(nextTheme)
      return
    }

    let x = typeof window !== 'undefined' ? window.innerWidth - 40 : 0
    let y = 40

    if (
      event &&
      typeof event.clientX === 'number' &&
      typeof event.clientY === 'number' &&
      (event.clientX !== 0 || event.clientY !== 0)
    ) {
      x = event.clientX
      y = event.clientY
    } else if (event?.currentTarget && typeof event.currentTarget.getBoundingClientRect === 'function') {
      const rect = event.currentTarget.getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }

    const endRadius = Math.hypot(
      Math.max(x, typeof window !== 'undefined' ? window.innerWidth - x : 0),
      Math.max(y, typeof window !== 'undefined' ? window.innerHeight - y : 0)
    )

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme)
        document.documentElement.classList.toggle('dark', nextTheme === 'dark')
        localStorage.setItem(STORAGE_KEY, nextTheme)
      })
    })

    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]

        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 450,
            easing: 'ease-out',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      })
      .catch(() => {})
  }

  return createElement(
    ThemeContext.Provider,
    { value: { theme, toggleTheme } },
    children
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
