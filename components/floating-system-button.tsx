"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePinnedSystem } from "@/core/hooks/use-pinned-system"
import { useLanguage } from "@/components/language-provider"

export default function FloatingSystemButton() {
  const { pinnedSystem, loading } = usePinnedSystem()
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  // Show button only if there's a pinned system
  useEffect(() => {
    if (pinnedSystem) {
      // Add a small delay to make the appearance smoother
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [pinnedSystem])

  // Don't render if loading or no pinned system
  if (loading || !pinnedSystem) {
    return null
  }

  const handleOpenSystem = () => {
    // Open in new tab
    window.open(pinnedSystem.navigationUrl, '_blank', 'noopener,noreferrer')
  }

  const displayName = language === "ar" ? pinnedSystem.name : pinnedSystem.name

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.7 
          }}
          className="fixed bottom-8 right-8 z-50"
        >
          {/* Modern Pill-Shaped Button */}
          <button
            onClick={handleOpenSystem}
            className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md shadow-blue-500/30 dark:shadow-blue-500/40 flex items-center gap-3 whitespace-nowrap"
          >
            {/* Enhanced Pulsing Indicator */}
            <div className="relative flex items-center justify-center">
              {/* Multiple pulsing rings */}
              <div className="absolute w-5 h-5 bg-white/40 rounded-full animate-ping"></div>
              <div className="absolute w-4 h-4 bg-white/60 rounded-full animate-pulse"></div>
              {/* Solid center dot */}
              <div className="relative w-2 h-2 bg-white rounded-full shadow-sm"></div>
            </div>
            
            {/* System Name */}
            <span className="text-sm font-bold tracking-wide">
              {displayName}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
