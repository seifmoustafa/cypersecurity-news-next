"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { Shield } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"

interface NewsTickerProps {
  items: {
    ar: string[]
    en: string[]
  }
}

export default function NewsTicker({ items = { ar: [], en: [] } }: NewsTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const isDark = theme === "dark"
  const isRtl = language === "ar"

  // Get the appropriate items based on current language
  const currentItems = items[language] || []

  const [containerWidth, setContainerWidth] = useState(0)
  const [textWidth, setTextWidth] = useState(0)

  // Fixed speed in pixels per second
  const speed = 100

  // Measure container and text widths when mounted or items change
  useEffect(() => {
    if (containerRef.current && textRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
      setTextWidth(textRef.current.scrollWidth)
    }
  }, [currentItems, language])

  // Start the marquee animation
  useEffect(() => {
    if (containerWidth > 0 && textWidth > 0) {
      // For Arabic: Left to right animation
      if (isRtl) {
        // Reset to start position (off-screen left)
        controls.set({ x: -textWidth })

        // Animate to the right
        controls.start({
          x: containerWidth,
          transition: {
            duration: (containerWidth + textWidth) / speed,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            repeatDelay: 0,
          },
        })
      }
      // For English: Right to left animation (reversed)
      else {
        // Reset to start position (off-screen right)
        controls.set({ x: containerWidth })

        // Animate to the left
        controls.start({
          x: -textWidth,
          transition: {
            duration: (containerWidth + textWidth) / speed,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            repeatDelay: 0,
          },
        })
      }
    }
  }, [containerWidth, textWidth, controls, speed, isRtl])

  return (
    <div
      ref={containerRef}
      className="fixed top-16 w-full h-12 overflow-hidden flex items-center px-4 z-40 bg-blue-100/90 dark:bg-gray-900/90 backdrop-blur-sm"
      style={{ direction: "ltr" }} // Always LTR for animation control
    >
      <motion.div ref={textRef} animate={controls} className="inline-flex whitespace-nowrap">
        {currentItems.map((item, idx) => (
          <span
            key={idx}
            className="mx-5 inline-flex items-center text-sm text-gray-900 dark:text-white"
            style={{ direction: isRtl ? "rtl" : "ltr" }} // RTL/LTR for text display
          >
            <Shield className={`${isRtl ? "ml-1.5" : "mr-1.5"} h-4 w-4 text-primary`} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
