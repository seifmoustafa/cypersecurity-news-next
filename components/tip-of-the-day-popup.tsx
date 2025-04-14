"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { tips } from "@/data/tips"
import { useLanguage } from "@/components/language-provider"
import { usePathname } from "next/navigation"

export default function TipOfTheDayPopup() {
  const [open, setOpen] = useState(false)
  const [tip, setTip] = useState("")
  const { theme } = useTheme()
  const { language, t } = useLanguage()
  const pathname = usePathname() // Get the current pathname
  const isDark = theme === "dark"

  // Show popup after a delay when component mounts, but only on the home page
  useEffect(() => {
    // Only show the tip on the home page
    if (pathname !== "/") return

    // Always show the tip after a short delay
    const timer = setTimeout(() => {
      if (tips[language] && tips[language].length > 0) {
        const index = Math.floor(Math.random() * tips[language].length)
        setTip(tips[language][index])
        setOpen(true)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [language, pathname])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="tipOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center"
          onClick={handleClose}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Popup card */}
          <motion.div
            key="tipContent"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white dark:bg-gray-800 w-11/12 sm:w-3/4 md:w-1/2 lg:w-2/5 max-w-lg rounded-xl p-6 shadow-2xl text-center max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lamp icon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-500/20">
                <Lightbulb size={36} className="text-amber-500 dark:text-amber-400" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t("common.tipOfTheDay")}</h3>

            {/* Tip text */}
            <p className="mb-6 text-base whitespace-pre-line text-gray-800 dark:text-gray-200">{tip}</p>

            {/* Button */}
            <Button onClick={handleClose} className="font-bold px-8 bg-amber-500 hover:bg-amber-400 text-white">
              {t("common.understood")}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
