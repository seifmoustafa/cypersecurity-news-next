"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  MenuIcon,
  XIcon,
  Globe,
  Shield,
  LightbulbIcon,
  Search,
  Home,
  Video,
  BookOpen,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Lock,
  Eye,
  AlertTriangle,
  Zap,
  Target,
  LockIcon,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

interface BeginnersHeaderProps {
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

export default function SimpleHeader({
  onToggleTheme,
  onToggleLanguage,
}: BeginnersHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, t, isRtl } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isBeginnersMode, setIsBeginnersMode] = useState(true);
  const [tipsDisabled, setTipsDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Check if we're in beginners mode from localStorage and tips status
  useEffect(() => {
    const beginnersMode = localStorage.getItem("beginnersMode") !== "false";
    const disabled = localStorage.getItem("tipOfTheDayDisabled") === "true";
    setIsBeginnersMode(beginnersMode);
    setTipsDisabled(disabled);
    setMounted(true);
  }, []);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchQuery.trim() && searchOpen) {
      router.push(
        `/simple/search?q=${encodeURIComponent(debouncedSearchQuery)}`
      );
      setSearchOpen(false);
    }
  }, [debouncedSearchQuery, router, searchOpen]);

  // Navigation items for beginners mode - matching the order of main page cards
  const beginnersNavItems = [
    {
      key: "beginners.navigation.beginnersInterface",
      href: "/simple",
      icon: Home,
    },

    { key: "beginners.cards.media.title", href: "/simple/media", icon: Video },
    {
      key: "beginners.cards.personalProtect.title",
      href: "/simple/personal-protect",
      icon: ShieldCheck,
    },
    {
      key: "beginners.cards.awareness.title",
      href: "/simple/awareness",
      icon: Lightbulb,
    },
    {
      key: "beginners.cards.definitions.title",
      href: "/simple/definitions-categories",
      icon: BookOpen,
    },
  ];

  if (!mounted) return null;

  const isDarkMode = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    onToggleTheme();
  };

  const handleLanguageToggle = () => {
    onToggleLanguage();
  };

  const handleLayoutSwitch = () => {
    const newMode = !isBeginnersMode;
    setIsBeginnersMode(newMode);
    localStorage.setItem("beginnersMode", newMode.toString());

    // If switching to advanced mode, redirect to main layout
    if (!newMode) {
      window.location.href = "/advanced";
    }
  };

  const toggleTips = () => {
    const newState = !tipsDisabled;
    localStorage.setItem("tipOfTheDayDisabled", newState.toString());
    setTipsDisabled(newState);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    setMobileMenuOpen(false);
  };

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700/50 shadow-2xl shadow-gray-900/10 dark:shadow-slate-900/20">
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(59,130,246,0.03)_50%,transparent_75%)] dark:bg-[linear-gradient(90deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-full 2xl:max-w-[1600px]">
        <div className="h-20 flex items-center justify-between">
          {/* Cybersecurity Logo */}
          <div className="flex items-center group ml-1">
            <Link
              href="/simple"
              className="flex items-center space-x-3 rtl:space-x-reverse group-hover:scale-105 transition-all duration-500"
              onClick={(e) => {
                e.preventDefault();
                router.push("/simple");
              }}
            >
              <img
                src="/assets/app-icon"
                alt="Cybersecurity Portal"
                className="h-12 w-12 object-contain group-hover:scale-110 transition-all duration-500"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-300 transition-all duration-500 drop-shadow-lg">
                  <span className="hidden sm:inline">
                    {t("beginners.title")}
                  </span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse">
            {beginnersNavItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg",
                    isActive
                      ? "bg-green-500/20 text-green-600 dark:text-green-300 shadow-lg backdrop-blur-sm border border-green-500/30"
                      : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
                  )}
                  onClick={(e) => handleNavigation(e, item.href)}
                >
                  <IconComponent className="h-4 w-4" />
                  {t(item.key)}
                </Button>
              );
            })}
          </nav>

          {/*
            Old design reference: icon-only action buttons with tooltips
            ------------------------------------------------------------------
            To restore this version, replace the current "Action Buttons"
            block below with the following and re-add the tooltip imports:
              import {
                Tooltip,
                TooltipContent,
                TooltipProvider,
                TooltipTrigger,
              } from "@/components/ui/tooltip";

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLayoutSwitch}
                      title={
                        isBeginnersMode ? t("nav.advancedMode") : t("nav.beginnersMode")
                      }
                      className="hover:bg-gray-100 dark:hover:bg-slate-800/50 h-10 w-10 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    >
                      {isBeginnersMode ? (
                        <ToggleRight className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-gray-600 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-300" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-gray-600 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-300" />
                      )}
                      <span className="sr-only">
                        {isBeginnersMode ? t("nav.advancedMode") : t("nav.beginnersMode")}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isBeginnersMode ? t("nav.advancedMode") : t("nav.beginnersMode")}</p>
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
                      className="hover:bg-gray-100 dark:hover:bg-slate-800/50 h-10 w-10 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    >
                      <LightbulbIcon
                        className={`h-5 w-5 group-hover:scale-110 transition-all duration-300 ${
                          tipsDisabled
                            ? "opacity-50 text-gray-400 dark:text-slate-400"
                            : "text-yellow-500 dark:text-yellow-400"
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
                      onClick={handleSearchToggle}
                      title={t("common.search")}
                      className="hover:bg-gray-100 dark:hover:bg-slate-800/50 h-10 w-10 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    >
                      <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-gray-600 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-300" />
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
                      onClick={handleLanguageToggle}
                      title={t("common.language")}
                      className="hover:bg-gray-100 dark:hover:bg-slate-800/50 h-10 w-10 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    >
                      <Globe className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-gray-600 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-300" />
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
                      title={isDarkMode ? t("common.lightMode") : t("common.darkMode")}
                      className="hover:bg-gray-100 dark:hover:bg-slate-800/50 h-10 w-10 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    >
                      {isDarkMode ? (
                        <SunIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-gray-600 dark:text-slate-300 group-hover:text-yellow-500 dark:group-hover:text-yellow-400" />
                      ) : (
                        <MoonIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-gray-600 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                      )}
                      <span className="sr-only">
                        {isDarkMode ? t("common.lightMode") : t("common.darkMode")}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isDarkMode ? t("common.lightMode") : t("common.darkMode")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push("/")}
                      title={t("nav.home")}
                      className="hover:bg-gray-100 dark:hover:bg-slate-800/50 h-10 w-10 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    >
                      <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-gray-600 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-300" />
                      <span className="sr-only">{t("nav.home")}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("nav.home")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          */}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Layout Switch Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLayoutSwitch}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
            >
              {isBeginnersMode ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
              {isBeginnersMode ? t("nav.advancedMode") : t("nav.beginnersMode")}
            </Button>

            {/* Tips Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTips}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
            >
              <LightbulbIcon
                className={`h-4 w-4 ${
                  tipsDisabled
                    ? "opacity-50 text-gray-400 dark:text-slate-400"
                    : "text-yellow-500 dark:text-yellow-400"
                }`}
              />
              {tipsDisabled ? t("tips.enable") : t("tips.disable")}
            </Button>

            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
            >
              <Search className="h-4 w-4" />
              {t("common.search")}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
            >
              <Globe className="h-4 w-4" />
              {t("common.language")}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThemeToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
            >
              {isDarkMode ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
              {isDarkMode ? t("common.lightMode") : t("common.darkMode")}
            </Button>

            {/* Home Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
            >
              <Home className="h-4 w-4" />
              {t("nav.home")}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100 dark:hover:bg-slate-800/50 h-10 w-10 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-gray-600 dark:text-slate-300 group-hover:text-red-500 dark:group-hover:text-red-400" />
              ) : (
                <MenuIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-gray-600 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-300" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 z-40 bg-gradient-to-r from-gray-100 to-white dark:from-slate-900 dark:to-gray-900 border-b border-gray-200 dark:border-slate-700/50 shadow-2xl shadow-gray-900/10 dark:shadow-slate-900/20 animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-4 py-6 max-w-full 2xl:max-w-[1600px]">
            <div className="flex items-center gap-3 bg-gray-200/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-300/50 dark:border-slate-700/50">
              <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
              <input
                type="text"
                placeholder={t("common.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-gray-500 dark:placeholder:text-slate-400 text-gray-800 dark:text-white focus:text-gray-900 dark:focus:text-white transition-colors duration-300"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const query = e.currentTarget.value.trim();
                    if (query) {
                      router.push(
                        `/simple/search?q=${encodeURIComponent(query)}`
                      );
                      setSearchOpen(false);
                      setSearchQuery("");
                    }
                  } else if (e.key === "Escape") {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700/50 transition-all duration-300"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-r from-gray-100 to-white dark:from-slate-900 dark:to-gray-900 border-b border-gray-200 dark:border-slate-700/50 max-h-[80vh] overflow-y-auto shadow-2xl shadow-gray-900/10 dark:shadow-slate-900/20 animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {/* Layout Switch in Mobile */}
              <div className="py-2 border-b border-gray-300/50 dark:border-slate-700/50">
                <button
                  className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-md text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white w-full text-left group"
                  onClick={handleLayoutSwitch}
                >
                  {isBeginnersMode ? (
                    <ToggleRight className="h-4 w-4 text-gray-600 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-300 group-hover:scale-110 transition-all duration-300" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-gray-600 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-300 group-hover:scale-110 transition-all duration-300" />
                  )}
                  {isBeginnersMode
                    ? t("nav.advancedMode")
                    : t("nav.beginnersMode")}
                </button>
              </div>

              {/* Tips Toggle in Mobile */}
              <div className="py-2 border-b border-gray-300/50 dark:border-slate-700/50">
                <button
                  className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-md text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white w-full text-left group"
                  onClick={toggleTips}
                >
                  <LightbulbIcon
                    className={`h-4 w-4 group-hover:scale-110 transition-transform duration-300 ${
                      tipsDisabled
                        ? "opacity-50 text-gray-400 dark:text-slate-400"
                        : "text-yellow-500 dark:text-yellow-400"
                    }`}
                  />
                  {tipsDisabled ? t("tips.enable") : t("tips.disable")}
                </button>
              </div>

              {/* Navigation Items */}
              <div className="py-2">
                <div className="space-y-2">
                  {beginnersNavItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={item.key}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-sm w-full text-left group",
                          isActive
                            ? "bg-green-500/20 text-green-600 dark:text-green-300 border border-green-500/30"
                            : "text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                        )}
                        onClick={(e) => handleNavigation(e, item.href)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        <span>{t(item.key)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
