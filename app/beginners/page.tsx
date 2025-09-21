"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Video, 
  BookOpen, 
  ShieldCheck, 
  Play, 
  GraduationCap, 
  Presentation, 
  CheckCircle, 
  Settings,
  Lock,
  Eye,
  AlertTriangle,
  Zap,
  Target,
  Shield,
  Users,
  Clock,
  TrendingUp,
  Heart,
  Database,
  Network,
  Server,
  Key,
  Search,
  Map,
  ArrowRight,
  ArrowLeft,
  FileText,
  Send
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import BeginnersTipsTicker from "@/components/layouts/beginners-tips-ticker"
import BeginnersTipOfTheDayPopup from "@/components/beginners-tip-of-the-day-popup"


export default function BeginnersHome() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const isRtl = language === "ar"

  useEffect(() => {
    router.prefetch("/beginners/videos")
    router.prefetch("/beginners/definitions")
    router.prefetch("/beginners/personal-protect")
  }, [router])

  const mainCards = [
    {
      id: "media",
      title: t("beginners.cards.media.title"),
      description: t("beginners.cards.media.description"),
      icon: Video,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      href: "/beginners/media",
      items: [
        {
          title: t("beginners.cards.media.videos"),
          href: "/beginners/videos",
          icon: Play,
          count: "50+"
        },
        {
          title: t("beginners.cards.media.lectures"),
          href: "/beginners/lectures",
          icon: GraduationCap,
          count: "30+"
        },
        {
          title: t("beginners.cards.media.presentations"),
          href: "/beginners/presentations",
          icon: Presentation,
          count: "25+"
        },
        {
          title: language === "ar" ? "الأخبار" : "News",
          href: "/beginners/news",
          icon: CheckCircle,
          count: ""
        }
      ]
    },
    {
      id: "definitions",
      title: t("beginners.cards.definitions.title"),
      description: t("beginners.cards.definitions.description"),
      icon: BookOpen,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      href: "/beginners/definitions",
      items: [
        {
          title: t("beginners.cards.definitions.terms"),
          href: "/beginners/definitions",
          icon: BookOpen,
          count: "200+"
        },
        {
          title: t("beginners.cards.definitions.categories"),
          href: "/beginners/definitions/categories",
          icon: CheckCircle,
          count: "15+"
        }
      ]
    },
    {
      id: "personal-protect",
      title: t("beginners.cards.personalProtect.title"),
      description: t("beginners.cards.personalProtect.description"),
      icon: ShieldCheck,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      href: "/beginners/personal-protect",
      items: [
        {
          title: t("beginners.cards.personalProtect.tips"),
          href: "/beginners/personal-protect",
          icon: ShieldCheck,
          count: "100+"
        },
        {
          title: t("beginners.cards.personalProtect.tools"),
          href: "/beginners/personal-protect/tools",
          icon: Settings,
          count: "20+"
        }
      ]
    },
    {
      id: "incident-report",
      title: t("beginners.cards.incidentReport.title"),
      description: t("beginners.cards.incidentReport.description"),
      icon: AlertTriangle,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      href: "/beginners/incident-report",
      items: [
        {
          title: t("beginners.cards.incidentReport.reportNewIncident"),
          href: "/beginners/incident-report",
          icon: Send,
          count: ""
        }
      ]
    }
  ]


  return (
    <>
      <BeginnersTipsTicker />
      <BeginnersTipOfTheDayPopup />
      
      {/* GIF-Focused Interactive Section */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Subtle Background Animation */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.1),transparent_50%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
          {/* Main Interactive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {mainCards.map((card, index) => {
              const gifPath = card.id === 'media' ? '/images/media.gif' : 
                             card.id === 'definitions' ? '/images/definitions.gif' : 
                             card.id === 'personal-protect' ? '/images/personal_protect.gif' :
                             '/images/news-events.gif';
              
              return (
                <div key={card.id} className="group h-full">
                  <div
                    className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-2xl hover:shadow-green-500/20 h-full flex flex-col"
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
                    {/* GIF Hero Section - Optimized for Full Display */}
                    <div className="relative h-80 overflow-hidden flex-shrink-0">
                      <img 
                        src={gifPath} 
                        alt={`${card.title} animation`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:from-black/60 dark:via-transparent dark:to-transparent"></div>
                      
                      {/* Floating Action Button */}
                      <div className="absolute top-4 right-4">
                        <Link
                          href={card.href}
                          className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-white/20 backdrop-blur-md border border-white/50 dark:border-white/30 rounded-full text-gray-800 dark:text-white text-sm font-medium hover:bg-white dark:hover:bg-white/30 transition-all duration-300 shadow-lg dark:shadow-none"
                        >
                          <span className="mr-2">{language === "ar" ? "استكشف" : "Explore"}</span>
                          {isRtl ? (
                            <ArrowLeft className="h-4 w-4" />
                          ) : (
                            <ArrowRight className="h-4 w-4" />
                          )}
                        </Link>
                      </div>
                    </div>

                    {/* Content Section - Flexible Height */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-shrink-0 mb-4">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      {/* Quick Access Links - Flexible */}
                      <div className="space-y-2 flex-1 flex flex-col justify-center">
                        {card.items.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 hover:bg-green-50 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group/item border border-gray-100 dark:border-transparent hover:border-green-200 dark:hover:border-transparent"
                          >
                            <span className="text-gray-700 dark:text-white text-sm font-medium group-hover/item:text-green-700 dark:group-hover/item:text-green-400 transition-colors duration-300">
                              {item.title}
                            </span>
                            <div className="flex items-center">
                              {item.count && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-full group-hover/item:bg-green-200 dark:group-hover/item:bg-green-800 group-hover/item:text-green-700 dark:group-hover/item:text-green-200 transition-colors duration-300">
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
              );
            })}
          </div>

          {/* Bottom Navigation */}
          <div className="text-center mt-12">
            <button
              onClick={() => {
                localStorage.setItem("beginnersMode", "false")
                window.location.href = "/"
              }}
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-300 dark:border-white/20 rounded-xl text-gray-700 dark:text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-none"
            >
              <span className="mr-2">{t("beginners.cta.button")}</span>
              {isRtl ? (
                <ArrowLeft className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}