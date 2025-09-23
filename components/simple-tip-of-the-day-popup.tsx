"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LightbulbIcon, X, Shield, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTips } from "@/core/hooks/use-tips"

export default function SimpleTipOfTheDayPopup() {
  const { language, t } = useLanguage()
  const [tipDialogOpen, setTipDialogOpen] = useState(false)
  const { tip, loading, error, fetchRandomTip } = useTips()

  useEffect(() => {
    // Check if tips are disabled in localStorage
    const disabled = localStorage.getItem("tipOfTheDayDisabled") === "true"

    // Only show the tip if not disabled
    if (!disabled) {
      // Fetch random tip from API
      fetchRandomTip()
    }
  }, [fetchRandomTip])

  // Show dialog only after tip is loaded and not null
  useEffect(() => {
    if (!loading && tip && !error) {
      const timer = setTimeout(() => {
        setTipDialogOpen(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [loading, tip, error])

  // Handle dialog close
  const handleDialogClose = () => {
    setTipDialogOpen(false)
  }

  // Don't render if tips are disabled, no tip available, or still loading
  if (!tipDialogOpen || !tip || loading) return null

  const getIcon = (type?: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case "alert":
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      case "info":
      default:
        return <Shield className="h-6 w-6 text-green-500" />
    }
  }

  const tipTitle = language === "ar" ? tip.title : tip.titleEn
  const tipSummary = language === "ar" ? tip.summary : tip.summaryEn

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
              {getIcon()}
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
            {tipTitle}
          </h4>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {tipSummary}
          </p>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Button
              onClick={handleDialogClose}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              {language === "ar" ? "فهمت" : "Got it"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.setItem("tipOfTheDayDisabled", "true")
                handleDialogClose()
              }}
              className="px-4"
            >
              {language === "ar" ? "إيقاف" : "Disable"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
