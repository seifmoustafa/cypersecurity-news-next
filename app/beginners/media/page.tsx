"use client"

import { useLanguage } from "@/components/language-provider"
import { 
  Video, 
  Play, 
  GraduationCap, 
  Presentation, 
  Clock, 
  Users, 
  Star,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Share2,
  Bookmark,
  Eye
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BeginnersMediaPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"

  const mediaCategories = [
    {
      id: "videos",
      title: language === "ar" ? "الفيديوهات التعليمية" : "Educational Videos",
      description: language === "ar" ? "فيديوهات تفاعلية لتعلم أساسيات الأمن السيبراني" : "Interactive videos to learn cybersecurity fundamentals",
      icon: Video,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      count: "50+",
      items: [
        {
          title: language === "ar" ? "مقدمة في الأمن السيبراني" : "Introduction to Cybersecurity",
          duration: "15:30",
          views: "2.5K",
          rating: 4.8,
          thumbnail: "/placeholder.jpg"
        },
        {
          title: language === "ar" ? "كيفية إنشاء كلمة مرور قوية" : "How to Create Strong Passwords",
          duration: "8:45",
          views: "1.8K",
          rating: 4.9,
          thumbnail: "/placeholder.jpg"
        },
        {
          title: language === "ar" ? "حماية البيانات الشخصية" : "Protecting Personal Data",
          duration: "12:20",
          views: "3.2K",
          rating: 4.7,
          thumbnail: "/placeholder.jpg"
        }
      ]
    },
    {
      id: "lectures",
      title: language === "ar" ? "المحاضرات المتخصصة" : "Specialized Lectures",
      description: language === "ar" ? "محاضرات مفصلة من خبراء الأمن السيبراني" : "Detailed lectures from cybersecurity experts",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      count: "30+",
      items: [
        {
          title: language === "ar" ? "أساسيات التشفير" : "Cryptography Fundamentals",
          duration: "45:00",
          views: "1.2K",
          rating: 4.6,
          thumbnail: "/placeholder.jpg"
        },
        {
          title: language === "ar" ? "إدارة المخاطر السيبرانية" : "Cyber Risk Management",
          duration: "38:15",
          views: "980",
          rating: 4.8,
          thumbnail: "/placeholder.jpg"
        },
        {
          title: language === "ar" ? "الاستجابة للحوادث الأمنية" : "Incident Response",
          duration: "52:30",
          views: "1.5K",
          rating: 4.7,
          thumbnail: "/placeholder.jpg"
        }
      ]
    },
    {
      id: "presentations",
      title: language === "ar" ? "العروض التفاعلية" : "Interactive Presentations",
      description: language === "ar" ? "عروض تقديمية تفاعلية مع أمثلة عملية" : "Interactive presentations with practical examples",
      icon: Presentation,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      count: "25+",
      items: [
        {
          title: language === "ar" ? "أدوات الحماية الأساسية" : "Essential Protection Tools",
          duration: "25:00",
          views: "890",
          rating: 4.5,
          thumbnail: "/placeholder.jpg"
        },
        {
          title: language === "ar" ? "أفضل الممارسات الأمنية" : "Security Best Practices",
          duration: "32:45",
          views: "1.1K",
          rating: 4.8,
          thumbnail: "/placeholder.jpg"
        },
        {
          title: language === "ar" ? "التوعية الأمنية للمستخدمين" : "User Security Awareness",
          duration: "28:20",
          views: "1.3K",
          rating: 4.6,
          thumbnail: "/placeholder.jpg"
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"></div>
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
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === "ar" ? "ابحث في الوسائط..." : "Search media..."}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {language === "ar" ? "تصفية" : "Filter"}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                {language === "ar" ? "شبكة" : "Grid"}
              </Button>
            </div>
          </div>
        </div>

        {/* Media Categories */}
        <div className="space-y-12">
          {mediaCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <div key={category.id} className="group">
                <div className="flex items-center mb-6">
                  <div className={`bg-gradient-to-r ${category.color} p-4 rounded-2xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {category.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {category.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {category.count} {language === "ar" ? "محتوى" : "items"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Media Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="group/item bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-105">
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full p-4 group-hover/item:scale-110 transition-transform duration-300">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {item.duration}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {item.rating}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white group/btn">
                          <span className="mr-2 rtl:mr-0 rtl:ml-2">
                            {language === "ar" ? "مشاهدة" : "Watch"}
                          </span>
                          {isRtl ? (
                            <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                          ) : (
                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-8">
                  <Link
                    href={`/beginners/${category.id}`}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="mr-2 rtl:mr-0 rtl:ml-2">
                      {language === "ar" ? "عرض الكل" : "View All"}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-5 w-5" />
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
