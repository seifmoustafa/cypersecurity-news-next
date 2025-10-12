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
  const [selectedTip, setSelectedTip] = useState<(Tip & { type?: string }) | null>(null)
  const [tipDialogOpen, setTipDialogOpen] = useState(false)

  // Fixed speed in pixels per second - increased for faster animation
  const speed = 150

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
      // Create a tip object from the ticker item data with all available information
      const tip: Tip & { type?: string } = {
        id: tickerItem.id,
        title: tickerItem.title,
        titleEn: tickerItem.titleEn || tickerItem.title,
        subtitle: tickerItem.subtitle || "",
        subtitleEn: tickerItem.subtitleEn || "",
        summary: tickerItem.summary || tickerItem.text?.[language] || tickerItem.text?.en || tickerItem.text?.ar || "",
        summaryEn: tickerItem.summaryEn || tickerItem.text?.en || tickerItem.text?.ar || "",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        type: tickerItem.type
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

  const getIcon = (type: string, size: "small" | "large" = "small") => {
    const iconSize = size === "large" ? "h-6 w-6" : "h-4 w-4"
    const iconColor = size === "large" ? "text-white" : ""
    const spacing = size === "large" ? "" : `${isRtl ? "ml-1.5" : "mr-1.5"}`
    
    switch (type) {
      case "warning":
        return <AlertTriangle className={`${spacing} ${iconSize} ${iconColor || "text-yellow-500"}`} />
      case "alert":
        return <AlertTriangle className={`${spacing} ${iconSize} ${iconColor || "text-red-500"}`} />
      case "info":
      default:
        return <Shield className={`${spacing} ${iconSize} ${iconColor || "text-primary"}`} />
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
              {language === "ar" ? item.title : (item.titleEn || item.title)}
            </span>
          ))}
        </div>
      </div>

    {/* Custom Tip Modal - Enhanced to match simple-tips-ticker design */}
    {tipDialogOpen && selectedTip && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full mx-4 border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1 min-w-0">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl flex-shrink-0">
                {getIcon(selectedTip.type || "info", "large")}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {language === "ar" ? "نصيحة أمنية" : "Security Tip of the Day"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === "ar" ? "تعلم شيئاً جديداً" : "Learn something new every day"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDialogClose}
              className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {language === "ar" ? selectedTip.title : selectedTip.titleEn}
            </h4>
            {(selectedTip.subtitle || selectedTip.subtitleEn) && (
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-4 font-medium">
                {language === "ar" ? selectedTip.subtitle : selectedTip.subtitleEn}
              </p>
            )}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {language === "ar" ? selectedTip.summary : selectedTip.summaryEn}
            </p>
            
            {/* Action Buttons */}
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Button
                onClick={handleDialogClose}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                {language === "ar" ? "فهمت" : "Got it"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

