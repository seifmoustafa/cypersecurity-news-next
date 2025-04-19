"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import HeroBackground from "@/components/hero-background"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ChevronDown, Shield } from "lucide-react"

export default function HeroSection() {
  const { theme } = useTheme()
  const { language, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Animated background */}
      <HeroBackground />

      {/* Optional overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 dark:from-black/70 dark:via-black/60 dark:to-black/80 z-10"></div>

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-primary" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md bg-clip-text">
            {t("hero.title")}
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 drop-shadow leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
            onClick={() => {
              const systemsSection = document.querySelector("#systems")
              if (systemsSection) {
                systemsSection.scrollIntoView({ behavior: "smooth" })
              }
            }}
          >
            {t("common.exploreMore")}
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <ChevronDown className="h-10 w-10 text-white/80" />
        </motion.div>
      </div>
    </div>
  )
}
