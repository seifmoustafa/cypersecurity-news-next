"use client"

import type { ReactNode } from "react"
import Header from "./header"
import Footer from "./footer"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar")
  }

  return (
    <div className={`flex flex-col min-h-screen font-${language === "ar" ? "tajawal" : "roboto"}`}>
      <Header onToggleTheme={toggleTheme} onToggleLanguage={toggleLanguage} />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  )
}
