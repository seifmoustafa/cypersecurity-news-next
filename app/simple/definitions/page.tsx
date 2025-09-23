"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { definitionsData } from "@/data/definitions-data"
import { BookOpen, ShieldCheck, Zap, AlertTriangle, ArrowRight, ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import { container } from "@/core/di/container"

const iconMap: Record<string, any> = {
  general: BookOpen,
  technical: ShieldCheck,
  legal: Zap,
  threats: AlertTriangle,
}

export default function BeginnersDefinitionsPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [categories, setCategories] = useState<string[]>([])
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch real categories from backend
        const backendCategories = await container.services.definitions.getCategories()
        setCategories(backendCategories.length > 0 ? backendCategories : Object.keys(definitionsData))
        
        // Fetch stats for each category
        const stats: Record<string, number> = {}
        for (const category of backendCategories.length > 0 ? backendCategories : Object.keys(definitionsData)) {
          try {
            const categoryData = await container.services.definitions.getDefinitionsByCategory(category, 1, 1)
            stats[category] = categoryData.total || 0
          } catch (error) {
            console.error(`Error fetching stats for category ${category}:`, error)
            stats[category] = (definitionsData as any)[category]?.length || 0
          }
        }
        setCategoryStats(stats)
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to static data
        setCategories(Object.keys(definitionsData))
        const stats: Record<string, number> = {}
        Object.keys(definitionsData).forEach(category => {
          stats[category] = (definitionsData as any)[category]?.length || 0
        })
        setCategoryStats(stats)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl blur-lg opacity-30"/>
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 p-4 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("definitions.title")}</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">{t("definitions.subtitle")}</p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === "ar" ? "إجمالي التصنيفات" : "Total Categories"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {categories.length} {language === "ar" ? "تصنيف" : "categories"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === "ar" ? "محدث آخر مرة" : "Last updated"}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => {
            const Icon = iconMap[cat] || BookOpen
            const colors = [
              "from-green-500 to-emerald-600",
              "from-blue-500 to-cyan-600", 
              "from-purple-500 to-indigo-600",
              "from-orange-500 to-red-600"
            ]
            const bgColors = [
              "bg-green-50 dark:bg-green-900/20",
              "bg-blue-50 dark:bg-blue-900/20",
              "bg-purple-50 dark:bg-purple-900/20", 
              "bg-orange-50 dark:bg-orange-900/20"
            ]
            const borderColors = [
              "border-green-200 dark:border-green-800",
              "border-blue-200 dark:border-blue-800",
              "border-purple-200 dark:border-purple-800",
              "border-orange-200 dark:border-orange-800"
            ]
            
            return (
              <Link
                key={cat}
                href={`/simple/advanced/definitions/categories/${cat}`}
                className="group"
              >
                <div
                  className={`${bgColors[index % bgColors.length]} p-8 rounded-3xl border-2 ${borderColors[index % borderColors.length]} transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 h-full will-change-transform`}
                  onMouseMove={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    const rect = el.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const rotateX = ((y - rect.height / 2) / rect.height) * -6
                    const rotateY = ((x - rect.width / 2) / rect.width) * 6
                    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)"
                  }}
                  style={{ transform: "perspective(900px)" }}
                >
                  {/* Card Header */}
                  <div className="flex items-center mb-6">
                    <div className={`bg-gradient-to-r ${colors[index % colors.length]} p-4 rounded-2xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {t(`definitions.categories.${cat}`)}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    {language === "ar" ? "عرض المصطلحات في هذا التصنيف" : "View terms in this category"}
                  </div>

                  {/* Card Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {categoryStats[cat] || 0} {language === "ar" ? "مصطلح" : "terms"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">4.8</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className={`inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r ${colors[index % colors.length]} text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-blue-400`}>
                    <span className="mr-2 rtl:mr-0 rtl:ml-2">
                      {language === "ar" ? "استكشف الآن" : "Explore Now"}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-5 w-5 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                    ) : (
                      <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}


