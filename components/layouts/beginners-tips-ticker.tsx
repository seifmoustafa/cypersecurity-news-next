"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Shield, AlertTriangle } from "lucide-react"
import { container } from "@/core/di/container"
import type { TickerItem } from "@/core/domain/models/ticker-item"

export default function BeginnersTipsTicker() {
  const { language } = useLanguage()
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [loading, setLoading] = useState(true)

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

  if (loading || tickerItems.length === 0) {
    return null
  }

  const currentTip = tickerItems[currentTipIndex]
  const tipText = currentTip.text?.[language] || currentTip.text?.en || currentTip.text?.ar || ""

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-white" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-white" />
      case "info":
      default:
        return <Shield className="h-4 w-4 text-white" />
    }
  }

  return (
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
            <p className="text-sm text-gray-700 dark:text-slate-300 font-medium">
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
  )
}
