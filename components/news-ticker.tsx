"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { Shield, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { TickerItem } from "@/core/domain/models/ticker-item"

export default function NewsTicker() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const isDark = theme === "dark"
  const isRtl = language === "ar"

  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [containerWidth, setContainerWidth] = useState(0)
  const [textWidth, setTextWidth] = useState(0)

  // Fixed speed in pixels per second
  const speed = 100

  useEffect(() => {
    const fetchTickerItems = async () => {
      try {
        setLoading(true)
        const items = await container.services.ticker.getTickerItems()
        setTickerItems(Array.isArray(items) ? items : [])
      } catch (error) {
        console.error("Error fetching ticker items:", error)
        setTickerItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchTickerItems()
  }, [])

  // Measure container and text widths when mounted or items change
  useEffect(() => {
    if (containerRef.current && textRef.current && tickerItems.length > 0) {
      setContainerWidth(containerRef.current.offsetWidth)
      setTextWidth(textRef.current.scrollWidth)
    }
  }, [tickerItems, language])

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

  if (loading || tickerItems.length === 0) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className={`${isRtl ? "ml-1.5" : "mr-1.5"} h-4 w-4 text-yellow-500`} />
      case "alert":
        return <AlertTriangle className={`${isRtl ? "ml-1.5" : "mr-1.5"} h-4 w-4 text-red-500`} />
      case "info":
      default:
        return <Shield className={`${isRtl ? "ml-1.5" : "mr-1.5"} h-4 w-4 text-primary`} />
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed top-16 w-full h-12 overflow-hidden flex items-center px-4 z-40 bg-gradient-to-r from-blue-100/90 to-cyan-100/90 dark:from-blue-950/90 dark:to-cyan-950/90 backdrop-blur-sm border-b border-blue-200/30 dark:border-blue-800/30"
      style={{ direction: "ltr" }} // Always LTR for animation control
    >
      <motion.div ref={textRef} animate={controls} className="inline-flex whitespace-nowrap">
        {tickerItems.map((item, idx) => (
          <span
            key={idx}
            className="mx-5 inline-flex items-center text-sm text-gray-900 dark:text-white"
            style={{ direction: isRtl ? "rtl" : "ltr" }} // RTL/LTR for text display
          >
            {getIcon(item.type)}
            {item.text[language]}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
