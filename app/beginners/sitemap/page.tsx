"use client"

import { useLanguage } from "@/components/language-provider"
import { 
  Map, 
  Home, 
  Video, 
  BookOpen, 
  ShieldCheck,
  Search,
  Users,
  Settings,
  FileText,
  Play,
  GraduationCap,
  Presentation,
  Lock,
  Eye,
  AlertTriangle,
  Zap,
  Target,
  Key,
  Database,
  Network,
  Server,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function BeginnersSitemapPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const sitemapData = [
    {
      id: "main",
      title: language === "ar" ? "الصفحة الرئيسية" : "Home",
      icon: Home,
      color: "from-green-500 to-emerald-600",
      href: "/beginners",
      description: language === "ar" ? "الصفحة الرئيسية للمبتدئين" : "Main page for beginners"
    },
    {
      id: "media",
      title: language === "ar" ? "الوسائط التعليمية" : "Educational Media",
      icon: Video,
      color: "from-red-500 to-pink-600",
      href: "/beginners/media",
      description: language === "ar" ? "مكتبة الوسائط التعليمية" : "Educational media library",
      children: [
        {
          id: "videos",
          title: language === "ar" ? "الفيديوهات" : "Videos",
          icon: Play,
          href: "/beginners/videos",
          description: language === "ar" ? "فيديوهات تعليمية تفاعلية" : "Interactive educational videos"
        },
        {
          id: "lectures",
          title: language === "ar" ? "المحاضرات" : "Lectures",
          icon: GraduationCap,
          href: "/beginners/lectures",
          description: language === "ar" ? "محاضرات متخصصة" : "Specialized lectures"
        },
        {
          id: "presentations",
          title: language === "ar" ? "العروض التقديمية" : "Presentations",
          icon: Presentation,
          href: "/beginners/presentations",
          description: language === "ar" ? "عروض تفاعلية" : "Interactive presentations"
        }
      ]
    },
    {
      id: "definitions",
      title: language === "ar" ? "التعريفات" : "Definitions",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-600",
      href: "/beginners/definitions",
      description: language === "ar" ? "قاموس المصطلحات" : "Terms dictionary",
      children: [
        {
          id: "terms",
          title: language === "ar" ? "المصطلحات الأساسية" : "Basic Terms",
          icon: FileText,
          href: "/beginners/definitions",
          description: language === "ar" ? "مصطلحات الأمن السيبراني" : "Cybersecurity terms"
        },
        {
          id: "categories",
          title: language === "ar" ? "التصنيفات" : "Categories",
          icon: Target,
          href: "/beginners/definitions/categories",
          description: language === "ar" ? "تصنيفات منظمة" : "Organized categories"
        }
      ]
    },
    {
      id: "personal-protect",
      title: language === "ar" ? "الحماية الشخصية" : "Personal Protection",
      icon: ShieldCheck,
      color: "from-purple-500 to-indigo-600",
      href: "/beginners/personal-protect",
      description: language === "ar" ? "أدوات الحماية الشخصية" : "Personal protection tools",
      children: [
        {
          id: "tips",
          title: language === "ar" ? "نصائح الأمان" : "Safety Tips",
          icon: ShieldCheck,
          href: "/beginners/personal-protect",
          description: language === "ar" ? "نصائح أمنية يومية" : "Daily security tips"
        },
        {
          id: "tools",
          title: language === "ar" ? "أدوات الحماية" : "Protection Tools",
          icon: Settings,
          href: "/beginners/personal-protect/tools",
          description: language === "ar" ? "أدوات حماية متقدمة" : "Advanced protection tools"
        },
        {
          id: "procedures",
          title: language === "ar" ? "الإجراءات" : "Procedures",
          icon: AlertTriangle,
          href: "/beginners/procedures",
          description: language === "ar" ? "إجراءات الطوارئ" : "Emergency procedures"
        }
      ]
    },
    {
      id: "search",
      title: language === "ar" ? "البحث" : "Search",
      icon: Search,
      color: "from-orange-500 to-red-600",
      href: "/beginners/search",
      description: language === "ar" ? "البحث المتقدم" : "Advanced search"
    },
    {
      id: "sitemap",
      title: language === "ar" ? "خريطة الموقع" : "Site Map",
      icon: Map,
      color: "from-teal-500 to-green-600",
      href: "/beginners/sitemap",
      description: language === "ar" ? "خريطة الموقع الكاملة" : "Complete site map"
    }
  ]

  const securityTopics = [
    {
      icon: Lock,
      title: language === "ar" ? "التشفير" : "Encryption",
      description: language === "ar" ? "حماية البيانات بالتشفير" : "Data protection through encryption"
    },
    {
      icon: Eye,
      title: language === "ar" ? "المراقبة" : "Monitoring",
      description: language === "ar" ? "مراقبة الأنظمة والشبكات" : "System and network monitoring"
    },
    {
      icon: AlertTriangle,
      title: language === "ar" ? "الاستجابة للحوادث" : "Incident Response",
      description: language === "ar" ? "الاستجابة السريعة للحوادث" : "Rapid incident response"
    },
    {
      icon: Zap,
      title: language === "ar" ? "الأمان النشط" : "Active Security",
      description: language === "ar" ? "أنظمة الأمان النشطة" : "Active security systems"
    },
    {
      icon: Target,
      title: language === "ar" ? "إدارة المخاطر" : "Risk Management",
      description: language === "ar" ? "تقييم وإدارة المخاطر" : "Risk assessment and management"
    },
    {
      icon: Key,
      title: language === "ar" ? "المصادقة" : "Authentication",
      description: language === "ar" ? "أنظمة المصادقة المتقدمة" : "Advanced authentication systems"
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

      {/* Header Section */}
      <div className="relative z-10 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
                  <Map className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "ar" ? "خريطة الموقع" : "Site Map"}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {language === "ar" 
                ? "استكشف جميع أقسام وأقسام الموقع بسهولة"
                : "Explore all sections and areas of the site easily"
              }
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Main Sitemap */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {language === "ar" ? "أقسام الموقع الرئيسية" : "Main Site Sections"}
          </h2>
          
          <div className="space-y-4">
            {sitemapData.map((section) => {
              const IconComponent = section.icon
              const isExpanded = expandedSections.includes(section.id)
              const hasChildren = section.children && section.children.length > 0
              
              return (
                <div key={section.id} className="group">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-700/50 dark:to-gray-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-green-500/30 transition-all duration-300">
                    <div className="flex items-center">
                      <div className={`bg-gradient-to-r ${section.color} p-3 rounded-xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {hasChildren && (
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-300"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          )}
                        </button>
                      )}
                      <Link
                        href={section.href}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 hover:scale-105"
                      >
                        <span className="text-sm font-medium">
                          {language === "ar" ? "زيارة" : "Visit"}
                        </span>
                        {isRtl ? (
                          <ArrowLeft className="h-4 w-4" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* Children */}
                  {hasChildren && isExpanded && (
                    <div className="mt-4 ml-8 rtl:ml-0 rtl:mr-8 space-y-3">
                      {section.children.map((child) => {
                        const ChildIcon = child.icon
                        return (
                          <div key={child.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-green-500/30 transition-all duration-300">
                            <div className="flex items-center">
                              <ChildIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-3 rtl:mr-0 rtl:ml-3" />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {child.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {child.description}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={child.href}
                              className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-300"
                            >
                              <span className="text-sm">
                                {language === "ar" ? "عرض" : "View"}
                              </span>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Security Topics */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {language === "ar" ? "مواضيع الأمان الرئيسية" : "Main Security Topics"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityTopics.map((topic, index) => {
              const IconComponent = topic.icon
              return (
                <div key={index} className="group bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-700/50 dark:to-gray-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-green-500/30 transition-all duration-500 hover:scale-105 hover:shadow-lg">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl w-16 h-16 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {topic.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {language === "ar" ? "روابط سريعة" : "Quick Links"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/beginners"
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-green-500/30 transition-all duration-300 hover:scale-105 group"
            >
              <Home className="h-5 w-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "الرئيسية" : "Home"}
              </span>
            </Link>
            
            <Link
              href="/beginners/search"
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-green-500/30 transition-all duration-300 hover:scale-105 group"
            >
              <Search className="h-5 w-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "البحث" : "Search"}
              </span>
            </Link>
            
            <Link
              href="/beginners/media"
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-green-500/30 transition-all duration-300 hover:scale-105 group"
            >
              <Video className="h-5 w-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "الوسائط" : "Media"}
              </span>
            </Link>
            
            <Link
              href="/beginners/definitions"
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-green-500/30 transition-all duration-300 hover:scale-105 group"
            >
              <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "التعريفات" : "Definitions"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
