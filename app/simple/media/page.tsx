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
  Star
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { container } from "@/core/di/container"

export default function BeginnersMediaPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [mediaStats, setMediaStats] = useState({
    videos: 0,
    lectures: 0,
    presentations: 0,
  })

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
      id: "videos",
      title: language === "ar" ? "الفيديوهات التعليمية" : "Educational Videos",
      description: language === "ar" ? "فيديوهات تفاعلية لتعلم أساسيات الأمن السيبراني" : "Interactive videos to learn cybersecurity fundamentals",
      icon: Video,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      count: `${mediaStats.videos}+`,
      href: "/simple/videos"
    },
    {
      id: "lectures",
      title: language === "ar" ? "المحاضرات المتخصصة" : "Specialized Lectures",
      description: language === "ar" ? "محاضرات مفصلة من خبراء الأمن السيبراني" : "Detailed lectures from cybersecurity experts",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      count: `${mediaStats.lectures}+`,
      href: "/simple/lectures"
    },
    {
      id: "presentations",
      title: language === "ar" ? "العروض التفاعلية" : "Interactive Presentations",
      description: language === "ar" ? "عروض تقديمية تفاعلية مع أمثلة عملية" : "Interactive presentations with practical examples",
      icon: Presentation,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      count: `${mediaStats.presentations}+`,
      href: "/simple/presentations"
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

      <div className="relative z-10 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"/>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
                <Video className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === "ar" ? "الوسائط التعليمية" : "Educational Media"}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {language === "ar" 
              ? "اكتشف عالم التعلم المرئي والمسموع من خلال مكتبة شاملة من الفيديوهات والمحاضرات والعروض التقديمية"
              : "Discover the world of visual and audio learning through a comprehensive library of videos, lectures, and presentations"
            }
          </p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === "ar" ? "إجمالي الوسائط" : "Total Media"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {mediaCategories.reduce((sum, cat) => sum + parseInt(cat.count), 0)}+ {language === "ar" ? "محتوى" : "items"}
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

        {/* Media Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mediaCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.id}
                href={category.href}
                className="group"
              >
                <div
                  className={`${category.bgColor} p-8 rounded-3xl border-2 ${category.borderColor} transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 h-full will-change-transform`}
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
                    <div className={`bg-gradient-to-r ${category.color} p-4 rounded-2xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {category.description}
                  </div>

                  {/* Card Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.count} {language === "ar" ? "محتوى" : "items"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">4.8</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className={`inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r ${category.color} text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-green-400`}>
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
