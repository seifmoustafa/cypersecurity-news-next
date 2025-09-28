"use client"

import { useLanguage } from "@/components/language-provider"
import { getAllNews } from "@/data/news-data"
import { Newspaper, Search, Calendar, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import Breadcrumbs from "@/components/breadcrumbs"

export default function BeginnersNewsPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [query, setQuery] = useState("")

  const items = useMemo(() => getAllNews(), [])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((n: any) => (n.title?.[language] || "").toLowerCase().includes(q))
  }, [items, query, language])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
            { label: language === "ar" ? "الأخبار" : "News" }
          ]} 
        />

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === "ar" ? "ابحث في الأخبار..." : "Search news..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>


        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((n: any, index: number) => (
            <Link 
              key={n.id} 
              href={`#`} 
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden"
                onMouseMove={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  const rect = el.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  const rotateX = ((y - rect.height / 2) / rect.height) * -3
                  const rotateY = ((x - rect.width / 2) / rect.width) * 3
                  el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)"
                }}
                style={{ transform: "perspective(900px)" }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-sky-500 to-blue-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                      <Newspaper className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                    {language === "ar" ? "خبر" : "News"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* News Header */}
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-teal-500 to-red-600 p-3 rounded-xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <Newspaper className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> {n.date}
                      </div>
                    </div>
                  </div>

                  {/* News Title */}
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
                    {n.title?.[language] || n.title?.en}
                  </h3>

                  {/* News Summary */}
                  <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-4">
                    {n.summary?.[language] || n.summary?.en}
                  </div>

                  {/* News Footer */}
                  <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-orange-400">
                    <span className="mr-2 rtl:mr-0 rtl:ml-2">
                      {t("common.readMore")}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                    ) : (
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


