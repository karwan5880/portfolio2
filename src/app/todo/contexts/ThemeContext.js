'use client'

import { DEFAULT_THEME, THEMES, THEME_CONFIG } from '../utils/themes'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME)
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize theme
  useEffect(() => {
    // Load theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme')
    const theme = savedTheme && THEME_CONFIG[savedTheme] ? savedTheme : DEFAULT_THEME
    setCurrentTheme(theme)
    setIsHydrated(true)
  }, [])

  const changeTheme = (newTheme) => {
    if (THEME_CONFIG[newTheme]) {
      setCurrentTheme(newTheme)
      localStorage.setItem('theme', newTheme)
    }
  }

  const getThemeClasses = (element) => {
    return THEME_CONFIG[currentTheme]?.classes[element] || ''
  }

  const getThemeConfig = () => {
    return THEME_CONFIG[currentTheme]
  }

  const getAllThemes = () => {
    return Object.keys(THEME_CONFIG).map((key) => ({
      key,
      ...THEME_CONFIG[key],
    }))
  }

  const value = {
    currentTheme,
    changeTheme,
    getThemeClasses,
    getThemeConfig,
    getAllThemes,
    isHydrated,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
