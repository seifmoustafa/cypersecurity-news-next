"use client"

import { useLanguage } from "@/components/language-provider"
import { definitionsData } from "@/data/definitions-data"
import { BookOpen, ShieldCheck, Zap, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

const iconMap: Record<string, any> = {
  general: BookOpen,
  technical: ShieldCheck,
  legal: Zap,
  threats: AlertTriangle,
}

export default function DefinitionsCategoriesPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"

  const categories = Object.keys(definitionsData)

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

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = iconMap[cat] || BookOpen
            return (
              <Link
                key={cat}
                href={`/beginners/definitions/categories/${cat}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-green-500/15">
                    <Icon className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-500 transition-colors">
                    {t(`definitions.categories.${cat}`)}
                  </h3>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {language === "ar" ? "عرض المصطلحات في هذا التصنيف" : "View terms in this category"}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}




