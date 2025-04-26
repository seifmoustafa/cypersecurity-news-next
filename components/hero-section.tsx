"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import HeroBackground from "@/components/hero-background";
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

export default function HeroSection() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[40vh] md:h-[45vh] overflow-hidden">
      {/* Animated background */}
      <HeroBackground />

      {/* Optional overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 dark:from-black/60 dark:via-black/50 dark:to-black/70 z-10"></div>

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Cybersecurity icon group */}
          <div className="flex justify-center mb-5 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-blue-500/20 p-3 rounded-full backdrop-blur-sm"
            >
              <Shield className="h-7 w-7 text-blue-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-cyan-500/20 p-3 rounded-full backdrop-blur-sm"
            >
              <Lock className="h-7 w-7 text-cyan-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-blue-500/20 p-3 rounded-full backdrop-blur-sm"
            >
              <ShieldAlert className="h-7 w-7 text-blue-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="bg-green-500/20 p-3 rounded-full backdrop-blur-sm hidden md:flex"
            >
              <Database className="h-7 w-7 text-green-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="bg-purple-500/20 p-3 rounded-full backdrop-blur-sm hidden md:flex"
            >
              <Server className="h-7 w-7 text-purple-400" />
            </motion.div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-md bg-clip-text">
            {t("hero.title")}
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto drop-shadow leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
