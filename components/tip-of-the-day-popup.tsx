"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LightbulbIcon, AlertCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTips } from "@/core/hooks/use-tips"

export default function TipOfTheDayPopup() {
  const [open, setOpen] = useState(false)
  const { language } = useLanguage()
  const { tip, loading, error, fetchRandomTip } = useTips()

  useEffect(() => {
    // Check if tips are disabled in localStorage
    const disabled = localStorage.getItem("tipOfTheDayDisabled") === "true"

    // Only show the tip if not disabled
    if (!disabled) {
      // Fetch random tip from API
      fetchRandomTip()

      // Show the tip after a short delay
      const timer = setTimeout(() => {
        setOpen(true)
      }, 1000)

      // Cleanup function
      return () => clearTimeout(timer)
    }
  }, [fetchRandomTip])

  // Don't render if tips are disabled or no tip loaded yet
  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-primary/20" hideCloseButton>
        {/* Header section with colored background */}
        <div className="bg-primary/10 dark:bg-primary/20 p-6 flex items-center gap-4 border-b border-primary/20">
          <div className="bg-primary/20 dark:bg-primary/30 p-3 rounded-full">
            <LightbulbIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-primary">{language === "ar" ? "نصيحة اليوم" : "Tip of the Day"}</h2>
            {loading ? (
              <Skeleton className="h-6 w-48 mt-1" />
            ) : error ? (
              <p className="text-lg font-medium text-red-600">
                {language === "ar" ? "خطأ في تحميل النصيحة" : "Error loading tip"}
              </p>
            ) : tip ? (
              <p className="text-lg font-medium">{language === "ar" ? tip.title : tip.titleEn}</p>
            ) : null}
          </div>
        </div>

        {/* Content section */}
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 text-red-600 mb-6">
              <AlertCircle className="h-5 w-5" />
              <p>
                {language === "ar"
                  ? "حدث خطأ أثناء تحميل النصيحة. يرجى المحاولة مرة أخرى لاحقاً."
                  : "An error occurred while loading the tip. Please try again later."}
              </p>
            </div>
          ) : tip ? (
            <div className="space-y-4">
              {/* Subtitle */}
              {(language === "ar" ? tip.subtitle : tip.subtitleEn) && (
                <p className="text-lg font-semibold text-primary">
                  {language === "ar" ? tip.subtitle : tip.subtitleEn}
                </p>
              )}

              {/* Summary/Content */}
              <p className="text-base leading-relaxed">{language === "ar" ? tip.summary : tip.summaryEn}</p>
            </div>
          ) : null}

          {/* Custom close button */}
          <div className="mt-6 flex justify-center gap-3">
            {error && (
              <Button variant="outline" onClick={fetchRandomTip} disabled={loading}>
                {language === "ar" ? "إعادة المحاولة" : "Retry"}
              </Button>
            )}
            <Button className="px-8 py-2 bg-primary hover:bg-primary/90 text-white" onClick={() => setOpen(false)}>
              {language === "ar" ? "فهمت" : "I Understand"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
