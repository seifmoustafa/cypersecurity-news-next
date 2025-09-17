"use client"

import { useLanguage } from "@/components/language-provider"
import { getAllDefinitions, definitionsData } from "@/data/definitions-data"
import { BookOpen, Search, Filter, Tags, ArrowRight, ArrowLeft } from "lucide-react"
import { useMemo, useState } from "react"

export default function BeginnersDefinitionsPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const all = useMemo(() => getAllDefinitions(), [])
  const categories = useMemo(() => Object.keys(definitionsData), [])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = activeCategory === "all" ? all : (definitionsData as any)[activeCategory] || []
    if (!q) return list
    return list.filter((d: any) =>
      (d.term[language] || "").toLowerCase().includes(q) ||
      (d.definition[language] || "").toLowerCase().includes(q)
    )
  }, [all, activeCategory, query, language])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"/>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{t("definitions.title")}</h1>
          <p className="text-slate-300 max-w-3xl mx-auto">{t("definitions.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("definitions.searchPlaceholder")}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-xl border ${activeCategory === "all" ? "bg-green-500 text-white border-green-500" : "border-slate-300 dark:border-slate-600 text-gray-700 dark:text-gray-200"}`}
              >
                {t("common.all")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl border ${activeCategory === cat ? "bg-green-500 text-white border-green-500" : "border-slate-300 dark:border-slate-600 text-gray-700 dark:text-gray-200"}`}
                >
                  {t(`definitions.categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((d: any) => (
            <div key={d.id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.02]">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">
                  {d.term[language]}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4">
                  {d.definition[language]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


