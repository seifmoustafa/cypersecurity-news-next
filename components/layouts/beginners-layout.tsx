"use client";

import type { ReactNode } from "react";
import BeginnersHeader from "./beginners-header";
import BeginnersFooter from "./beginners-footer";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/language-provider";
import FloatingIncidentButton from "@/components/floating-incident-button";
import { useEffect } from "react";

interface BeginnersLayoutProps {
  children: ReactNode;
}

export default function BeginnersLayout({ children }: BeginnersLayoutProps) {
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
      <BeginnersHeader onToggleTheme={toggleTheme} onToggleLanguage={toggleLanguage} />
      <main className="flex-grow pt-24 w-full relative">
        {children}
        {/* Floating incident report button visible across beginners pages */}
        <FloatingIncidentButton />
      </main>
      <BeginnersFooter />
    </div>
  );
}


