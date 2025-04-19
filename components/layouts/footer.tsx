"use client"

import { useLanguage } from "@/components/language-provider"
import { Shield } from "lucide-react"

export default function Footer() {
  const { language } = useLanguage()
  const isRtl = language === "ar"

  return (
    <footer className="py-8 border-t border-blue-200/20 dark:border-blue-800/20 bg-gradient-to-b from-transparent to-blue-50/30 dark:to-blue-950/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-primary mr-2 rtl:ml-2 rtl:mr-0" />
            <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {language === "ar" ? "بوابة الأمن السيبراني" : "Cybersecurity Portal"}
            </span>
          </div>

          <div className="text-center md:text-right rtl:md:text-left">
            <p className="text-sm text-muted-foreground">
              {language === "ar"
                ? "حقوق النشر © 2025 / مركز التأمين الفني MMC جميع الحقوق محفوظة"
                : "Copyright © 2025 / Technical Security Center MMC. All rights reserved"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
