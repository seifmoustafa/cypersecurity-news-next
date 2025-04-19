"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useLanguage } from "@/components/language-provider"
import { LightbulbIcon } from "lucide-react"
import { container } from "@/core/di/container"
import type { Tip } from "@/core/domain/models/tip"

export default function TipOfTheDayPopup() {
  const [open, setOpen] = useState(false)
  const [tip, setTip] = useState<Tip | null>(null)
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    // Check if the popup has been shown today
    const lastShown = localStorage.getItem("tipOfTheDayLastShown")
    const today = new Date().toDateString()

    const fetchTip = async () => {
      try {
        setLoading(true)
        const randomTip = await container.services.tips.getRandomTip()
        setTip(randomTip)

        // Show popup if not shown today
        if (lastShown !== today) {
          setTimeout(() => {
            setOpen(true)
            localStorage.setItem("tipOfTheDayLastShown", today)
          }, 3000)
        }
      } catch (error) {
        console.error("Error fetching tip:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTip()
  }, [])

  if (loading || !tip) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <LightbulbIcon className="h-5 w-5 text-yellow-500" />
            <span>{tip.title[language]}</span>
          </DialogTitle>
          <DialogDescription>{tip.content[language]}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
