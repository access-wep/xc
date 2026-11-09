'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const defaultThemeContext: ThemeContextType = {
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
}

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fekrto-theme') as Theme | null
      if (stored) {
        setThemeState(stored)
        document.documentElement.classList.toggle('dark', stored === 'dark')
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setThemeState('dark')
        document.documentElement.classList.add('dark')
      }
    } catch (e) {
      // LocalStorage access guard
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem('fekrto-theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    } catch (e) {}
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  return context || defaultThemeContext
}
