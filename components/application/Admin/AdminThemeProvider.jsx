'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

const AdminThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
})

export const useAdminTheme = () => useContext(AdminThemeContext)

export const AdminThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem('admin-theme')
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin-theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [theme, mounted])

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme)
  }

  if (!mounted) {
    return <div>{children}</div>
  }

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}
