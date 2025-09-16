"use client"

import { useEffect, useRef, useState } from "react"
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

  // Fixed speed in pixels per second - increased for faster animation
  const speed = 300

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
        className="fixed top-20 w-full h-14 overflow-hidden flex items-center px-6 z-40 bg-gradient-to-r from-blue-600/95 via-cyan-600/90 to-blue-700/95 dark:from-blue-800/95 dark:via-cyan-800/90 dark:to-blue-900/95 backdrop-blur-xl border-b border-blue-400/40 dark:border-blue-300/40 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30"
        style={{ direction: "ltr" }} // Always LTR for animation control
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Enhanced animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-pulse"></div>
        </div>
        
        <div 
          ref={textRef} 
          className="inline-flex whitespace-nowrap relative z-10 animate-ticker-scroll"
          style={{
            animationDuration: `${(containerWidth + textWidth) / speed}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDirection: isRtl ? 'reverse' : 'normal',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {tickerItems.map((item, idx) => (
            <span
              key={idx}
              className="mx-8 inline-flex items-center text-base font-semibold text-white cursor-pointer hover:text-yellow-300 transition-all duration-300 hover:scale-105 drop-shadow-sm"
              style={{ direction: isRtl ? "rtl" : "ltr" }} // RTL/LTR for text display
              onClick={() => handleTipClick(item.id)}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm opacity-50"></div>
                <div className="relative">
                  {getIcon(item.type || "info")}
                </div>
              </div>
              {item.text?.[language] || ""}
            </span>
          ))}
        </div>
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

