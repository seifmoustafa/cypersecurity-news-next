"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  MenuIcon,
  XIcon,
  Globe,
  LightbulbIcon,
  Search,
  Home,
  ToggleLeft,
  ToggleRight,
  Map,
  Users,
  Settings,
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
  const [tipsDisabled, setTipsDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Check tips status from localStorage
  useEffect(() => {
    const disabled = localStorage.getItem("tipOfTheDayDisabled") === "true";
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

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    setMobileMenuOpen(false);
  };

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    router.push(href);
  };

  // New navigation items as requested
  const navItems = [
    {
      key: "nav.home",
      href: "/",
      icon: Home,
      label: "الرئيسية"
    },
    {
      key: "nav.beginnersMode",
      href: "/simple",
      icon: Users,
      label: "الواجهة العامة"
    },
    {
      key: "nav.advancedMode",
      href: "/advanced",
      icon: Settings,
      label: "واجهة المتخصصين"
    },
    {
      key: "nav.sitemap",
      href: "/simple/sitemap",
      icon: Map,
      label: "خريطة الموقع"
    }
  ];

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
          {/* Left side: Logo + Navigation */}
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {/* Cybersecurity Logo */}
            <div className="flex items-center group">
            <Link
              href="/simple"
              className="flex items-center space-x-3 rtl:space-x-reverse group-hover:scale-105 transition-all duration-500"
              onClick={(e) => {
                e.preventDefault();
                router.push("/simple");
              }}
            >
              <img
                  src="/app-icon.png"
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

            {/* Desktop Navigation - New 8 buttons as requested */}
          <nav className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse">
            {/* 1. الرئيسية */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg",
                pathname === "/"
                      ? "bg-green-500/20 text-green-600 dark:text-green-300 shadow-lg backdrop-blur-sm border border-green-500/30"
                      : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
                  )}
              onClick={(e) => handleNavigation(e, "/")}
                >
              <Home className="h-4 w-4" />
              الرئيسية
                </Button>

            {/* 2. الواجهة العامة */}
                    <Button
                      variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg",
                pathname === "/simple"
                  ? "bg-green-500/20 text-green-600 dark:text-green-300 shadow-lg backdrop-blur-sm border border-green-500/30"
                  : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
              )}
              onClick={(e) => handleNavigation(e, "/simple")}
            >
              <Users className="h-4 w-4" />
              الواجهة العامة
                    </Button>

            {/* 3. واجهة المتخصصين */}
                    <Button
                      variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg",
                pathname === "/advanced"
                  ? "bg-green-500/20 text-green-600 dark:text-green-300 shadow-lg backdrop-blur-sm border border-green-500/30"
                  : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
              )}
              onClick={(e) => handleNavigation(e, "/advanced")}
            >
              <Settings className="h-4 w-4" />
              واجهة المتخصصين
                    </Button>

            {/* 4. خريطة الموقع */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg",
                pathname === "/simple/sitemap"
                  ? "bg-green-500/20 text-green-600 dark:text-green-300 shadow-lg backdrop-blur-sm border border-green-500/30"
                  : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
              )}
              onClick={(e) => handleNavigation(e, "/simple/sitemap")}
            >
              <Map className="h-4 w-4" />
              خريطة الموقع
            </Button>

            {/* 5. تفعيل/إيقاف النصائح */}
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
              {tipsDisabled ? "تفعيل النصائح" : "إيقاف النصائح"}
            </Button>

            {/* 6. البحث */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
            >
              <Search className="h-4 w-4" />
              البحث
            </Button>

            {/* 7. تغيير اللغة */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
            >
              <Globe className="h-4 w-4" />
              تغيير اللغة
            </Button>

            {/* 8. نهاري/ليلي */}
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
              {isDarkMode ? "نهاري" : "ليلي"}
            </Button>
            </nav>
          </div>

          {/* Mobile menu button - positioned on the right */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-slate-800/50 h-10 w-10 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
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
                placeholder="البحث في الموقع..."
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
                إلغاء
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
              {/* Navigation Items */}
              <div className="py-2">
                <div className="space-y-2">
                  {/* 1. الرئيسية */}
                  <button
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-sm w-full text-left group",
                      pathname === "/"
                        ? "bg-green-500/20 text-green-600 dark:text-green-300 border border-green-500/30"
                        : "text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={(e) => handleNavigation(e, "/")}
                  >
                    <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>الرئيسية</span>
                  </button>

                  {/* 2. الواجهة العامة */}
                  <button
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-sm w-full text-left group",
                      pathname === "/simple"
                        ? "bg-green-500/20 text-green-600 dark:text-green-300 border border-green-500/30"
                        : "text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={(e) => handleNavigation(e, "/simple")}
                  >
                    <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>الواجهة العامة</span>
                  </button>

                  {/* 3. واجهة المتخصصين */}
                <button
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-sm w-full text-left group",
                      pathname === "/advanced"
                        ? "bg-green-500/20 text-green-600 dark:text-green-300 border border-green-500/30"
                        : "text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={(e) => handleNavigation(e, "/advanced")}
                  >
                    <Settings className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>واجهة المتخصصين</span>
                  </button>

                  {/* 4. خريطة الموقع */}
                  <button
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-sm w-full text-left group",
                      pathname === "/simple/sitemap"
                        ? "bg-green-500/20 text-green-600 dark:text-green-300 border border-green-500/30"
                        : "text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={(e) => handleNavigation(e, "/simple/sitemap")}
                  >
                    <Map className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>خريطة الموقع</span>
                </button>

                  {/* 5. تفعيل/إيقاف النصائح */}
                <button
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-sm w-full text-left group text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleTips}
                >
                  <LightbulbIcon
                    className={`h-4 w-4 group-hover:scale-110 transition-transform duration-300 ${
                      tipsDisabled
                        ? "opacity-50 text-gray-400 dark:text-slate-400"
                        : "text-yellow-500 dark:text-yellow-400"
                    }`}
                  />
                    <span>{tipsDisabled ? "تفعيل النصائح" : "إيقاف النصائح"}</span>
                  </button>

                  {/* 6. البحث */}
                  <button
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-sm w-full text-left group text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleSearchToggle}
                  >
                    <Search className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>البحث</span>
                  </button>

                  {/* 7. تغيير اللغة */}
                  <button
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-sm w-full text-left group text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleLanguageToggle}
                  >
                    <Globe className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>تغيير اللغة</span>
                </button>

                  {/* 8. نهاري/ليلي */}
                      <button
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] hover:shadow-sm w-full text-left group text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleThemeToggle}
                  >
                    {isDarkMode ? (
                      <SunIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <MoonIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <span>{isDarkMode ? "نهاري" : "ليلي"}</span>
                      </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
