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
      className={`mb-12 ${alignmentClasses[align]} section-header`}
    >
      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent inline-block">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
      <div
        className={`h-1 w-24 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 mt-4 rounded divider ${
          align === "center" ? "mx-auto" : align === "right" ? "ml-auto rtl:mr-auto rtl:ml-0" : ""
        }`}
      ></div>
    </motion.div>
  )
}
