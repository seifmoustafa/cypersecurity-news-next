"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import HeroBackground from "@/components/hero-background";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HeroBackground />
      </div>
      <div className="relative z-10 container mx-auto px-4 max-w-full 2xl:max-w-[1600px]">
        <div className="flex flex-col items-center justify-center min-h-[40vh] md:min-h-[45vh] py-8 md:py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-white drop-shadow-lg">
            {t("hero.title")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-center max-w-3xl text-white/90 drop-shadow-md mb-8">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg"
              onClick={() => scrollToSection("awareness")}
            >
              {t("hero.cta.primary")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20"
              onClick={() => scrollToSection("security-requirements")}
            >
              {t("hero.cta.secondary")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
