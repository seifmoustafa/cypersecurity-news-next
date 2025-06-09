"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MoonIcon, SunIcon, MenuIcon, XIcon, Globe, ChevronDown, Shield, LightbulbIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [tipsDisabled, setTipsDisabled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === "/"

  // Navigation groups
  const navGroups = [
    {
      title: "cybersecurityRegulation",
      items: [
        { key: "regulation.council", href: "/regulation/1", isScroll: false },
        { key: "regulation.strategy", href: "/regulation/2", isScroll: false },
        { key: "regulation.executive", href: "/regulation/3", isScroll: false },
      ],
    },
    {
      title: "awareness",
      items: [
        { key: "awareness.news", href: "#awareness", isScroll: true, tab: "news" },
        { key: "awareness.bulletins", href: "#awareness", isScroll: true, tab: "bulletins" },
        { key: "awareness.articles", href: "#awareness", isScroll: true, tab: "articles" },
      ],
    },
    {
      title: "securityRequirements",
      items: [
        { key: "nav.instructions", href: "#security-requirements", isScroll: true, tab: "instructions" },
        { key: "nav.securityProcedures", href: "#security-requirements", isScroll: true, tab: "procedures" },
      ],
    },
    {
      title: "cybersecurityConcepts",
      items: [
        { key: "section.definitions", href: "#standards", isScroll: true, tab: "definitions" },
        { key: "section.laws", href: "#standards", isScroll: true, tab: "laws" },
        { key: "section.framework", href: "#standards", isScroll: true, tab: "framework" },
        { key: "section.standards", href: "#standards", isScroll: true, tab: "standards" },
      ],
    },
    {
      title: "documentLibrary",
      items: [
        { key: "media.videos", href: "#media", isScroll: true, tab: "videos" },
        { key: "media.lectures", href: "#media", isScroll: true, tab: "lectures" },
        { key: "media.presentations", href: "#media", isScroll: true, tab: "presentations" },
      ],
    },
    {
      title: "systems",
      items: [
        { key: "systems.operations", href: "#systems", isScroll: true },
        { key: "systems.support", href: "#systems", isScroll: true },
        { key: "systems.vulnerabilities", href: "#systems", isScroll: true },
      ],
    },
  ]

  // Check if tips are disabled on mount
  useEffect(() => {
    const disabled = localStorage.getItem("tipOfTheDayDisabled") === "true"
    setTipsDisabled(disabled)
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

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [isHomePage])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null)
    }

    if (openDropdown) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [openDropdown])

  if (!mounted) return null

  const isDarkMode = theme === "dark"

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    onToggleTheme()
  }

  const handleLanguageToggle = () => {
    onToggleLanguage()
  }

  const toggleTips = () => {
    const newState = !tipsDisabled
    localStorage.setItem("tipOfTheDayDisabled", newState.toString())
    setTipsDisabled(newState)
  }

  const handleDropdownToggle = (groupTitle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenDropdown(openDropdown === groupTitle ? null : groupTitle)
  }

  const handleNavigation = (e: React.MouseEvent, href: string, isScroll: boolean, tab?: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    setOpenDropdown(null)

    if (href === "/") {
      router.push("/")
      return
    }

    if (isScroll && isHomePage) {
      const hashPart = href.split("?")[0]
      const sectionId = hashPart.substring(1)

      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
        window.history.pushState(null, "", hashPart)

        if (tab) {
          const tabChangeEvent = new CustomEvent("tabchange", {
            detail: { sectionId, tab },
          })
          window.dispatchEvent(tabChangeEvent)
        }
      }
    } else if (isScroll && !isHomePage) {
      const baseUrl = "/"
      const hashPart = href.split("?")[0]
      const navigationUrl = baseUrl + hashPart

      if (tab) {
        sessionStorage.setItem(`${hashPart.substring(1)}_activeTab`, tab)
      }

      window.location.href = navigationUrl
    } else {
      router.push(href)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-blue-200/20 dark:border-blue-800/20 shadow-sm">
      <div className="container mx-auto px-4 max-w-full 2xl:max-w-[1600px]">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center"
              onClick={(e) => {
                e.preventDefault()
                router.push("/")
              }}
            >
              <Shield className="h-6 w-6 text-primary mr-2 rtl:ml-2 rtl:mr-0" />
              <span className="hidden sm:inline">{t("hero.title")}</span>
              <span className="sm:hidden">CyberSec</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse xl:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-xs xl:text-sm"
              onClick={(e) => {
                e.preventDefault()
                router.push("/")
              }}
            >
              {t("nav.home")}
            </Button>

            {navGroups.map((group) => (
              <div key={group.title} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center gap-1 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-xs xl:text-sm",
                    openDropdown === group.title ? "bg-blue-50/50 dark:bg-blue-900/20" : "",
                  )}
                  onClick={(e) => handleDropdownToggle(group.title, e)}
                >
                  {t(`section.${group.title}`)}
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 xl:h-4 xl:w-4 opacity-50 transition-transform",
                      openDropdown === group.title ? "rotate-180" : "",
                    )}
                  />
                </Button>

                {/* Custom Dropdown */}
                {openDropdown === group.title && (
                  <div
                    className={cn(
                      "absolute top-full mt-1 min-w-[200px] bg-background/95 backdrop-blur-md border border-blue-200/30 dark:border-blue-800/30 shadow-lg rounded-md py-1 z-[100]",
                      isRtl ? "right-0" : "left-0",
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {group.items.map((item) => (
                      <button
                        key={item.key}
                        className={cn(
                          "w-full px-3 py-2 text-left text-xs xl:text-sm hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors",
                          item.href.split("?")[0].substring(1) === activeSection
                            ? "font-medium text-primary"
                            : "text-foreground",
                        )}
                        onClick={(e) => handleNavigation(e, item.href, item.isScroll, item.tab)}
                      >
                        {t(item.key)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Theme, Tips, and Language Toggles */}
          <div className="flex items-center gap-1 md:gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTips}
                    title={tipsDisabled ? t("tips.enable") : t("tips.disable")}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10"
                  >
                    <LightbulbIcon
                      className={`h-4 w-4 md:h-5 md:w-5 ${tipsDisabled ? "opacity-50" : "text-yellow-500"}`}
                    />
                    <span className="sr-only">{tipsDisabled ? t("tips.enable") : t("tips.disable")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tipsDisabled ? t("tips.enable") : t("tips.disable")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLanguageToggle}
              title={t("common.language")}
              className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10"
            >
              <Globe className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">{t("common.language")}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              title={isDarkMode ? t("common.lightMode") : t("common.darkMode")}
              className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10"
            >
              {isDarkMode ? (
                <SunIcon className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <MoonIcon className="h-4 w-4 md:h-5 md:w-5" />
              )}
              <span className="sr-only">{isDarkMode ? t("common.lightMode") : t("common.darkMode")}</span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <MenuIcon className="h-4 w-4 md:h-5 md:w-5" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-b border-blue-200/20 dark:border-blue-800/20 max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              <div className="py-2">
                <button
                  className="block px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-foreground/80 w-full text-left"
                  onClick={(e) => {
                    e.preventDefault()
                    setMobileMenuOpen(false)
                    router.push("/")
                  }}
                >
                  {t("nav.home")}
                </button>
              </div>
              {navGroups.map((group) => (
                <div key={group.title} className="py-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t(`section.${group.title}`)}</h3>
                  <div className="space-y-1 pl-2 rtl:pr-2 rtl:pl-0">
                    {group.items.map((item) => (
                      <button
                        key={item.key}
                        className={cn(
                          "block px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/20 w-full text-left",
                          item.href.split("?")[0].substring(1) === activeSection
                            ? "text-primary font-medium"
                            : "text-foreground/80",
                        )}
                        onClick={(e) => handleNavigation(e, item.href, item.isScroll, item.tab)}
                      >
                        {t(item.key)}
                      </button>
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
