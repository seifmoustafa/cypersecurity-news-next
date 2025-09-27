"use client"

import { useLanguage } from "@/components/language-provider"
import { 
  Video, 
  GraduationCap, 
  Presentation, 
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import Breadcrumbs from "@/components/breadcrumbs"
import { useVideoCategories } from "@/core/hooks/use-video-categories"
import { useLectureCategories } from "@/core/hooks/use-lecture-categories"
import { usePresentationCategories } from "@/core/hooks/use-presentation-categories"

export default function EducationalLessonsPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"

  // Fetch categories for each type
  const { categories: videoCategories } = useVideoCategories(1, 2)
  const { categories: lectureCategories } = useLectureCategories(1, 2)
  const { categories: presentationCategories } = usePresentationCategories(1, 2)

  const lessonCategories = [
    {
      id: "videos",
      title: language === "ar" ? "الفيديوهات التعليمية" : "Educational Videos",
      description: language === "ar" ? "فيديوهات تفاعلية لتعلم أساسيات الأمن السيبراني" : "Interactive videos to learn cybersecurity fundamentals",
      icon: Video,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      href: "/simple/media/lessons/videos",
      imagePath: "/images/beginners/Gemini_Generated_Image_c7ds1sc7ds1sc7ds.png",
      items: videoCategories.slice(0, 2).map(category => ({
        title: language === "ar" ? category.name : category.nameEn || category.name,
        href: `/simple/media/lessons/videos/${category.id}`,
        icon: Video,
      })).concat([
        {
          title: language === "ar" ? "عرض المزيد" : "Show More",
          href: "/simple/media/lessons/videos",
          icon: ArrowRight,
        }
      ])
    },
    {
      id: "lectures",
      title: language === "ar" ? "المحاضرات المتخصصة" : "Specialized Lectures",
      description: language === "ar" ? "محاضرات مفصلة من خبراء الأمن السيبراني" : "Detailed lectures from cybersecurity experts",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      href: "/simple/media/lessons/lectures",
      imagePath: "/images/beginners/Gemini_Generated_Image_2q2d7n2q2d7n2q2d.png",
      items: lectureCategories.slice(0, 2).map(category => ({
        title: language === "ar" ? category.name : category.nameEn || category.name,
        href: `/simple/media/lessons/lectures/${category.id}`,
        icon: GraduationCap,
      })).concat([
        {
          title: language === "ar" ? "عرض المزيد" : "Show More",
          href: "/simple/media/lessons/lectures",
          icon: ArrowRight,
        }
      ])
    },
    {
      id: "presentations",
      title: language === "ar" ? "العروض التفاعلية" : "Interactive Presentations",
      description: language === "ar" ? "عروض تقديمية تفاعلية مع أمثلة عملية" : "Interactive presentations with practical examples",
      icon: Presentation,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      href: "/simple/media/lessons/presentations",
      imagePath: "/images/beginners/Gemini_Generated_Image_ut3c4xut3c4xut3c.png",
      items: presentationCategories.slice(0, 2).map(category => ({
        title: language === "ar" ? category.name : category.nameEn || category.name,
        href: `/simple/media/lessons/presentations/${category.id}`,
        icon: Presentation,
      })).concat([
        {
          title: language === "ar" ? "عرض المزيد" : "Show More",
          href: "/simple/media/lessons/presentations",
          icon: ArrowRight,
        }
      ])
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
            { label: language === "ar" ? "المكتبة الثقافية" : "Media Library", href: "/simple/media" },
            { label: language === "ar" ? "دروس تعليمية" : "Educational Lessons" }
          ]} 
        />

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {language === "ar" ? "دروس تعليمية" : "Educational Lessons"}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === "ar" 
              ? "اكتشف مجموعة شاملة من الدروس التعليمية التفاعلية لتعلم أساسيات الأمن السيبراني" 
              : "Discover a comprehensive collection of interactive educational lessons to learn cybersecurity fundamentals"
            }
          </p>
        </div>

        {/* Lesson Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {lessonCategories.map((category, index) => {
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
                      {category.items?.map((item, itemIndex) => (
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
                      ))}
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
