"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { 
  Video, 
  Play, 
  GraduationCap, 
  Presentation, 
  Newspaper,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Share2,
  Bookmark,
  Eye,
  Clock,
  Star,
  FileText,
  BookOpen,
  Shield,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { container } from "@/core/di/container"
import Breadcrumbs from "@/components/breadcrumbs"
import { useArticles } from "@/core/hooks/use-articles"
import { useReferences } from "@/core/hooks/use-references"
import type { ApiArticle } from "@/core/domain/models/media"

export default function BeginnersMediaPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [mediaStats, setMediaStats] = useState({
    videos: 0,
    lectures: 0,
    presentations: 0,
  })

  // Fetch first 2 articles for the articles card
  const { articles } = useArticles(1, 2)
  
  // Fetch first 2 references for the references card
  const { references, loading: referencesLoading } = useReferences("", 1, 2)

  useEffect(() => {
    const fetchMediaStats = async () => {
      try {
        // Fetch real data from backend services
        const mediaData = await container.services.media.getAllMedia(1, 100)
        
        setMediaStats({
          videos: mediaData?.filter((item: any) => item.type === 'video').length || 0,
          lectures: mediaData?.filter((item: any) => item.type === 'lecture').length || 0,
          presentations: mediaData?.filter((item: any) => item.type === 'presentation').length || 0,
        })
      } catch (error) {
        console.error('Error fetching media stats:', error)
        // Fallback to default counts
        setMediaStats({
          videos: 50,
          lectures: 30,
          presentations: 25,
        })
      }
    }

    fetchMediaStats()
  }, [])

  const mediaCategories = [
    {
      id: "lessons",
      title: language === "ar" ? "دروس تعليمية" : "Educational Lessons",
      description: language === "ar" ? "دروس تفاعلية لتعلم أساسيات الأمن السيبراني" : "Interactive lessons to learn cybersecurity fundamentals",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      count: "",
      href: "/simple/media/lessons",
      imagePath: "/api/images/beginners/Gemini_Generated_Image_c7ds1sc7ds1sc7ds.png",
      items: [
        {
          title: language === "ar" ? "الفيديوهات" : "Videos",
          href: "/simple/media/lessons/videos",
          icon: Video,
        },
        {
          title: language === "ar" ? "المحاضرات" : "Lectures",
          href: "/simple/media/lessons/lectures",
          icon: GraduationCap,
        },
        {
          title: language === "ar" ? "العروض التقديمية" : "Presentations",
          href: "/simple/media/lessons/presentations",
          icon: Presentation,
        },
      ]
    },
    {
      id: "articles",
      title: language === "ar" ? "مقالات" : "Articles",
      description: language === "ar" ? "مقالات متخصصة في الأمن السيبراني والتقنيات الحديثة" : "Specialized articles on cybersecurity and modern technologies",
      icon: FileText,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      count: "",
      href: "/simple/media/articles",
      imagePath: "/api/images/beginners/Gemini_Generated_Image_dudzufdudzufdudz.png",
      items: [
        {
          title: language === "ar" ? "مقالات تقنية" : "Technical Articles",
          href: "/simple/media/articles/technical",
          icon: FileText,
        },
        {
          title: language === "ar" ? "مقالات الأمان" : "Security Articles",
          href: "/simple/media/articles/security",
          icon: Shield,
        },
        {
          title: language === "ar" ? "مقالات الأخبار" : "News Articles",
          href: "/simple/media/articles/news",
          icon: Newspaper,
        },
      ]
    },
    {
      id: "references",
      title: language === "ar" ? "مراجع" : "References",
      description: language === "ar" ? "مراجع وموارد شاملة للبحث والتعلم المتقدم" : "Comprehensive references and resources for advanced research and learning",
      icon: BookOpen,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      count: "",
      href: "/simple/media/references",
      imagePath: "/api/images/beginners/Gemini_Generated_Image_ry6ctary6ctary6c.png",
      items: [
        {
          title: language === "ar" ? "الكتب المرجعية" : "Reference Books",
          href: "/simple/media/references/books",
          icon: BookOpen,
        },
        {
          title: language === "ar" ? "المعايير" : "Standards",
          href: "/simple/media/references/standards",
          icon: Shield,
        },
        {
          title: language === "ar" ? "الأدلة" : "Guides",
          href: "/simple/media/references/guides",
          icon: FileText,
        },
      ]
    }
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
            { label: language === "ar" ? "المكتبة الثقافية" : "Media Library" }
          ]} 
        />


        {/* Media Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mediaCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.id}
                href={category.href}
                className="group h-full block"
              >
                <div
                  className={`relative ${category.bgColor} backdrop-blur-sm border-2 ${category.borderColor} rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 h-full flex flex-col cursor-pointer`}
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
                  {/* Image Hero Section */}
                  <div className="relative h-80 overflow-hidden flex-shrink-0">
                    <img
                      src={category.imagePath}
                      alt={`${category.title} animation`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:from-black/60 dark:via-transparent dark:to-transparent"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-shrink-0 mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    {/* Quick Access Links */}
                    <div className="space-y-2 flex-1 flex flex-col justify-center">
                      {category.id === "articles" ? (
                        // Show actual articles for articles card
                        <>
                          {articles.slice(0, 2).map((article, articleIndex) => (
                            <Link
                              key={article.id}
                              href={`/simple/media/articles/${article.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group/item border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20"
                            >
                              <div className="flex-1 min-w-0">
                                <span className="text-gray-700 dark:text-white text-sm font-medium group-hover/item:text-green-700 dark:group-hover/item:text-green-400 transition-colors duration-300 line-clamp-1">
                                  {language === "ar" ? article.title : article.titleEn || article.title}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(article.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {isRtl ? (
                                  <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
                                ) : (
                                  <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
                                )}
                              </div>
                            </Link>
                          ))}
                          <Link
                            href="/simple/media/articles"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center p-3 bg-green-500/20 dark:bg-green-500/10 hover:bg-green-500/30 dark:hover:bg-green-500/20 rounded-lg transition-all duration-300 group/item border border-green-500/30 dark:border-green-500/20 hover:border-green-500/50 dark:hover:border-green-500/30"
                          >
                            <span className="text-green-700 dark:text-green-400 text-sm font-medium group-hover/item:text-green-800 dark:group-hover/item:text-green-300 transition-colors duration-300">
                              {language === "ar" ? "عرض المزيد" : "View More"}
                            </span>
                            <div className="flex items-center ml-2">
                              {isRtl ? (
                                <ArrowLeft className="h-4 w-4 text-green-600 dark:text-green-400 group-hover/item:text-green-700 dark:group-hover/item:text-green-300 transition-colors duration-300" />
                              ) : (
                                <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400 group-hover/item:text-green-700 dark:group-hover/item:text-green-300 transition-colors duration-300" />
                              )}
                            </div>
                          </Link>
                        </>
                      ) : category.id === "references" ? (
                        // Show actual references for references card
                        <>
                          {referencesLoading ? (
                            // Loading state
                            <>
                              {[...Array(2)].map((_, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10 animate-pulse">
                                  <div className="flex-1 min-w-0">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                  </div>
                                  <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                </div>
                              ))}
                            </>
                          ) : references.length > 0 ? (
                            // Show actual references
                            references.slice(0, 2).map((reference, referenceIndex) => (
                              <Link
                                key={reference.id}
                                href={`/simple/media/references/${reference.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group/item border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20"
                              >
                                <div className="flex-1 min-w-0">
                                  <span className="text-gray-700 dark:text-white text-sm font-medium group-hover/item:text-purple-700 dark:group-hover/item:text-purple-400 transition-colors duration-300 line-clamp-1">
                                    {language === "ar" ? reference.title : reference.titleEn || reference.title}
                                  </span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(reference.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {isRtl ? (
                                    <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors duration-300" />
                                  ) : (
                                    <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors duration-300" />
                                  )}
                                </div>
                              </Link>
                            ))
                          ) : (
                            // Empty state - show placeholder items
                            <>
                              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10">
                                <div className="flex-1 min-w-0">
                                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                    {language === "ar" ? "مرجع رقم 1" : "Reference 1"}
                                  </span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date().toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {isRtl ? (
                                    <ArrowLeft className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <ArrowRight className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10">
                                <div className="flex-1 min-w-0">
                                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                    {language === "ar" ? "مرجع رقم 2" : "Reference 2"}
                                  </span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date().toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {isRtl ? (
                                    <ArrowLeft className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <ArrowRight className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                          <Link
                            href="/simple/media/references"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center p-3 bg-purple-500/20 dark:bg-purple-500/10 hover:bg-purple-500/30 dark:hover:bg-purple-500/20 rounded-lg transition-all duration-300 group/item border border-purple-500/30 dark:border-purple-500/20 hover:border-purple-500/50 dark:hover:border-purple-500/30"
                          >
                            <span className="text-purple-700 dark:text-purple-400 text-sm font-medium group-hover/item:text-purple-800 dark:group-hover/item:text-purple-300 transition-colors duration-300">
                              {language === "ar" ? "عرض المزيد" : "View More"}
                            </span>
                            <div className="flex items-center ml-2">
                              {isRtl ? (
                                <ArrowLeft className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover/item:text-purple-700 dark:group-hover/item:text-purple-300 transition-colors duration-300" />
                              ) : (
                                <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover/item:text-purple-700 dark:group-hover/item:text-purple-300 transition-colors duration-300" />
                              )}
                            </div>
                          </Link>
                        </>
                      ) : (
                        // Show regular items for other cards
                        category.items?.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group/item border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20"
                          >
                            <span className="text-gray-700 dark:text-white text-sm font-medium group-hover/item:text-green-700 dark:group-hover/item:text-green-400 transition-colors duration-300">
                              {item.title}
                            </span>
                            <div className="flex items-center">
                              {isRtl ? (
                                <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
                              ) : (
                                <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
                              )}
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
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
