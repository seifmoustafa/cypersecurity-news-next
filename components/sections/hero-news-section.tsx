"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import HeroBackground from "@/components/hero-background";
import CybersecurityHeroBackground from "@/components/cybersecurity-hero-background";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import {
  Shield,
  Lock,
  ShieldAlert,
  Database,
  Server,
  Cloud,
} from "lucide-react";
import NewsCarousel from "@/components/news-carousel";

export default function HeroNewsSection() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full overflow-hidden mt-16">
      {/* Container for Hero and News Carousel */}
      <div className="grid grid-cols-12 w-full h-[60vh] lg:h-[70vh]">
        {/* Hero Section - 5 columns */}
        <div className="col-span-12 lg:col-span-5 relative h-full overflow-hidden">
          {/* Animated background */}
          <HeroBackground />

          {/* Optional overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 dark:from-black/60 dark:via-black/50 dark:to-black/70 z-10"></div>

          {/* Hero content - Text and icons */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              {/* Main title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight"
              >
                {language === "ar" ? "بوابة الأمن السيبراني" : "Cybersecurity Portal"}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg lg:text-xl text-gray-200 mb-6 leading-relaxed"
              >
                {language === "ar" 
                  ? "حماية البيانات والبنية التحتية الرقمية من التهديدات السيبرانية"
                  : "Protecting data and digital infrastructure from cyber threats"
                }
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-sm lg:text-base text-gray-300 mb-8 leading-relaxed max-w-md mx-auto"
              >
                {language === "ar"
                  ? "منصة شاملة للأمن السيبراني تقدم أحدث المعلومات والإرشادات وأفضل الممارسات لحماية الأنظمة والشبكات"
                  : "A comprehensive cybersecurity platform providing latest information, guidance, and best practices for protecting systems and networks"
                }
              </motion.p>

              {/* Cybersecurity icon group */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex justify-center items-center gap-4 lg:gap-6 w-full px-2 lg:px-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="bg-blue-500/20 p-2 lg:p-3 rounded-full backdrop-blur-sm border border-blue-400/30 flex-shrink-0"
                >
                  <Shield className="h-6 w-6 lg:h-7 lg:w-7 text-blue-400" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                  className="bg-cyan-500/20 p-2 lg:p-3 rounded-full backdrop-blur-sm border border-cyan-400/30 flex-shrink-0"
                >
                  <Lock className="h-6 w-6 lg:h-7 lg:w-7 text-cyan-400" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  className="bg-blue-500/20 p-2 lg:p-3 rounded-full backdrop-blur-sm border border-blue-400/30 flex-shrink-0"
                >
                  <ShieldAlert className="h-6 w-6 lg:h-7 lg:w-7 text-blue-400" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="bg-green-500/20 p-2 lg:p-3 rounded-full backdrop-blur-sm border border-green-400/30 flex-shrink-0 hidden md:flex"
                >
                  <Database className="h-6 w-6 lg:h-7 lg:w-7 text-green-400" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3, duration: 0.4 }}
                  className="bg-purple-500/20 p-2 lg:p-3 rounded-full backdrop-blur-sm border border-purple-400/30 flex-shrink-0 hidden md:flex"
                >
                  <Server className="h-6 w-6 lg:h-7 lg:w-7 text-purple-400" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* News Carousel - 7 columns */}
        <div className="col-span-12 lg:col-span-7 h-full">
          <NewsCarousel />
        </div>
      </div>
    </section>
  );
}
