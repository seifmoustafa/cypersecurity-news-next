"use client";

import { useLanguage } from "@/components/language-provider";
import {
  Map,
  Home,
  Video,
  BookOpen,
  ShieldCheck,
  Search,
  FileText,
  GraduationCap,
  Eye,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  CheckCircle,
  Target,
  Layers,
  Grid3X3,
  Zap,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BeginnersSitemapPage() {
  const { language, t } = useLanguage();
  const isRtl = language === "ar";
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sitemapData = [
    {
      id: "main",
      title: language === "ar" ? "الصفحة الرئيسية" : "Home",
      icon: Home,
      color: "from-green-500 to-emerald-600",
      bgColor:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      href: "/simple",
      description:
        language === "ar" ? "الصفحة الرئيسية للموقع" : "Main website page",
      children: [],
    },
    {
      id: "definitions",
      title: language === "ar" ? "المفاهيم" : "Definitions",
      icon: BookOpen,
      color: "from-indigo-500 to-purple-600",
      bgColor:
        "from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      href: "/simple/definitions-categories",
      description:
        language === "ar"
          ? "قاموس المصطلحات الأمنية"
          : "Cybersecurity terms dictionary",
      children: [
        {
          id: "categories",
          title: language === "ar" ? "فئات التعريفات" : "Definition Categories",
          icon: Target,
          href: "/simple/definitions-categories",
          description:
            language === "ar"
              ? "تصنيفات منظمة للمصطلحات"
              : "Organized term categories",
        },
      ],
    },
    {
      id: "awareness",
      title: language === "ar" ? "التوعية" : "Awareness",
      icon: Eye,
      color: "from-yellow-500 to-amber-600",
      bgColor:
        "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      href: "/simple/awareness",
      description:
        language === "ar"
          ? "الأخبار ونشرات التوعية"
          : "News and awareness bulletins",
      children: [
        {
          id: "news",
          title: language === "ar" ? "الأخبار" : "News",
          icon: CheckCircle,
          href: "/simple/news-categories",
          description:
            language === "ar" ? "أخبار الأمن السيبراني" : "Cybersecurity news",
        },
        {
          id: "awareness-bulletins",
          title: language === "ar" ? "نشرات التوعية" : "Awareness",
          icon: Eye,
          href: "/simple/awareness-years",
          description:
            language === "ar"
              ? "نشرات توعية مبسطة"
              : "Simplified awareness bulletins",
        },
      ],
    },
    {
      id: "personal-protect",
      title: language === "ar" ? "الحماية الشخصية" : "Personal Protection",
      icon: ShieldCheck,
      color: "from-amber-500 to-orange-600",
      bgColor:
        "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      href: "/simple/personal-protect",
      description:
        language === "ar"
          ? "فئات الحماية الشخصية"
          : "Personal protection categories",
      children: [
        {
          id: "categories",
          title: language === "ar" ? "فئات الحماية" : "Protection Categories",
          icon: ShieldCheck,
          href: "/simple/personal-protect",
          description:
            language === "ar"
              ? "فئات الحماية الشخصية"
              : "Personal protection categories",
        },
      ],
    },
    {
      id: "media",
      title: language === "ar" ? "المكتبة الثقافية" : "Media",
      icon: Video,
      color: "from-emerald-500 to-teal-600",
      bgColor:
        "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      href: "/simple/media",
      description:
        language === "ar"
          ? "مكتبة الوسائط التعليمية"
          : "Educational media library",
      children: [
        {
          id: "lessons",
          title: language === "ar" ? "دروس تعليمية" : "Educational Lessons",
          icon: GraduationCap,
          href: "/simple/media/lessons",
          description:
            language === "ar" ? "دروس تفاعلية" : "Interactive lessons",
        },
        {
          id: "articles",
          title: language === "ar" ? "مقالات" : "Articles",
          icon: FileText,
          href: "/simple/media/articles",
          description:
            language === "ar" ? "مقالات متخصصة" : "Specialized articles",
        },
        {
          id: "references",
          title: language === "ar" ? "مراجع" : "References",
          icon: BookOpen,
          href: "/simple/media/references",
          description:
            language === "ar" ? "مراجع وموارد" : "References and resources",
        },
      ],
    },
    {
      id: "search",
      title: language === "ar" ? "البحث" : "Search",
      icon: Search,
      color: "from-orange-500 to-red-600",
      bgColor:
        "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      href: "/simple/search",
      description: language === "ar" ? "البحث المتقدم" : "Advanced search",
      children: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.2),transparent_50%)] animate-pulse"></div>
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.2),transparent_50%)] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.2),transparent_50%)] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Compact Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
                <Map className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            {language === "ar" ? "خريطة الموقع" : "Site Map"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === "ar"
              ? "استكشف جميع أقسام الموقع بسهولة"
              : "Explore all site sections easily"}
          </p>
        </div>

        {/* Interactive Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sitemapData.map((section) => {
            const IconComponent = section.icon;
            const isExpanded = expandedSections.includes(section.id);
            const hasChildren = section.children && section.children.length > 0;
            const isHovered = hoveredCard === section.id;

            return (
              <div key={section.id} className="group">
                {/* Main Section Card */}
                <div
                  className={`relative bg-gradient-to-br ${section.bgColor} backdrop-blur-sm border-2 ${section.borderColor} rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer transform hover:scale-105`}
                  onMouseEnter={() => setHoveredCard(section.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() =>
                    hasChildren
                      ? toggleSection(section.id)
                      : (window.location.href = section.href)
                  }
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative p-6">
                    {/* Icon and Title */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`bg-gradient-to-r ${
                          section.color
                        } p-3 rounded-xl shadow-lg transform transition-transform duration-300 ${
                          isHovered ? "scale-110 rotate-3" : ""
                        }`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      {hasChildren && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(section.id);
                          }}
                          className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors duration-300"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          ) : isRtl ? (
                            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {section.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={section.href}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
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

                      {hasChildren && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-white/10 px-2 py-1 rounded-full">
                          {section.children.length}{" "}
                          {language === "ar" ? "أقسام" : "sections"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Children Cards */}
                {hasChildren && isExpanded && (
                  <div className="mt-4 space-y-3">
                    {section.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <div key={child.id} className="group/child">
                          <Link
                            href={child.href}
                            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            <div className="flex items-center">
                              <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-2 rounded-lg mr-3 rtl:mr-0 rtl:ml-3 group-hover/child:from-green-500 group-hover/child:to-blue-500 transition-all duration-300">
                                <ChildIcon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white group-hover/child:text-green-600 dark:group-hover/child:text-green-400 transition-colors duration-300">
                                  {child.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                  {child.description}
                                </p>
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover/child:text-green-500 transition-colors duration-300" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
