"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import HeroBackground from "@/components/hero-background"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

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
    <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
      {/* Animated background */}
      <HeroBackground />

      {/* Optional overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 z-10"></div>

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">{t("hero.title")}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6 drop-shadow">{t("hero.subtitle")}</p>

          <Button
            size="lg"
            className="bg-primary/90 hover:bg-primary text-white"
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
          <ChevronDown className="h-8 w-8 text-white/80" />
        </motion.div>
      </div>
    </div>
  )
}
