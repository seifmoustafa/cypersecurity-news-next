"use client";

import type { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";
import FloatingSystemButton from "@/components/floating-system-button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/language-provider";
import { useEffect } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, isRtl } = useLanguage();

  // Load saved preferences on mount
  useEffect(() => {
    // Theme is handled by next-themes
    // Language is handled by language-provider
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onToggleTheme={toggleTheme} onToggleLanguage={toggleLanguage} />
      <main className="flex-grow pt-36 w-full">{children}</main>
      <Footer />
      <FloatingSystemButton />
    </div>
  );
}
