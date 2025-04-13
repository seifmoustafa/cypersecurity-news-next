"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import HeroBackground from "./hero-background"
import { motion } from "framer-motion"

export default function HeroSection() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
      {/* Animated background */}
      <HeroBackground />

      {/* Optional overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30 z-10"></div>

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">أخبار الأمن السيبراني</h1>
          <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto">
            أحدث المستجدات والتحليلات حول التهديدات السيبرانية وتقنيات الحماية
          </p>
        </motion.div>
      </div>
    </div>
  )
}
