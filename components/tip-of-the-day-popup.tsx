"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LightbulbIcon } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTips } from "@/core/hooks/use-tips"

export default function TipOfTheDayPopup() {
  const [open, setOpen] = useState(false)
  const { language, t } = useLanguage()
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
        setOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [loading, tip, error])

  // Don't render if tips are disabled, no tip available, or still loading
  if (!open || !tip) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border-blue-200/50 dark:border-blue-800/50 shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/30" hideCloseButton>
        <DialogTitle className="sr-only">{t("common.tipOfTheDay")}</DialogTitle>
        
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.3),transparent_50%)]"></div>
        </div>
        
        {/* Enhanced Header section */}
        <div className="relative bg-gradient-to-r from-blue-600/95 via-cyan-600/90 to-blue-700/95 dark:from-blue-800/95 dark:via-cyan-800/90 dark:to-blue-900/95 p-8 flex items-center gap-6 border-b border-blue-400/40 dark:border-blue-300/40">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-full shadow-xl shadow-yellow-500/30">
              <LightbulbIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              <span className="bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                {t("common.tipOfTheDay")}
              </span>
            </h2>
            <p className="text-xl font-semibold text-blue-100 drop-shadow-md">
              {language === "ar" ? tip.title : tip.titleEn}
            </p>
          </div>
        </div>

        {/* Enhanced Content section */}
        <div className="relative p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Subtitle */}
            {(language === "ar" ? tip.subtitle : tip.subtitleEn) && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {language === "ar" ? tip.subtitle : tip.subtitleEn}
                </p>
              </div>
            )}

            {/* Summary/Content */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-700/50 dark:to-blue-900/20 p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                {language === "ar" ? tip.summary : tip.summaryEn}
              </p>
            </div>
          </div>

          {/* Enhanced close button */}
          <div className="mt-8 flex justify-center">
            <Button 
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/40 border border-blue-500/30 dark:border-blue-400/30" 
              onClick={() => setOpen(false)}
            >
              {t("common.understood")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
