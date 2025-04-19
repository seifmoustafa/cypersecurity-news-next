"use client"

import { useState, useEffect } from "react"
import { MoonIcon, SunIcon, MenuIcon, XIcon, Globe, ChevronDown, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onToggleTheme: () => void
  onToggleLanguage: () => void
}

export default function Header({ onToggleTheme, onToggleLanguage }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { language, t, isRtl } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  // Navigation items grouped by category
  const navGroups = [
    {
      title: "systems",
      items: [
        { key: "nav.systems", href: "#systems" },
        { key: "nav.vulnerabilities", href: "#systems" },
      ],
    },
    {
      title: "regulation",
      items: [
        { key: "nav.strategy", href: "#regulation" },
        { key: "nav.regulations", href: "#regulation" },
      ],
    },
    {
      title: "security",
      items: [
        { key: "nav.instructions", href: "#instructions" },
        { key: "nav.procedures", href: "#instructions" },
      ],
    },
    {
      title: "awareness",
      items: [
        { key: "nav.awareness", href: "#awareness" },
        { key: "nav.news", href: "#awareness" },
      ],
    },
    {
      title: "media",
      items: [{ key: "nav.videos", href: "#media" }],
    },
    {
      title: "standards",
      items: [
        { key: "nav.definitions", href: "#standards" },
        { key: "nav.framework", href: "#standards" },
        { key: "nav.standards", href: "#standards" },
      ],
    },
  ]

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll and update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".section-anchor")
      let currentActiveSection = ""

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top
        if (sectionTop <= 100) {
          currentActiveSection = section.id
        }
      })

      setActiveSection(currentActiveSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  const isDarkMode = theme === "dark"

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-blue-200/20 dark:border-blue-800/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center"
            >
              <Shield className="h-6 w-6 text-primary mr-2 rtl:ml-2 rtl:mr-0" />
              {t("hero.title")}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse">
            {navGroups.map((group) => (
              <DropdownMenu key={group.title}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                  >
                    {t(`section.${group.title === "security" ? "instructions" : group.title}`)}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isRtl ? "end" : "start"}
                  className="border border-blue-200/30 dark:border-blue-800/30"
                >
                  {group.items.map((item) => (
                    <DropdownMenuItem key={item.key} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "w-full",
                          item.href.substring(1) === activeSection ? "font-medium text-primary" : "",
                        )}
                        onClick={() => {
                          const element = document.querySelector(item.href)
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" })
                          }
                        }}
                      >
                        {t(item.key)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          {/* Theme and Language Toggles */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleLanguage}
              title={t("common.language")}
              className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">{t("common.language")}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              title={isDarkMode ? t("common.lightMode") : t("common.darkMode")}
              className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            >
              {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              <span className="sr-only">{isDarkMode ? t("common.lightMode") : t("common.darkMode")}</span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-b border-blue-200/20 dark:border-blue-800/20">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              {navGroups.map((group) => (
                <div key={group.title} className="py-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t(`section.${group.title === "security" ? "instructions" : group.title}`)}
                  </h3>
                  <div className="space-y-1 pl-2 rtl:pr-2 rtl:pl-0">
                    {group.items.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        className={cn(
                          "block px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
                          item.href.substring(1) === activeSection ? "text-primary font-medium" : "text-foreground/80",
                        )}
                        onClick={() => {
                          setMobileMenuOpen(false)
                          const element = document.querySelector(item.href)
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" })
                          }
                        }}
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
