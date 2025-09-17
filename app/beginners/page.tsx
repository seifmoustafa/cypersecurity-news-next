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
  ArrowLeft
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
    }
  ]


  return (
    <>
      <BeginnersTipsTicker />
      <BeginnersTipOfTheDayPopup />
      
      {/* Compact Hero + Cards above the fold */}
      <div className="relative overflow-hidden mt-6">
        {/* Cybersecurity Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-10 pb-6">
          {/* Compact heading so the grid is visible immediately */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Shield className="h-12 w-12 text-white" />
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 mb-3">
              {t("beginners.hero.title")}
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("beginners.hero.subtitle")}
            </p>
            
          </div>


          {/* Main Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {mainCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div key={card.id} className="group">
                  <div
                    className={`${card.bgColor} p-6 md:p-8 rounded-3xl border-2 ${card.borderColor} transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 h-full will-change-transform`}
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
                      <div className={`bg-gradient-to-r ${card.color} p-4 rounded-2xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Items */}
                    <div className="space-y-3 mb-6">
                      {card.items.map((item, itemIndex) => {
                        const ItemIcon = item.icon;
                        return (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group/item border border-slate-200 dark:border-slate-700 hover:border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500"
                          >
                            <div className="flex items-center">
                              <ItemIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3 rtl:mr-0 rtl:ml-3 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/item:text-green-700 dark:group-hover/item:text-green-300 transition-colors duration-300">
                                {item.title}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 rtl:mr-0 rtl:ml-2">
                                {item.count}
                              </span>
                              {isRtl ? (
                                <ArrowLeft className="h-4 w-4 text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
                              ) : (
                                <ArrowRight className="h-4 w-4 text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Card Footer */}
                    <Link
                      href={card.href}
                      className={`inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r ${card.color} text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-green-400`}
                    >
                      <span className="mr-2 rtl:mr-0 rtl:ml-2">
                        {language === "ar" ? "استكشف الآن" : "Explore Now"}
                      </span>
                      {isRtl ? (
                        <ArrowLeft className="h-5 w-5 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                      ) : (
                        <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {t("beginners.cta.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t("beginners.cta.description")}
              </p>
              <button
                onClick={() => {
                  localStorage.setItem("beginnersMode", "false")
                  window.location.href = "/"
                }}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {t("beginners.cta.button")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}