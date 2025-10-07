"use client";

import type { ReactNode } from "react";
import SimpleHeader from "./simple-header";
import SimpleFooter from "./simple-footer";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/language-provider";
import FloatingSystemButton from "@/components/floating-system-button";
import { useEffect } from "react";

interface BeginnersLayoutProps {
  children: ReactNode;
}

export default function SimpleLayout({ children }: BeginnersLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // theme and language are hydrated by providers in app/beginners/layout.tsx
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      <SimpleHeader onToggleTheme={toggleTheme} onToggleLanguage={toggleLanguage} />
      <main className="flex-grow pt-24 w-full relative">
        {children}
        {/* Floating system button for pinned system */}
        <FloatingSystemButton />
      </main>
      <SimpleFooter />
    </div>
  );
}


