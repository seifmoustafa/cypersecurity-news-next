"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { Shield, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { TickerItem } from "@/core/domain/models/ticker-item"
import { Button } from "@/components/ui/button"
import { LightbulbIcon, X } from "lucide-react"
import type { Tip } from "@/entities"

export default function TipsTicker() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const { theme } = useTheme()
  const { language, t } = useLanguage()
  const isDark = theme === "dark"
  const isRtl = language === "ar"

  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [containerWidth, setContainerWidth] = useState(0)
  const [textWidth, setTextWidth] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null)
  const [tipDialogOpen, setTipDialogOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const animationRef = useRef<{
    startTime: number
    pausedAt: number
    currentPosition: number
    animationId: number | null
  }>({
    startTime: 0,
    pausedAt: 0,
    currentPosition: 0,
    animationId: null
  })

  // Fixed speed in pixels per second
  const speed = 100

  useEffect(() => {
    const fetchTickerItems = async () => {
      try {
        setLoading(true)
        // Check if container and services are available
        if (!container?.services?.ticker) {
          console.warn("Ticker service not available")
          setTickerItems([])
          return
        }

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

  // Manual animation function
  const startAnimation = () => {
    if (containerWidth > 0 && textWidth > 0) {
      const totalDistance = containerWidth + textWidth
      
      // Calculate start and target positions
      let startPosition: number
      let targetPosition: number
      
      if (isRtl) {
        // Arabic: Left to right animation
        startPosition = -textWidth
        targetPosition = containerWidth
      } else {
        // English: Right to left animation
        startPosition = containerWidth
        targetPosition = -textWidth
      }

      // Get current position from DOM
      const currentPos = animationRef.current.currentPosition
      
      // Start animation from current position
      controls.start({
        x: targetPosition,
        transition: {
          duration: (Math.abs(targetPosition - currentPos)) / speed,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          repeatDelay: 0,
        },
      })
      
      animationRef.current.startTime = Date.now()
    }
  }

  // Initialize animation once when dimensions are available
  useEffect(() => {
    if (containerWidth > 0 && textWidth > 0 && !isInitialized) {
      const totalDistance = containerWidth + textWidth
      
      // Calculate start position
      let startPosition: number
      
      if (isRtl) {
        startPosition = -textWidth
      } else {
        startPosition = containerWidth
      }

      // Set initial position
      controls.set({ x: startPosition })
      animationRef.current.currentPosition = startPosition
      animationRef.current.startTime = Date.now()
      setIsInitialized(true)
      
      // Start animation
      startAnimation()
    }
  }, [containerWidth, textWidth, controls, speed, isRtl, isInitialized])

  // Handle pause/resume
  useEffect(() => {
    if (isInitialized && containerWidth > 0 && textWidth > 0) {
      if (isPaused) {
        // Paused - stop animation and get current position
        controls.stop()
        
        // Get current position from DOM
        if (textRef.current) {
          const transform = textRef.current.style.transform
          const match = transform.match(/translateX\(([^)]+)\)/)
          if (match) {
            animationRef.current.currentPosition = parseFloat(match[1])
          }
        }
        
        if (animationRef.current.startTime > 0) {
          const now = Date.now()
          const elapsedTime = now - animationRef.current.startTime
          animationRef.current.pausedAt = elapsedTime
        }
      } else if (animationRef.current.pausedAt > 0) {
        // Resuming from pause - continue from current position
        startAnimation()
        animationRef.current.pausedAt = 0
      }
    }
  }, [isPaused, isInitialized, containerWidth, textWidth, controls, speed, isRtl])

  if (loading || tickerItems.length === 0) {
    return null
  }

  // Handle tip click
  const handleTipClick = (tipId: string) => {
    // Find the tip in the ticker items
    const tickerItem = tickerItems.find(item => item.id === tipId)
    if (tickerItem) {
      // Create a tip object from the ticker item data
      const tip: Tip = {
        id: tickerItem.id,
        title: tickerItem.title,
        titleEn: tickerItem.titleEn || "",
        subtitle: "", // We don't have subtitle in ticker items
        subtitleEn: "",
        summary: tickerItem.text?.[language] || tickerItem.text?.en || tickerItem.text?.ar || "",
        summaryEn: tickerItem.text?.en || tickerItem.text?.ar || "",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: null
      }
      setSelectedTip(tip)
      setTipDialogOpen(true)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setTipDialogOpen(false)
    setSelectedTip(null)
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
    <>
      <div
        ref={containerRef}
        className="fixed top-16 w-full h-12 overflow-hidden flex items-center px-4 z-40 bg-gradient-to-r from-blue-100/90 to-cyan-100/90 dark:from-blue-950/90 dark:to-cyan-950/90 backdrop-blur-sm border-b border-blue-200/30 dark:border-blue-800/30"
        style={{ direction: "ltr" }} // Always LTR for animation control
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
      <motion.div ref={textRef} animate={controls} className="inline-flex whitespace-nowrap">
        {tickerItems.map((item, idx) => (
          <span
            key={idx}
            className="mx-5 inline-flex items-center text-sm text-gray-900 dark:text-white cursor-pointer hover:text-primary transition-colors"
            style={{ direction: isRtl ? "rtl" : "ltr" }} // RTL/LTR for text display
            onClick={() => handleTipClick(item.id)}
          >
            {getIcon(item.type || "info")}
            {item.text?.[language] || ""}
          </span>
        ))}
      </motion.div>
    </div>

    {/* Custom Tip Modal */}
    {tipDialogOpen && selectedTip && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleDialogClose}
        />
        
        {/* Modal Content */}
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden border border-primary/20">
          {/* Header section with colored background */}
          <div className="bg-primary/10 dark:bg-primary/20 p-6 flex items-center gap-4 border-b border-primary/20">
            <div className="bg-primary/20 dark:bg-primary/30 p-3 rounded-full">
              <LightbulbIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary">{t("common.tipOfTheDay")}</h2>
              <p className="text-lg font-medium">{language === "ar" ? selectedTip.title : selectedTip.titleEn}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDialogClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content section */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Subtitle */}
              {(language === "ar" ? selectedTip.subtitle : selectedTip.subtitleEn) && (
                <p className="text-lg font-semibold text-primary">{language === "ar" ? selectedTip.subtitle : selectedTip.subtitleEn}</p>
              )}

              {/* Summary/Content */}
              <p className="text-base leading-relaxed">{language === "ar" ? selectedTip.summary : selectedTip.summaryEn}</p>
            </div>

            {/* Custom close button */}
            <div className="mt-6 flex justify-center gap-3">
              <Button className="px-8 py-2 bg-primary hover:bg-primary/90 text-white" onClick={handleDialogClose}>
                {t("common.understood")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
