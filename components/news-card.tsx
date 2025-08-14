"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"
import { slugify } from "@/lib/utils"
import type { News } from "@/entities"

interface NewsCardProps extends Partial<News> {
  subtitle?: string
  fullDescription?: string
  details?: string
}

const cardMotionVariants = {
  offscreen: { opacity: 0, y: 30 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 15 },
  },
}

export default function NewsCard({
  id,
  title,
  titleEn,
  subtitle,
  summary,
  summaryEn,
  fullDescription,
  details,
  content,
  contentEn,
  imageUrl,
}: NewsCardProps) {
  const [open, setOpen] = useState(false)
  const { language, isRtl, t } = useLanguage()

  // Get title for display based on current language
  const displayTitle = language === "ar" ? title || titleEn || "" : titleEn || title || ""

  // ONLY GET SUMMARY - NO FALLBACK TO CONTENT OR SUBTITLE!
  const newsSummary = language === "ar" ? summary || summaryEn || "" : summaryEn || summary || ""

  // Get full content for dialog (can use content if summary not available)
  const fullContent = language === "ar" ? fullDescription || summary || "" : fullDescription || summaryEn || ""

  // ALWAYS use English title for URL slug (regardless of current language)
  const englishTitle = titleEn || ""
  const newsSlug = slugify(englishTitle, id)

  // Don't render if no title
  if (!displayTitle) {
    return null
  }

  // Clean HTML tags and validate summary
  const cleanSummary = newsSummary.replace(/<\/?[^>]+(>|$)/g, "").trim()
  const hasValidSummary = cleanSummary && cleanSummary !== "string" && cleanSummary.length > 0

  return (
    <>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardMotionVariants}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="w-full max-w-sm"
      >
        <Card
          className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group border border-blue-100/50 dark:border-blue-900/30"
          onClick={() => setOpen(true)}
        >
          <div className="h-48 relative overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg line-clamp-1">{displayTitle}</h3>
            </div>
          </div>
          <CardContent className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
            {/* ALWAYS show summary area - empty string if no summary */}
            <p className="text-sm text-muted-foreground line-clamp-3">{hasValidSummary ? cleanSummary : ""}</p>
            <div className="mt-4 flex justify-end">
              <span className="text-primary text-sm font-medium inline-flex items-center">
                {t("common.readMore")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${isRtl ? "mr-1 rotate-180" : "ml-1"} transition-transform group-hover:${isRtl ? "-translate-x-1" : "translate-x-1"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog for full details */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 border border-blue-100 dark:border-blue-900/30">
          <DialogHeader>
            <DialogTitle className={`text-xl font-bold ${isRtl ? "text-right" : "text-left"}`}>
              {displayTitle}
            </DialogTitle>
            {hasValidSummary && (
              <DialogDescription className={isRtl ? "text-right" : "text-left"}>{cleanSummary}</DialogDescription>
            )}
          </DialogHeader>

          {imageUrl && (
            <div className="relative w-full h-64 my-4 rounded-lg overflow-hidden">
              <Image src={imageUrl || "/placeholder.svg"} alt={displayTitle} fill className="object-cover" />
            </div>
          )}

          <div className={`whitespace-pre-line ${isRtl ? "text-right" : "text-left"}`}>
            {fullContent && fullContent !== "string" && <p>{fullContent}</p>}
            {details && details !== "string" && (
              <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100/50 dark:border-blue-900/30">
                <h4 className="font-semibold mb-2">{t("common.additionalDetails")}</h4>
                <p>{details}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Link
              href={`/news/${newsSlug}`}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
            >
              {t("common.viewFullArticle")}
            </Link>
            <Button onClick={() => setOpen(false)} variant="outline">
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
