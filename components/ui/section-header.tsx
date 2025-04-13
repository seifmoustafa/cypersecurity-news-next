"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: "left" | "center" | "right"
}

export default function SectionHeader({ title, subtitle, align = "center" }: SectionHeaderProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"

  const alignmentClasses = {
    left: "text-left rtl:text-right",
    center: "text-center",
    right: "text-right rtl:text-left",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`mb-10 ${alignmentClasses[align]}`}
    >
      <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
      <div
        className={`h-1 w-20 bg-primary mt-4 rounded ${align === "center" ? "mx-auto" : align === "right" ? "ml-auto rtl:mr-auto rtl:ml-0" : ""}`}
      ></div>
    </motion.div>
  )
}
