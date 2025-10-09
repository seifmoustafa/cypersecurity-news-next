"use client"

import { useLanguage } from "@/components/language-provider"
import { useVideoCategories } from "@/core/hooks/use-video-categories"
import { useHelperCategories } from "@/hooks/use-helper-categories"
import { Shield, Video, BookOpen, Calendar, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Breadcrumbs from "@/components/breadcrumbs"

export default function PersonalProtectPage() {
  const { language } = useLanguage()
  const isRtl = language === "ar"

  const { categories: videoCategories, loading: videoLoading, error: videoError } = useVideoCategories(1, 100)
  const { categories: helperCategories, loading: helperLoading, error: helperError } = useHelperCategories(1, 100)
  
  const loading = videoLoading || helperLoading
  const error = videoError || helperError

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "الحماية الشخصية" : "Personal Protection" }
            ]} 
          />

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg h-96 animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-3xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "الحماية الشخصية" : "Personal Protection" }
            ]} 
          />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل المحتوى" : "Error Loading Content"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل المحتوى. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading content. Please try again."
              }
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {language === "ar" ? "إعادة المحاولة" : "Try Again"}
            </button>
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
            { label: language === "ar" ? "الحماية الشخصية" : "Personal Protection" }
          ]} 
        />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {language === "ar" ? "الحماية الشخصية" : "Personal Protection"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {language === "ar" 
              ? "فيديوهات تعليمية وإرشادات شاملة لحماية نفسك في العالم الرقمي"
              : "Educational videos and comprehensive guides to protect yourself in the digital world"
            }
          </p>
        </div>

        {/* Personal Protect Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Videos Card */}
          <Link
            href="/simple/personal-protect/videos"
            className="group h-full block"
          >
            <div
              className="relative bg-blue-50 dark:bg-blue-900/20 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 h-full flex flex-col cursor-pointer"
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
                  src="/assets/images/beginners/Gemini_Generated_Image_c7ds1sc7ds1sc7ds.png"
                  alt="Educational Videos animation"
                  className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:from-black/60 dark:via-transparent dark:to-transparent"></div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-shrink-0 mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {language === "ar" ? "الفيديوهات التعليمية" : "Educational Videos"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {language === "ar" 
                      ? "فيديوهات تعليمية تفاعلية لتعلم أساسيات الأمن السيبراني والحماية الشخصية"
                      : "Interactive educational videos to learn cybersecurity fundamentals and personal protection"
                    }
                  </p>
                </div>

                {/* Quick Access Links */}
                <div className="space-y-2 flex-1 flex flex-col justify-start">
                  {videoCategories.map((category, categoryIndex) => (
                    <Link
                      key={`video-${category.id}`}
                      href={`/simple/personal-protect/videos/${category.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group/item border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20"
                    >
                      <span className="text-gray-700 dark:text-white text-sm font-medium group-hover/item:text-blue-700 dark:group-hover/item:text-blue-400 transition-colors duration-300">
                        {language === "ar" ? category.name : category.nameEn || category.name}
                      </span>
                      <div className="flex items-center">
                        {isRtl ? (
                          <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-300" />
                        ) : (
                          <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-300" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Link>

          {/* Helpers Card */}
          <Link
            href="/simple/personal-protect/helpers"
            className="group h-full block"
          >
            <div
              className="relative bg-green-50 dark:bg-green-900/20 backdrop-blur-sm border-2 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 h-full flex flex-col cursor-pointer"
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
                  src="/assets/images/beginners/Gemini_Generated_Image_scvpqscvpqscvpqs.png"
                  alt="Helpers animation"
                  className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:from-black/60 dark:via-transparent dark:to-transparent"></div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-shrink-0 mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {language === "ar" ? "الإرشادات" : "Helpers"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {language === "ar" 
                      ? "إرشادات وأدلة شاملة للحماية الشخصية والأمن السيبراني"
                      : "Comprehensive guides and instructions for personal protection and cybersecurity"
                    }
                  </p>
                </div>

                {/* Quick Access Links */}
                <div className="space-y-2 flex-1 flex flex-col justify-start">
                  {helperCategories.map((category, categoryIndex) => (
                    <Link
                      key={`helper-${category.id}`}
                      href={`/simple/personal-protect/helpers?category=${category.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group/item border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20"
                    >
                      <span className="text-gray-700 dark:text-white text-sm font-medium group-hover/item:text-green-700 dark:group-hover/item:text-green-400 transition-colors duration-300">
                        {language === "ar" ? category.title : category.titleEn || category.title}
                      </span>
                      <div className="flex items-center">
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
          </Link>
        </div>
      </div>
    </div>
  )
}