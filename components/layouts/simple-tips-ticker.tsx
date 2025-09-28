"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Shield, AlertTriangle, LightbulbIcon, X } from "lucide-react"
import { container } from "@/core/di/container"
import type { TickerItem } from "@/core/domain/models/ticker-item"
import { Button } from "@/components/ui/button"
import type { Tip } from "@/entities"

export default function SimpleTipsTicker() {
  const { language, t } = useLanguage()
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedTip, setSelectedTip] = useState<(Tip & { type?: string }) | null>(null)
  const [tipDialogOpen, setTipDialogOpen] = useState(false)

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

  useEffect(() => {
    if (tickerItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tickerItems.length)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [tickerItems])

  // Handle tip click
  const handleTipClick = (tipId: string) => {
    // Find the tip in the ticker items
    const tickerItem = tickerItems.find(item => item.id === tipId)
    if (tickerItem) {
      // Create a tip object from the ticker item data
      const tip: Tip & { type?: string } = {
        id: tickerItem.id,
        title: tickerItem.title,
        titleEn: tickerItem.titleEn || "",
        subtitle: "", // We don't have subtitle in ticker items
        subtitleEn: "",
        summary: tickerItem.text?.[language] || tickerItem.text?.en || tickerItem.text?.ar || "",
        summaryEn: tickerItem.text?.en || tickerItem.text?.ar || "",
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

  if (loading || tickerItems.length === 0) {
    return null
  }

  const currentTip = tickerItems[currentTipIndex]
  const tipText = currentTip.text?.[language] || currentTip.text?.en || currentTip.text?.ar || ""

  const getIcon = (type: string, size: "small" | "large" = "small") => {
    const iconSize = size === "large" ? "h-6 w-6" : "h-4 w-4"
    const iconColor = size === "large" ? "text-white" : "text-white"
    
    switch (type) {
      case "warning":
        return <AlertTriangle className={`${iconSize} ${iconColor}`} />
      case "alert":
        return <AlertTriangle className={`${iconSize} ${iconColor}`} />
      case "info":
      default:
        return <Shield className={`${iconSize} ${iconColor}`} />
    }
  }

  return (
    <>
      <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 border-b border-gray-200 dark:border-slate-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg shadow-sm">
                <div className="text-white">
                  {getIcon(currentTip.type || "info")}
                </div>
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {language === "ar" ? "نصيحة أمنية" : "Security Tip"}
              </span>
            </div>
            <div className="flex-1 text-center">
              <p 
                className="text-sm text-gray-700 dark:text-slate-300 font-medium cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                onClick={() => handleTipClick(currentTip.id)}
              >
                {tipText}
              </p>
            </div>
            <div className="flex space-x-1 rtl:space-x-reverse">
              {tickerItems.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTipIndex ? "bg-green-500 dark:bg-green-400" : "bg-gray-400 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Tip Modal - Matching SimpleTipOfTheDayPopup design */}
      {tipDialogOpen && selectedTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
                  {getIcon(selectedTip.type || "info", "large")}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {language === "ar" ? "نصيحة الأمان اليوم" : "Security Tip of the Day"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === "ar" ? "تعلم شيئاً جديداً كل يوم" : "Learn something new every day"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDialogClose}
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "ar" ? selectedTip.title : selectedTip.titleEn}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {language === "ar" ? selectedTip.summary : selectedTip.summaryEn}
              </p>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Button
                  onClick={handleDialogClose}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
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
