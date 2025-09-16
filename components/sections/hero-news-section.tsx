"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import NewsCarousel from "@/components/news-carousel";

export default function HeroNewsSection() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full overflow-hidden mt-36">
      {/* Enhanced Full-Width News Carousel */}
      <div className="w-full h-[70vh] lg:h-[80vh]">
        <div className="h-full rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/30 border border-blue-200/30 dark:border-blue-800/30 relative">
          {/* Enhanced background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.3),transparent_50%)]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.02)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
          </div>
          
          {/* Enhanced News Carousel */}
          <NewsCarousel />
        </div>
      </div>
    </section>
  );
}