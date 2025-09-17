"use client"

import { useEffect, useMemo, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { tips } from "@/data/tips"
import { ShieldCheck, LightbulbIcon, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function PersonalProtectTipsPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const tipsList = tips[language as "ar" | "en"] || []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % tipsList.length), 5000)
    return () => clearInterval(id)
  }, [tipsList.length])

  const current = tipsList[index] || ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"/>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{t("nav.personalProtect")}</h1>
          <p className="text-slate-300 max-w-3xl mx-auto">{language === "ar" ? "نصائح مبسطة لحماية نفسك وأجهزتك" : "Simple tips to protect yourself and your devices"}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Slider */}
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg mb-8">
          <div className="flex items-center gap-4">
            <button aria-label="prev" onClick={() => setIndex((i) => (i - 1 + tipsList.length) % tipsList.length)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:scale-105 transition">
              {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <div className="flex-1 text-center">
              <div className="mx-auto inline-flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <LightbulbIcon className="h-5 w-5" />
                <span className="text-base md:text-lg font-semibold">{current}</span>
              </div>
            </div>
            <button aria-label="next" onClick={() => setIndex((i) => (i + 1) % tipsList.length)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:scale-105 transition">
              {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/beginners/personal-protect/tools" className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">{language === "ar" ? "أدوات الحماية" : "Protection Tools"}</h3>
            <p className="text-gray-600 dark:text-gray-300">{language === "ar" ? "اكتشف أدوات تساعدك على الحماية" : "Discover tools that help you stay protected"}</p>
          </Link>
        </div>
      </div>
    </div>
  )
}




