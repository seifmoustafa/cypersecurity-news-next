"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import { Newspaper, Lightbulb, ArrowRight, ArrowLeft, Star, BookOpen } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { useNewsCategories } from "@/core/hooks/use-news-categories"
import { useCurrentYearAwareness } from "@/core/hooks/use-current-year-awareness"

export default function SimpleAwarenessPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isRtl = language === "ar"

  const [counts, setCounts] = useState({
    news: 0,
    awareness: 0,
  })

  // Fetch news categories and current year awareness
  const { categories: newsCategories, loading: categoriesLoading } = useNewsCategories(1, 3)
  const { awareness: currentYearAwareness, loading: awarenessLoading } = useCurrentYearAwareness("", 1, 3)

  // Debug logging
  console.log("Current year awareness:", currentYearAwareness)
  console.log("Awareness loading:", awarenessLoading)

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

  const mainCards = [
    {
      id: "news",
      title: language === "ar" ? "الأخبار" : "News",
      description: language === "ar" ? "آخر أخبار وتحديثات الأمن السيبراني" : "Latest cybersecurity news and updates",
      icon: Newspaper,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-br from-orange-50/80 to-red-50/60 dark:from-orange-900/30 dark:to-red-900/20",
      borderColor: "border-orange-300/60 dark:border-orange-600/40",
      href: "/simple/news-categories",
      items: newsCategories.slice(0, 3).map(category => ({
        title: language === "ar" ? category.name : category.nameEn || category.name,
        href: `/simple/news-categories/${category.id}`,
        icon: Newspaper,
        count: "",
        imageUrl: null
      })).concat([
        {
          title: language === "ar" ? "عرض المزيد من الفئات" : "View More Categories",
          href: "/simple/news-categories",
          icon: ArrowRight,
          count: "",
          imageUrl: null
        }
      ]),
    },
    {
      id: "awareness",
      title: language === "ar" ? "نشرات التوعية" : "Awareness Materials",
      description: language === "ar" ? "نشرات توعوية مبسطة حسب السنوات" : "Awareness materials by year",
      icon: Lightbulb,
      color: "from-yellow-400 to-amber-600",
      bgColor: "bg-gradient-to-br from-yellow-50/80 to-amber-50/60 dark:from-yellow-900/30 dark:to-amber-900/20",
      borderColor: "border-yellow-300/60 dark:border-yellow-600/40",
      href: "/simple/awareness/years",
      items: currentYearAwareness.length > 0 
        ? currentYearAwareness.slice(0, 2).map(item => ({
            title: language === "ar" ? item.title : (item.titleEn || item.title),
            href: `/simple/awareness/${item.year}/${item.id}`,
            icon: Lightbulb,
            count: "",
            imageUrl: null
          })).concat([
            {
              title: language === "ar" ? "عرض المزيد من هذا العام" : "View More This Year",
              href: "/simple/awareness/current-year",
              icon: ArrowRight,
              count: "",
              imageUrl: null
            },
            {
              title: language === "ar" ? "عرض جميع السنوات" : "View All Years",
              href: "/simple/awareness/years",
              icon: BookOpen,
              count: "",
              imageUrl: null
            }
          ])
        : [
            {
              title: language === "ar" ? "نشرات التوعية للعام الحالي" : "Current Year Materials",
              href: "/simple/awareness/current-year",
              icon: Lightbulb,
              count: "",
              imageUrl: null
            },
            {
              title: language === "ar" ? "عرض جميع السنوات" : "View All Years",
              href: "/simple/awareness/years",
              icon: BookOpen,
              count: "",
              imageUrl: null
            }
          ],
    },
  ]

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
            { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News" }
          ]} 
        />


        {/* Main Interactive Cards - Same Design as Main Page */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
          {mainCards.map((card, index) => {
            const gifPath = card.id === "news" 
              ? "/assets/images/news-events.gif" 
              : "/assets/images/beginners/Gemini_Generated_Image_70kvgb70kvgb70kv.png"

            return (
              <div
                key={card.id}
                role="link"
                tabIndex={0}
                onClick={() => router.push(card.href)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    router.push(card.href)
                  }
                }}
                className="group h-full block"
              >
                <div
                  className={`relative ${card.bgColor} backdrop-blur-sm border-2 ${card.borderColor} rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 h-full flex flex-col cursor-pointer`}
                  onMouseMove={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    const rect = el.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const rotateX = ((y - rect.height / 2) / rect.height) * -5
                    const rotateY = ((x - rect.width / 2) / rect.width) * 5
                    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
                  }}
                  style={{ transform: "perspective(1000px)" }}
                >
                  {/* GIF Hero Section - Same as Main Page */}
                  <div className="relative h-80 overflow-hidden flex-shrink-0">
                    <img
                      src={gifPath}
                      alt={`${card.title} animation`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:from-black/60 dark:via-transparent dark:to-transparent"></div>
                  </div>

                  {/* Content Section - Same as Main Page */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-shrink-0 mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    {/* Quick Access Links - Same as Main Page */}
                    <div className="space-y-2 flex-1 flex flex-col justify-center">
                      {card.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.href}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group/item border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20"
                        >
                          <div className="flex items-center gap-3">
                            {item.imageUrl && (
                              <img 
                                src={item.imageUrl} 
                                alt={item.title}
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                            )}
                            <span className="text-gray-700 dark:text-white text-sm font-medium group-hover/item:text-green-700 dark:group-hover/item:text-green-400 transition-colors duration-300">
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {item.count && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 bg-white/60 dark:bg-white/10 px-2 py-1 rounded-full group-hover/item:bg-green-200 dark:group-hover/item:bg-green-800 group-hover/item:text-green-700 dark:group-hover/item:text-green-200 transition-colors duration-300">
                                {item.count}
                              </span>
                            )}
                            {isRtl ? (
                              <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
                            ) : (
                              <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}