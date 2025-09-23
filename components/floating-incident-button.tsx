"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { AlertTriangle, Send } from "lucide-react"
import Link from "next/link"

export default function FloatingIncidentButton() {
  const { language, t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  // Show button after a small delay to make the appearance smoother
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const isRtl = language === "ar"
  const buttonText = t("beginners.floatingButton.reportIncident")
  const buttonSubtext = t("beginners.floatingButton.cybersecurity")

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
          {/* Modern Pill-Shaped Button with Incident Theme */}
          <Link
            href="/simple/incident-report"
            className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-700 dark:to-red-800 dark:hover:from-red-800 dark:hover:to-red-900 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md shadow-red-500/30 dark:shadow-red-500/40 flex items-center gap-3 whitespace-nowrap"
          >
            {/* Enhanced Pulsing Indicator with Alert Theme */}
            <div className="relative flex items-center justify-center">
              {/* Multiple pulsing rings */}
              <div className="absolute w-5 h-5 bg-white/40 rounded-full animate-ping"></div>
              <div className="absolute w-4 h-4 bg-white/60 rounded-full animate-pulse"></div>
              {/* Alert Triangle Icon */}
              <div className="relative w-4 h-4 flex items-center justify-center">
                <AlertTriangle className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Button Text */}
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold tracking-wide leading-tight">
                {buttonText}
              </span>
              <span className="text-xs opacity-90 leading-tight">
                {buttonSubtext}
              </span>
            </div>

            {/* Send Icon */}
            <div className="flex items-center justify-center">
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
