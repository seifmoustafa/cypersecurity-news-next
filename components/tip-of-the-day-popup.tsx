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
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-primary/20" hideCloseButton>
        <DialogTitle className="sr-only">{t("common.tipOfTheDay")}</DialogTitle>
        {/* Header section with colored background */}
        <div className="bg-primary/10 dark:bg-primary/20 p-6 flex items-center gap-4 border-b border-primary/20">
          <div className="bg-primary/20 dark:bg-primary/30 p-3 rounded-full">
            <LightbulbIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-primary">{t("common.tipOfTheDay")}</h2>
            <p className="text-lg font-medium">{language === "ar" ? tip.title : tip.titleEn}</p>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Subtitle */}
            {(language === "ar" ? tip.subtitle : tip.subtitleEn) && (
              <p className="text-lg font-semibold text-primary">{language === "ar" ? tip.subtitle : tip.subtitleEn}</p>
            )}

            {/* Summary/Content */}
            <p className="text-base leading-relaxed">{language === "ar" ? tip.summary : tip.summaryEn}</p>
          </div>

          {/* Custom close button */}
          <div className="mt-6 flex justify-center gap-3">
            <Button className="px-8 py-2 bg-primary hover:bg-primary/90 text-white" onClick={() => setOpen(false)}>
              {t("common.understood")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
