"use client"

import { useLanguage } from "@/components/language-provider"
import { 
  Video, 
  Play, 
  Clock, 
  Eye, 
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
  ThumbsUp,
  MessageCircle,
  Calendar,
  User,
  Tag
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BeginnersVideosPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"

  const videoCategories = [
    {
      id: "basics",
      title: language === "ar" ? "الأساسيات" : "Basics",
      count: 15
    },
    {
      id: "passwords",
      title: language === "ar" ? "كلمات المرور" : "Passwords",
      count: 8
    },
    {
      id: "phishing",
      title: language === "ar" ? "التصيد الاحتيالي" : "Phishing",
      count: 12
    },
    {
      id: "malware",
      title: language === "ar" ? "البرمجيات الضارة" : "Malware",
      count: 10
    },
    {
      id: "privacy",
      title: language === "ar" ? "الخصوصية" : "Privacy",
      count: 7
    }
  ]

  const videos = [
    {
      id: 1,
      title: language === "ar" ? "مقدمة في الأمن السيبراني للمبتدئين" : "Introduction to Cybersecurity for Beginners",
      description: language === "ar" ? "تعلم أساسيات الأمن السيبراني وأهميته في حياتنا اليومية" : "Learn the fundamentals of cybersecurity and its importance in our daily lives",
      duration: "15:30",
      views: "2.5K",
      rating: 4.8,
      thumbnail: "/placeholder.jpg",
      category: "basics",
      instructor: language === "ar" ? "أحمد محمد" : "Ahmed Mohammed",
      date: "2024-01-15",
      tags: [language === "ar" ? "أساسيات" : "Basics", language === "ar" ? "مقدمة" : "Introduction"]
    },
    {
      id: 2,
      title: language === "ar" ? "كيفية إنشاء كلمة مرور قوية وآمنة" : "How to Create Strong and Secure Passwords",
      description: language === "ar" ? "تعلم أفضل الممارسات لإنشاء كلمات مرور قوية وحماية حساباتك" : "Learn best practices for creating strong passwords and protecting your accounts",
      duration: "8:45",
      views: "1.8K",
      rating: 4.9,
      thumbnail: "/placeholder.jpg",
      category: "passwords",
      instructor: language === "ar" ? "فاطمة أحمد" : "Fatima Ahmed",
      date: "2024-01-12",
      tags: [language === "ar" ? "كلمات المرور" : "Passwords", language === "ar" ? "أمان" : "Security"]
    },
    {
      id: 3,
      title: language === "ar" ? "كيفية التعرف على رسائل التصيد الاحتيالي" : "How to Identify Phishing Emails",
      description: language === "ar" ? "تعلم كيفية التعرف على رسائل التصيد الاحتيالي وحماية نفسك منها" : "Learn how to identify phishing emails and protect yourself from them",
      duration: "12:20",
      views: "3.2K",
      rating: 4.7,
      thumbnail: "/placeholder.jpg",
      category: "phishing",
      instructor: language === "ar" ? "محمد علي" : "Mohammed Ali",
      date: "2024-01-10",
      tags: [language === "ar" ? "التصيد" : "Phishing", language === "ar" ? "البريد الإلكتروني" : "Email"]
    },
    {
      id: 4,
      title: language === "ar" ? "حماية البيانات الشخصية على الإنترنت" : "Protecting Personal Data Online",
      description: language === "ar" ? "تعلم كيفية حماية بياناتك الشخصية عند استخدام الإنترنت" : "Learn how to protect your personal data when using the internet",
      duration: "18:15",
      views: "2.1K",
      rating: 4.6,
      thumbnail: "/placeholder.jpg",
      category: "privacy",
      instructor: language === "ar" ? "سارة حسن" : "Sara Hassan",
      date: "2024-01-08",
      tags: [language === "ar" ? "الخصوصية" : "Privacy", language === "ar" ? "البيانات" : "Data"]
    },
    {
      id: 5,
      title: language === "ar" ? "أنواع البرمجيات الضارة وكيفية الوقاية منها" : "Types of Malware and How to Prevent Them",
      description: language === "ar" ? "تعرف على أنواع البرمجيات الضارة المختلفة وطرق الوقاية منها" : "Learn about different types of malware and prevention methods",
      duration: "14:30",
      views: "1.9K",
      rating: 4.8,
      thumbnail: "/placeholder.jpg",
      category: "malware",
      instructor: language === "ar" ? "خالد إبراهيم" : "Khalid Ibrahim",
      date: "2024-01-05",
      tags: [language === "ar" ? "البرمجيات الضارة" : "Malware", language === "ar" ? "الوقاية" : "Prevention"]
    },
    {
      id: 6,
      title: language === "ar" ? "استخدام المصادقة الثنائية" : "Using Two-Factor Authentication",
      description: language === "ar" ? "تعلم كيفية تفعيل واستخدام المصادقة الثنائية لحماية حساباتك" : "Learn how to enable and use two-factor authentication to protect your accounts",
      duration: "10:45",
      views: "2.3K",
      rating: 4.9,
      thumbnail: "/placeholder.jpg",
      category: "basics",
      instructor: language === "ar" ? "نور الدين" : "Nour Al-Din",
      date: "2024-01-03",
      tags: [language === "ar" ? "المصادقة الثنائية" : "2FA", language === "ar" ? "الحماية" : "Protection"]
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
              {language === "ar" ? "الفيديوهات التعليمية" : "Educational Videos"}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {language === "ar" 
                ? "تعلم الأمن السيبراني من خلال فيديوهات تفاعلية ومفهومة للمبتدئين"
                : "Learn cybersecurity through interactive and beginner-friendly videos"
              }
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === "ar" ? "ابحث في الفيديوهات..." : "Search videos..."}
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

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === "ar" ? "التصنيفات" : "Categories"}
          </h2>
          <div className="flex flex-wrap gap-3">
            {videoCategories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500/30"
              >
                <Tag className="h-4 w-4" />
                {category.title}
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-105">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {video.duration}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {video.views}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {video.tags.map((tag, index) => (
                    <span key={index} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
                  {video.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {video.instructor}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {video.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {video.rating}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white group/btn">
                    <span className="mr-2 rtl:mr-0 rtl:ml-2">
                      {language === "ar" ? "مشاهدة" : "Watch"}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                    ) : (
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
            {language === "ar" ? "تحميل المزيد" : "Load More"}
          </Button>
        </div>
      </div>
    </div>
  )
}
