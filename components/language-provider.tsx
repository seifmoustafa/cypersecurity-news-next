"use client"

import { createContext, useContext, useState, type ReactNode, useEffect, useLayoutEffect } from "react"
import { getTranslation, getDirection, type Language, type TranslationKey } from "@/lib/i18n"
import { getFontFamily } from "@/lib/fonts"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  dir: "rtl" | "ltr"
  isRtl: boolean
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Use useLayoutEffect on client, useEffect on server (to avoid SSR warning)
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with default language to prevent hydration mismatch
  const [language, setLanguage] = useState<Language>("ar")
  const [mounted, setMounted] = useState(false)

  // Get direction based on language
  const dir = getDirection(language)
  const isRtl = dir === "rtl"

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
    setMounted(true)
  }, [])

  // Save language preference when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language)
    }
  }, [language, mounted])

  // Update document direction based on language - use useLayoutEffect for synchronous update
  // This runs on EVERY render to ensure fonts are applied during client-side navigation
  useIsomorphicLayoutEffect(() => {
    // Always apply font styles - don't wait for mounted
    // This ensures fonts are applied on client-side navigation, not just initial load
    if (typeof window === "undefined") return

    document.documentElement.dir = dir
    document.documentElement.lang = language

    // Add a class to the body for language-specific styling
    document.body.classList.remove("rtl", "ltr")
    document.body.classList.add(isRtl ? "rtl" : "ltr")

    // Update font family based on language
    document.body.style.fontFamily = getFontFamily(isRtl)
  }) // No dependencies - runs on every render

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRtl }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
