"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { 
  LightbulbIcon, 
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Clock,
  Star,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { container } from "@/core/di/container"

interface Tip {
  id: string
  title: string
  content: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  createdAt: string
  updatedAt: string
}

export default function PersonalProtectTipsPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true)
        // Fetch real tips from backend
        const tipsData = await container.services.tips.getAllTips(1, 100)
        const tipItems = tipsData?.map((tip: any) => ({
          id: tip.id,
          title: tip.title?.[language] || tip.title || 'Security Tip',
          content: tip.content?.[language] || tip.content || '',
          category: tip.category || 'general',
          difficulty: tip.difficulty || 'beginner',
          createdAt: tip.createdAt || new Date().toISOString(),
          updatedAt: tip.updatedAt || new Date().toISOString()
        })) || []
        
        setTips(tipItems)
      } catch (error) {
        console.error('Error fetching tips:', error)
        // Fallback to mock data
        setTips([
          {
            id: '1',
            title: language === "ar" ? "استخدم كلمات مرور قوية" : "Use Strong Passwords",
            content: language === "ar" ? "استخدم كلمات مرور تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز خاصة. تجنب استخدام المعلومات الشخصية." : "Use passwords that contain uppercase and lowercase letters, numbers, and special characters. Avoid using personal information.",
            category: 'password',
            difficulty: 'beginner',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            title: language === "ar" ? "فعّل المصادقة الثنائية" : "Enable Two-Factor Authentication",
            content: language === "ar" ? "فعّل المصادقة الثنائية على جميع حساباتك المهمة لزيادة مستوى الأمان." : "Enable two-factor authentication on all your important accounts to increase security level.",
            category: 'authentication',
            difficulty: 'beginner',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            title: language === "ar" ? "احتفظ بنسخ احتياطية" : "Keep Backups",
            content: language === "ar" ? "احتفظ بنسخ احتياطية منتظمة من بياناتك المهمة في مكان آمن." : "Keep regular backups of your important data in a secure location.",
            category: 'backup',
            difficulty: 'beginner',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTips()
  }, [language])

  const filteredTips = tips.filter(tip =>
    tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentTip = filteredTips[currentTipIndex]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-600'
      case 'intermediate': return 'from-yellow-500 to-orange-600'
      case 'advanced': return 'from-red-500 to-pink-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return language === "ar" ? "مبتدئ" : "Beginner"
      case 'intermediate': return language === "ar" ? "متوسط" : "Intermediate"
      case 'advanced': return language === "ar" ? "متقدم" : "Advanced"
      default: return difficulty
    }
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

      <div className="relative z-10 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur-lg opacity-30"/>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl">
                <LightbulbIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === "ar" ? "نصائح الأمان" : "Security Tips"}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {language === "ar" 
              ? "نصائح يومية لحماية نفسك وأجهزتك من التهديدات السيبرانية"
              : "Daily tips to protect yourself and your devices from cyber threats"
            }
          </p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                <LightbulbIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === "ar" ? "إجمالي النصائح" : "Total Tips"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {tips.length} {language === "ar" ? "نصيحة" : "tips"}
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

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === "ar" ? "ابحث في النصائح..." : "Search tips..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {language === "ar" ? "تصفية" : "Filter"}
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive Tips Slider */}
        {!loading && filteredTips.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-slate-200 dark:border-slate-700 shadow-lg mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {language === "ar" ? "نصيحة اليوم" : "Tip of the Day"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {language === "ar" ? "نصائح أمنية مهمة للمبتدئين" : "Important security tips for beginners"}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                aria-label="prev" 
                onClick={() => setCurrentTipIndex((i) => (i - 1 + filteredTips.length) % filteredTips.length)} 
                className="p-4 rounded-xl bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-700 dark:to-gray-700 hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                {isRtl ? <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" /> : <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
              </button>
              
              <div className="flex-1 text-center">
                <div className="mx-auto inline-flex items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <LightbulbIcon className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{currentTip?.title}</h3>
                    <p className="text-sm md:text-base opacity-90 max-w-2xl">{currentTip?.content}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/20`}>
                        {getDifficultyText(currentTip?.difficulty || 'beginner')}
                      </span>
                      <span className="text-xs opacity-75">
                        {currentTipIndex + 1} / {filteredTips.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                aria-label="next" 
                onClick={() => setCurrentTipIndex((i) => (i + 1) % filteredTips.length)} 
                className="p-4 rounded-xl bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-700 dark:to-gray-700 hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                {isRtl ? <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" /> : <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {filteredTips.slice(0, 10).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTipIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentTipIndex 
                        ? 'bg-green-500 scale-125' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tips Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTips.map((tip) => (
              <div
                key={tip.id}
                className="group bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-105 will-change-transform"
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
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center mb-4">
                    <div className={`bg-gradient-to-r ${getDifficultyColor(tip.difficulty)} p-3 rounded-xl mr-3 rtl:mr-0 rtl:ml-3 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <LightbulbIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {tip.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(tip.difficulty)} text-white`}>
                        {getDifficultyText(tip.difficulty)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-6 pb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                    {tip.content}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(tip.createdAt).toLocaleDateString()}
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

                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white group/btn">
                    <span className="mr-2 rtl:mr-0 rtl:ml-2">
                      {language === "ar" ? "اقرأ المزيد" : "Read More"}
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
        )}

        {!loading && filteredTips.length === 0 && (
          <div className="text-center py-12">
            <LightbulbIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {language === "ar" ? "لا توجد نصائح" : "No tips found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {language === "ar" ? "جرب البحث بكلمات مختلفة" : "Try searching with different keywords"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
