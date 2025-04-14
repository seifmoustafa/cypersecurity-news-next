"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider {...props} enableSystem={true} enableColorScheme={true} storageKey="theme-preference">
      {children}
    </NextThemesProvider>
  )
}
