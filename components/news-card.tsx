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

interface NewsCardProps {
  title: string
  subtitle: string
  fullDescription?: string
  details?: string
  imageUrl: string
}

const cardMotionVariants = {
  offscreen: { opacity: 0, y: 30 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 15 },
  },
}

export default function NewsCard({ title, subtitle, fullDescription, details, imageUrl }: NewsCardProps) {
  const [open, setOpen] = useState(false)
  const { language, isRtl } = useLanguage()

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
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg line-clamp-1">{title}</h3>
            </div>
          </div>
          <CardContent className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
            <p className="text-sm text-muted-foreground line-clamp-3">{subtitle}</p>
            <div className="mt-4 flex justify-end">
              <span className="text-primary text-sm font-medium inline-flex items-center">
                {language === "ar" ? "اقرأ المزيد" : "Read More"}
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
            <DialogTitle className={`text-xl font-bold ${isRtl ? "text-right" : "text-left"}`}>{title}</DialogTitle>
            <DialogDescription className={isRtl ? "text-right" : "text-left"}>{subtitle}</DialogDescription>
          </DialogHeader>

          <div className="relative w-full h-64 my-4 rounded-lg overflow-hidden">
            <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>

          <div className={`whitespace-pre-line ${isRtl ? "text-right" : "text-left"}`}>
            <p>{fullDescription || subtitle}</p>
            {details && (
              <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100/50 dark:border-blue-900/30">
                <h4 className="font-semibold mb-2">{language === "ar" ? "تفاصيل إضافية:" : "Additional Details:"}</h4>
                <p>{details}</p>
              </div>
            )}
          </div>

          <DialogFooter className={isRtl ? "justify-start" : "justify-end"}>
            <Button
              onClick={() => setOpen(false)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0"
            >
              {language === "ar" ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
