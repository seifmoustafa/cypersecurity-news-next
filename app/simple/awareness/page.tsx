"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import { Newspaper, Lightbulb, ArrowRight, ArrowLeft, Star } from "lucide-react"

export default function SimpleAwarenessPage() {
  const { language } = useLanguage()
  const isRtl = language === "ar"

  const [counts, setCounts] = useState({
    news: 0,
    awareness: 0,
  })

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [newsData, awarenessResp] = await Promise.all([
          container.services.news.getNewsByCategory(null, 1, 100),
          container.services.awareness.getCurrentYearAwareness("", 1, 100),
        ])
        setCounts({
          news: newsData?.length || 0,
          awareness: awarenessResp?.pagination?.itemsCount || awarenessResp?.data?.length || 0,
        })
      } catch (e) {
        setCounts({ news: 0, awareness: 0 })
      }
    }
    fetchCounts()
  }, [])

  const cards = [
    {
      id: "news",
      title: language === "ar" ? "الأخبار" : "News",
      description:
        language === "ar"
          ? "آخر أخبار وتحديثات الأمن السيبراني"
          : "Latest cybersecurity news and updates",
      icon: Newspaper,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      count: `${counts.news}+`,
      href: "/advanced/news",
    },
    {
      id: "awareness",
      title: language === "ar" ? "التوعية" : "Awareness",
      description:
        language === "ar"
          ? "مواد توعوية مبسطة حسب السنوات"
          : "Awareness materials by year",
      icon: Lightbulb,
      color: "from-yellow-400 to-amber-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      count: `${counts.awareness}+`,
      href: "/advanced/awareness",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
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
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-xl blur-lg opacity-30" />
              <div className="relative bg-gradient-to-r from-yellow-400 to-amber-600 p-4 rounded-xl">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === "ar" ? "التوعية المبسطة" : "Simple Awareness"}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {language === "ar"
              ? "تصفح الأخبار ومواد التوعية المبسطة"
              : "Browse simplified awareness and news"}
          </p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.id} href={card.href} className="group">
                <div
                  className={`${card.bgColor} p-8 rounded-3xl border-2 ${card.borderColor} transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 h-full will-change-transform`}
                >
                  <div className="flex items-center mb-6">
                    <div className={`bg-gradient-to-r ${card.color} p-4 rounded-2xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{card.description}</div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {card.count} {language === "ar" ? "محتوى" : "items"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">4.8</span>
                    </div>
                  </div>
                  <div className={`inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r ${card.color} text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn`}>
                    <span className="mr-2 rtl:mr-0 rtl:ml-2">{language === "ar" ? "استكشف الآن" : "Explore Now"}</span>
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


