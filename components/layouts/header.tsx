"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  MenuIcon,
  XIcon,
  Globe,
  ChevronDown,
  Shield,
  LightbulbIcon,
  Search,
  Home,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

export default function Header({
  onToggleTheme,
  onToggleLanguage,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, t, isRtl } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [tipsDisabled, setTipsDisabled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isBeginnersMode, setIsBeginnersMode] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/advanced" || pathname === "/advanced/";

  // Navigation groups
  const navGroups = [
    {
      title: "awareness",
      items: [
        {
          key: "awareness.news",
          href: "#awareness",
          isScroll: true,
          tab: "news",
        },
        {
          key: "awareness.bulletins",
          href: "#awareness",
          isScroll: true,
          tab: "bulletins",
        },
        {
          key: "awareness.articles",
          href: "#awareness",
          isScroll: true,
          tab: "articles",
        },
      ],
    },
    {
      title: "securityRequirements",
      items: [
        {
          key: "nav.instructions",
          href: "#security-requirements",
          isScroll: true,
          tab: "instructions",
        },
        {
          key: "nav.securityProcedures",
          href: "#security-requirements",
          isScroll: true,
          tab: "procedures",
        },
      ],
    },
    {
      title: "cybersecurityConcepts",
      items: [
        {
          key: "section.definitions",
          href: "#concepts",
          isScroll: true,
          tab: "definitions",
        },
        {
          key: "section.laws",
          href: "#concepts",
          isScroll: true,
          tab: "laws",
        },
        {
          key: "section.regulation",
          href: "#concepts",
          isScroll: true,
          tab: "regulation",
        },
        {
          key: "section.framework",
          href: "#concepts",
          isScroll: true,
          tab: "framework",
        },
        
      ],
    },
    {
      title: "documentLibrary",
      items: [
        { key: "media.videos", href: "#media", isScroll: true, tab: "videos" },
        {
          key: "media.lectures",
          href: "#media",
          isScroll: true,
          tab: "lectures",
        },
        
      ],
    },
    {
      title: "systems",
      items: [
        { key: "systems.mainSystems", href: "#systems", isScroll: true },
        { key: "systems.helperSystems", href: "#helpers", isScroll: true },
      ],
    },
  ];

  // Check if tips are disabled on mount and beginners mode
  useEffect(() => {
    const disabled = localStorage.getItem("tipOfTheDayDisabled") === "true";
    const beginnersMode = localStorage.getItem("beginnersMode") === "true";
    setTipsDisabled(disabled);
    setIsBeginnersMode(beginnersMode);
    setMounted(true);
  }, []);

  // Handle scroll and update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".section-anchor");
      let currentActiveSection = "";
      const windowHeight = window.innerHeight;

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;

        // Consider a section active if it's in the top portion of the viewport
        if (sectionTop <= windowHeight * 0.3) {
          currentActiveSection = section.id;
        }
      });

      // If we're at the bottom of the page and no section is active,
      // use the last section
      if (!currentActiveSection && sections.length > 0) {
        const lastSection = sections[sections.length - 1] as HTMLElement;
        const lastSectionBottom = lastSection.getBoundingClientRect().bottom;
        if (lastSectionBottom <= windowHeight) {
          currentActiveSection = lastSection.id;
        }
      }

      setActiveSection(currentActiveSection);
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      // Initial check
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isHomePage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openDropdown]);

  if (!mounted) return null;

  const isDarkMode = theme === "dark";

  const handleThemeToggle = () => {
    onToggleTheme();
  };

  const handleLanguageToggle = () => {
    onToggleLanguage();
  };

  const toggleTips = () => {
    const newState = !tipsDisabled;
    localStorage.setItem("tipOfTheDayDisabled", newState.toString());
    setTipsDisabled(newState);
  };

  const handleDropdownToggle = (groupTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === groupTitle ? null : groupTitle);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleLayoutSwitch = () => {
    const newMode = !isBeginnersMode;
    setIsBeginnersMode(newMode);
    localStorage.setItem("beginnersMode", newMode.toString());

    // If switching to beginners mode, redirect to beginners layout
    if (newMode) {
      window.location.href = "/simple";
    }
  };

  const handleNavigation = (
    e: React.MouseEvent,
    href: string,
    isScroll: boolean,
    tab?: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setOpenDropdown(null);

    console.log("Navigation triggered:", { href, isScroll, isHomePage });

    if (href === "/") {
      router.push("/advanced");
      return;
    }

    if (isScroll && isHomePage) {
      const hashPart = href.split("?")[0];
      const sectionId = hashPart.substring(1);
      console.log("Scrolling to section:", sectionId);

      const element = document.getElementById(sectionId);
      if (element) {
        console.log("Element found, scrolling...");
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", hashPart);

        if (tab) {
          const tabChangeEvent = new CustomEvent("tabchange", {
            detail: { sectionId, tab },
          });
          window.dispatchEvent(tabChangeEvent);
        }
      } else {
        console.log("Element not found for ID:", sectionId);
      }
    } else if (isScroll && !isHomePage) {
      console.log("Not on homepage, navigating to homepage with hash");
      const baseUrl = "/advanced";
      const hashPart = href.split("?")[0];
      const navigationUrl = baseUrl + hashPart;

      if (tab) {
        sessionStorage.setItem(`${hashPart.substring(1)}_activeTab`, tab);
      }

      window.location.href = navigationUrl;
    } else {
      console.log("Regular navigation to:", href);
      router.push(href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-blue-200/30 dark:border-blue-800/30 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20">
      <div className="container mx-auto px-2 sm:px-3 lg:px-4 max-w-full 2xl:max-w-[1600px]">
        <div className="h-20 flex items-center justify-between">
          {/* Enhanced Logo */}
          <div className="flex items-center group">
            <Link
              href="/advanced"
              className="flex items-center space-x-3 rtl:space-x-reverse group-hover:scale-105 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                router.push("/advanced");
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                {/* <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-2.5 rounded-xl shadow-lg"> */}
                  <img
                    src="/assets/app-icon"
                    alt="Cybersecurity Portal"
                    className="h-12 w-12 object-contain group-hover:scale-110 transition-all duration-500"
                  />
                {/* </div> */}
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:from-blue-700 group-hover:to-cyan-600 transition-all duration-300 whitespace-nowrap">
                  <span className="hidden sm:inline">{t("hero.title")}</span>
                  <span className="sm:hidden">CyberSec</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse xl:space-x-2 2xl:space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-sm lg:text-base xl:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-md px-2 lg:px-3 xl:px-4 py-2 lg:py-2.5 xl:py-3"
              onClick={(e) => {
                e.preventDefault();
                router.push("/advanced");
              }}
            >
              <Home className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 mr-1 rtl:ml-1 rtl:mr-0" />
              {t("nav.home")}
            </Button>

            {navGroups.map((group) => (
              // Dropdown navigation
              <div key={group.title} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-sm lg:text-base xl:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-md px-2 lg:px-3 xl:px-4 py-2 lg:py-2.5 xl:py-3",
                    openDropdown === group.title
                      ? "bg-blue-50/50 dark:bg-blue-900/20 shadow-md"
                      : ""
                  )}
                  onClick={(e) => handleDropdownToggle(group.title, e)}
                >
                  {t(`section.${group.title}`)}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 opacity-50 transition-all duration-300",
                      openDropdown === group.title
                        ? "rotate-180 opacity-100"
                        : ""
                    )}
                  />
                </Button>

                {/* Enhanced Custom Dropdown */}
                {openDropdown === group.title && (
                  <div
                    className={cn(
                      "absolute top-full mt-2 min-w-[240px] lg:min-w-[280px] xl:min-w-[320px] bg-white dark:bg-gray-900 border border-blue-200/40 dark:border-blue-800/40 shadow-xl shadow-blue-500/10 dark:shadow-blue-500/20 rounded-xl py-3 z-[100] animate-in slide-in-from-top-2 duration-300",
                      isRtl ? "right-0" : "left-0"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {group.items.map((item, index) => (
                      <button
                        key={item.key}
                        className={cn(
                          "w-full px-4 lg:px-5 xl:px-6 py-3 lg:py-4 text-left text-sm lg:text-base xl:text-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-sm group",
                          item.href.split("?")[0].substring(1) === activeSection
                            ? "font-medium text-primary bg-blue-50/30 dark:bg-blue-900/10"
                            : "text-foreground"
                        )}
                        onClick={(e) =>
                          handleNavigation(
                            e,
                            item.href,
                            item.isScroll,
                            (item as any).tab
                          )
                        }
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{t(item.key)}</span>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 opacity-0 group-hover:opacity-100 transition-all duration-300",
                              isRtl ? "rotate-180" : ""
                            )}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center gap-0.5 md:gap-1">
            {/* Layout Switch Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLayoutSwitch}
                    title={
                      isBeginnersMode
                        ? t("nav.advancedMode")
                        : t("nav.beginnersMode")
                    }
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10 transition-all duration-300 hover:scale-110 hover:shadow-md group"
                  >
                    {isBeginnersMode ? (
                      <ToggleRight className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300 text-blue-500" />
                    )}
                    <span className="sr-only">
                      {isBeginnersMode
                        ? t("nav.advancedMode")
                        : t("nav.beginnersMode")}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isBeginnersMode
                      ? t("nav.advancedMode")
                      : t("nav.beginnersMode")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSearchToggle}
                    title={t("common.search")}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10 transition-all duration-300 hover:scale-110 hover:shadow-md group"
                  >
                    <Search className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="sr-only">{t("common.search")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("common.search")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTips}
                    title={tipsDisabled ? t("tips.enable") : t("tips.disable")}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10 transition-all duration-300 hover:scale-110 hover:shadow-md group"
                  >
                    <LightbulbIcon
                      className={`h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-all duration-300 ${
                        tipsDisabled ? "opacity-50" : "text-yellow-500"
                      }`}
                    />
                    <span className="sr-only">
                      {tipsDisabled ? t("tips.enable") : t("tips.disable")}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tipsDisabled ? t("tips.enable") : t("tips.disable")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLanguageToggle}
                    title={t("common.language")}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10 transition-all duration-300 hover:scale-110 hover:shadow-md group"
                  >
                    <Globe className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="sr-only">{t("common.language")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("common.language")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleThemeToggle}
                    title={
                      isDarkMode ? t("common.lightMode") : t("common.darkMode")
                    }
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10 transition-all duration-300 hover:scale-110 hover:shadow-md group"
                  >
                    {isDarkMode ? (
                      <SunIcon className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <MoonIcon className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <span className="sr-only">
                      {isDarkMode
                        ? t("common.lightMode")
                        : t("common.darkMode")}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isDarkMode ? t("common.lightMode") : t("common.darkMode")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Home Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/")}
                    title={t("nav.home")}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10 transition-all duration-300 hover:scale-110 hover:shadow-md group"
                  >
                    <Home className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="sr-only">{t("nav.home")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("nav.home")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Enhanced Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-8 w-8 md:h-10 md:w-10 transition-all duration-300 hover:scale-110 hover:shadow-md group"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <MenuIcon className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Animated Search Bar */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-blue-200/30 dark:border-blue-800/30 shadow-xl shadow-blue-500/10 dark:shadow-blue-500/20 animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-4 py-6 max-w-full 2xl:max-w-[1600px]">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-blue-200/30 dark:border-blue-800/30">
              <Search className="h-5 w-5 text-primary" />
              <input
                type="text"
                placeholder={t("common.searchPlaceholder")}
                className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground focus:text-foreground transition-colors duration-300"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const query = e.currentTarget.value.trim();
                    if (query) {
                      router.push(`/advanced/search?q=${encodeURIComponent(query)}`);
                      setSearchOpen(false);
                    }
                  } else if (e.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-blue-200/30 dark:border-blue-800/30 max-h-[80vh] overflow-y-auto shadow-xl shadow-blue-500/10 dark:shadow-blue-500/20 animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {/* Layout Switch in Mobile */}
              <div className="py-2 border-b border-blue-200/30 dark:border-blue-800/30">
                <button
                  className="flex items-center gap-3 px-4 py-3 text-base lg:text-lg rounded-xl transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:scale-[1.02] hover:shadow-md text-foreground/80 w-full text-left group"
                  onClick={handleLayoutSwitch}
                >
                  {isBeginnersMode ? (
                    <ToggleRight className="h-5 w-5 lg:h-6 lg:w-6 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 lg:h-6 lg:w-6 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  {isBeginnersMode
                    ? t("nav.advancedMode")
                    : t("nav.beginnersMode")}
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 lg:h-6 lg:w-6 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300",
                      isRtl ? "rotate-180" : ""
                    )}
                  />
                </button>
              </div>

              <div className="py-2">
                <button
                  className="flex items-center gap-3 px-4 py-3 text-base lg:text-lg rounded-xl transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:scale-[1.02] hover:shadow-md text-foreground/80 w-full text-left group"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    router.push("/advanced");
                  }}
                >
                  <Home className="h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-300" />
                  {t("nav.home")}
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 lg:h-6 lg:w-6 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300",
                      isRtl ? "rotate-180" : ""
                    )}
                  />
                </button>
              </div>

              {navGroups.map((group) => (
                <div key={group.title} className="py-2">
                  {/* Enhanced Group with items in mobile menu */}
                  <>
                    <h3 className="text-base lg:text-lg font-bold text-primary mb-3 px-3 py-2 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                      {t(`section.${group.title}`)}
                    </h3>
                    <div className="space-y-2 pl-4 rtl:pr-4 rtl:pl-0">
                      {group.items.map((item, index) => (
                        <button
                          key={item.key}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm lg:text-base rounded-lg transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:scale-[1.02] hover:shadow-sm w-full text-left group",
                            item.href.split("?")[0].substring(1) ===
                              activeSection
                              ? "text-primary font-medium bg-blue-50/30 dark:bg-blue-900/10"
                              : "text-foreground/80"
                          )}
                          onClick={(e) =>
                            handleNavigation(
                              e,
                            item.href,
                              item.isScroll,
                              (item as any).tab
                            )
                          }
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span>{t(item.key)}</span>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 lg:h-5 lg:w-5 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300",
                              isRtl ? "rotate-180" : ""
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
