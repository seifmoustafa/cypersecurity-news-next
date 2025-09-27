"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { BookOpen, Search, Calendar, ArrowRight, ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { container } from "@/core/di/container"
import Breadcrumbs from "@/components/breadcrumbs"

export default function SimpleArticlesPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [query, setQuery] = useState("")
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const data = await container.services.articles.getAllArticles(1, 100)
        setArticles(data || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return articles
    return articles.filter((article: any) => 
      (article.title?.toLowerCase().includes(q)) ||
      (article.titleEn?.toLowerCase().includes(q)) ||
      (article.summary?.toLowerCase().includes(q)) ||
      (article.summaryEn?.toLowerCase().includes(q))
    )
  }, [articles, query])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "ar" ? "المقالات" : "Articles"}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {language === "ar" ? "مقالات تفصيلية حول الأمن السيبراني" : "Detailed articles about cybersecurity"}
            </p>
          </div>
        </div>
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg h-96 animate-pulse">
                <div className="p-8">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

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
            { label: language === "ar" ? "المقالات" : "Articles" }
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
                placeholder={language === "ar" ? "ابحث في المقالات..." : "Search articles..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>


        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article: any, index: number) => (
            <Link 
              key={article.id} 
              href={`/advanced/articles/${article.id}`} 
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden"
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
                <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-cyan-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                    {language === "ar" ? "مقال" : "Article"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Article Header */}
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> 
                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                    {language === "ar" ? (article.title || article.titleEn) : (article.titleEn || article.title)}
                  </h3>

                  {/* Article Summary */}
                  <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-4">
                    {language === "ar" ? (article.summary || article.summaryEn) : (article.summaryEn || article.summary)}
                  </div>

                  {/* Article Footer */}
                  <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-blue-400">
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

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === "ar" ? "لا توجد مقالات" : "No articles found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {language === "ar" ? "لم يتم العثور على أي مقالات تطابق بحثك" : "No articles found matching your search"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
