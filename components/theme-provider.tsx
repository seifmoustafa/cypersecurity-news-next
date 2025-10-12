"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Synchronize theme with localStorage on mount
    try {
      const storageKey = 'theme-preference'
      const stored = localStorage.getItem(storageKey)
      const isDark = stored ? stored === 'dark' : true // Default to dark
      
      // Apply theme immediately
      if (typeof document !== 'undefined') {
        const root = document.documentElement
        if (isDark) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    } catch (e) {
      // Fallback to dark theme if there's an error
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  // Don't render anything until mounted to avoid hydration issues
  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <NextThemesProvider 
      {...props} 
      enableColorScheme={true} 
      storageKey="theme-preference"
      defaultTheme="dark"
    >
      {children}
    </NextThemesProvider>
  )
}