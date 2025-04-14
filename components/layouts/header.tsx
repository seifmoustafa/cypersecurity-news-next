"use client"

import { useState, useEffect } from "react"
import { MoonIcon, SunIcon, MenuIcon, XIcon, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ROUTES } from "@/lib/routes"
import { OptimizedLink } from "@/components/optimized-link"

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
  const pathname = usePathname()

  // Navigation items grouped by category
  const navGroups = [
    {
      title: "systems",
      items: [
        { key: "nav.systems", href: ROUTES.SECTIONS.SYSTEMS },
        { key: "nav.vulnerabilities", href: ROUTES.SECTIONS.SYSTEMS },
      ],
    },
    {
      title: "regulation",
      items: [
        { key: "nav.strategy", href: ROUTES.SECTIONS.REGULATION },
        { key: "nav.regulations", href: ROUTES.SECTIONS.REGULATION },
      ],
    },
    {
      title: "security",
      items: [
        { key: "nav.instructions", href: ROUTES.SECTIONS.INSTRUCTIONS },
        { key: "nav.procedures", href: ROUTES.SECTIONS.INSTRUCTIONS },
      ],
    },
    {
      title: "awareness",
      items: [
        { key: "nav.awareness", href: ROUTES.SECTIONS.AWARENESS },
        { key: "nav.news", href: ROUTES.NEWS.INDEX },
      ],
    },
    {
      title: "media",
      items: [{ key: "nav.videos", href: ROUTES.SECTIONS.MEDIA }],
    },
    {
      title: "standards",
      items: [
        { key: "nav.definitions", href: ROUTES.DEFINITIONS.INDEX },
        { key: "nav.framework", href: ROUTES.FRAMEWORK.INDEX },
        { key: "nav.standards", href: ROUTES.STANDARDS.INDEX },
      ],
    },
  ]

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll and update active section
  useEffect(() => {
    // Only run this on the homepage
    if (pathname !== "/") return

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
  }, [pathname])

  if (!mounted) return null

  const isDarkMode = theme === "dark"

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Helper function to handle navigation
  const handleNavigation = (href: string) => {
    // Close mobile menu when navigating
    setMobileMenuOpen(false)

    // If it's a hash link on the current page, handle smooth scrolling
    if (href.startsWith("#") && pathname === "/") {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
      return
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <OptimizedLink href={ROUTES.HOME} className="text-xl font-bold text-primary">
              {t("hero.title")}
            </OptimizedLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse">
            {navGroups.map((group) => (
              <DropdownMenu key={group.title}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    {t(`section.${group.title === "security" ? "instructions" : group.title}`)}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRtl ? "end" : "start"}>
                  {group.items.map((item) => (
                    <DropdownMenuItem key={item.key} asChild>
                      <OptimizedLink
                        href={item.href}
                        className={cn(
                          "w-full",
                          (item.href.startsWith("#") && item.href.substring(1) === activeSection) ||
                            (!item.href.startsWith("#") && pathname.startsWith(item.href))
                            ? "font-medium"
                            : "",
                        )}
                        onClick={() => handleNavigation(item.href)}
                      >
                        {t(item.key)}
                      </OptimizedLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          {/* Theme and Language Toggles */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onToggleLanguage} title={t("common.language")}>
              <Globe className="h-5 w-5" />
              <span className="sr-only">{t("common.language")}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              title={isDarkMode ? t("common.lightMode") : t("common.darkMode")}
            >
              {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              <span className="sr-only">{isDarkMode ? t("common.lightMode") : t("common.darkMode")}</span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
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
        <div className="lg:hidden bg-background border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              {navGroups.map((group) => (
                <div key={group.title} className="py-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t(`section.${group.title === "security" ? "instructions" : group.title}`)}
                  </h3>
                  <div className="space-y-1 pl-2 rtl:pr-2 rtl:pl-0">
                    {group.items.map((item) => (
                      <OptimizedLink
                        key={item.key}
                        href={item.href}
                        className={cn(
                          "block px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-muted",
                          (item.href.startsWith("#") && item.href.substring(1) === activeSection) ||
                            (!item.href.startsWith("#") && pathname.startsWith(item.href))
                            ? "text-primary font-medium"
                            : "text-foreground/80",
                        )}
                        onClick={() => handleNavigation(item.href)}
                      >
                        {t(item.key)}
                      </OptimizedLink>
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
