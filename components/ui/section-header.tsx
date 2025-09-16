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
      className={`mb-16 ${alignmentClasses[align]} section-header`}
    >
      <div className="relative">
        {/* Enhanced background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
        
        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 dark:border-blue-800/30 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-400 bg-clip-text text-transparent inline-block drop-shadow-sm">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              {subtitle}
            </p>
          )}
          
          {/* Enhanced divider with animation */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-400 mt-6 rounded-full shadow-lg ${
              align === "center" ? "mx-auto" : align === "right" ? "ml-auto rtl:mr-auto rtl:ml-0" : ""
            }`}
            style={{ maxWidth: "200px" }}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  )
}
