"use client"

import { useParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { getDefinitionsByCategory } from "@/data/definitions-data"
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DefinitionsCategoryPage() {
  const params = useParams() as { category: string }
  const category = Array.isArray(params?.category) ? params.category[0] : params.category
  const { language, t } = useLanguage()
  const isRtl = language === "ar"

  const items = getDefinitionsByCategory(category || "general")

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
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t(`definitions.categories.${category}`)}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((d: any) => (
            <div key={d.id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.02]">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">
                  {d.term[language]}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-5">
                  {d.definition[language]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/beginners/definitions/categories" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
            {isRtl ? <ArrowRight className="h-5 w-5 ml-2" /> : <ArrowLeft className="h-5 w-5 mr-2" />}
            {t("common.back")}
          </Link>
        </div>
      </div>
    </div>
  )
}




