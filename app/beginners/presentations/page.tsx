"use client"

import { useLanguage } from "@/components/language-provider"
import { mediaLibraryData } from "@/data/media-library-data"
import { Presentation, Search, Download, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

export default function BeginnersPresentationsPage() {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  const [query, setQuery] = useState("")

  const presentations = useMemo(() => mediaLibraryData.presentations, [])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return presentations
    return presentations.filter((p) =>
      (p.title[language] || "").toLowerCase().includes(q) ||
      (p.description[language] || "").toLowerCase().includes(q)
    )
  }, [presentations, query, language])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"/>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
                <Presentation className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{language === "ar" ? "العروض التقديمية" : "Presentations"}</h1>
          <p className="text-slate-300 max-w-3xl mx-auto">{language === "ar" ? "مواد عرض مبسطة للمبتدئين" : "Beginner-friendly presentation materials"}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === "ar" ? "ابحث..." : "Search..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.02]">
              <div className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"/>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">
                  {p.title[language]}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                  {p.description[language]}
                </p>
                <Link href={p.url} className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transition-all">
                  <Download className="h-4 w-4 mr-2" />
                  {language === "ar" ? "تحميل" : "Download"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


