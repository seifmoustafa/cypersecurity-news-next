"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
          className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="h-48 relative">
            <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-right">{title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground text-right">{subtitle}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog for full details */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-right">{title}</DialogTitle>
            <DialogDescription className="text-right">{subtitle}</DialogDescription>
          </DialogHeader>

          <div className="relative w-full h-64 my-4">
            <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover rounded-md" />
          </div>

          <div className="text-right whitespace-pre-line">
            <p>{fullDescription || subtitle}</p>
            {details && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">تفاصيل إضافية:</h4>
                <p>{details}</p>
              </div>
            )}
          </div>

          <DialogFooter className="justify-start">
            <Button onClick={() => setOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
