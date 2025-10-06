"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  Send,
  Lightbulb,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import SimpleTipsTicker from "@/components/layouts/simple-tips-ticker";
import SimpleTipOfTheDayPopup from "@/components/simple-tip-of-the-day-popup";
import { useDefinitionCategories } from "@/core/hooks/use-definition-categories";
import { usePersonalProtectCategories } from "@/core/hooks/use-personal-protect-categories";

export default function BeginnersHome() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const isRtl = language === "ar";

  // Fetch definition categories
  const { categories: definitionCategories, loading: definitionsLoading } =
    useDefinitionCategories(1, 100);

  // Fetch personal protect categories
  const {
    categories: personalProtectCategories,
    loading: personalProtectLoading,
  } = usePersonalProtectCategories("", 1, 100);

  useEffect(() => {
    router.prefetch("/simple/videos");
    router.prefetch("/simple/definitions-categories");
    router.prefetch("/simple/personal-protect");
  }, [router]);

  const mainCards = [
    {
      id: "media",
      title: t("beginners.cards.media.title"),
      description: t("beginners.cards.media.description"),
      icon: Video,
      color: "from-teal-500 to-blue-600",
      bgColor:
        "bg-gradient-to-br from-teal-50/80 to-blue-50/60 dark:from-teal-900/30 dark:to-blue-900/20",
      borderColor: "border-teal-300/60 dark:border-teal-600/40",
      href: "/simple/media",
      items: [
        {
          title: language === "ar" ? "دروس تعليمية" : "Educational Lessons",
          href: "/simple/media/lessons",
          icon: GraduationCap,
          count: "",
        },
        {
          title: language === "ar" ? "مقالات" : "Articles",
          href: "/simple/media/articles",
          icon: FileText,
          count: "",
        },
        {
          title: language === "ar" ? "مراجع" : "References",
          href: "/simple/media/references",
          icon: BookOpen,
          count: "",
        },
      ],
    },
    {
      id: "personal-protect",
      title: t("beginners.cards.personalProtect.title"),
      description: t("beginners.cards.personalProtect.description"),
      icon: ShieldCheck,
      color: "from-cyan-500 to-blue-600",
      bgColor:
        "bg-gradient-to-br from-cyan-50/80 to-blue-50/60 dark:from-cyan-900/30 dark:to-blue-900/20",
      borderColor: "border-cyan-300/60 dark:border-cyan-600/40",
      href: "/simple/personal-protect",
      items: [
        {
          title: t("beginners.cards.personalProtect.tips"),
          href: "/simple/personal-protect",
          icon: ShieldCheck,
          count: "",
        },
        {
          title: t("beginners.cards.personalProtect.tools"),
          href: "/simple/personal-protect/tools",
          icon: Settings,
          count: "",
        },
      ],
    },
    {
      id: "awareness",
      title: language === "ar" ? "التوعية" : "Awareness",
      description:
        language === "ar"
          ? "الأخبار نشرات التوعية المبسطة"
          : "News and awareness bulletins",
      icon: Lightbulb,
      color: "from-sky-400 to-blue-500",
      bgColor:
        "bg-gradient-to-br from-sky-50/80 to-blue-50/60 dark:from-sky-900/30 dark:to-blue-900/20",
      borderColor: "border-sky-300/60 dark:border-sky-600/40",
      href: "/simple/awareness",
      items: [
        {
          title: language === "ar" ? "الأخبار" : "News",
          href: "/simple/news-categories",
          icon: Newspaper,
          count: "",
        },
        {
          title: language === "ar" ? "نشرات التوعية" : "Awareness",
          href: "/simple/awareness-years",
          icon: Lightbulb,
          count: "",
        },
      ],
    },

    {
      id: "definitions",
      title: t("beginners.cards.definitions.title"),
      description: t("beginners.cards.definitions.description"),
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor:
        "bg-gradient-to-br from-blue-50/80 to-blue-50/60 dark:from-blue-900/30 dark:to-blue-900/20",
      borderColor: "border-blue-300/60 dark:border-blue-600/40",
      href: "/simple/definitions-categories",
      items: definitionCategories
        .slice(0, 2)
        .map((category) => ({
          title:
            language === "ar"
              ? category.name
              : category.nameEn || category.name,
          href: `/simple/definitions-categories/${category.id}`,
          icon: BookOpen,
          count: "",
          imageUrl: null, // Don't show images in main page
        }))
        .concat([
          {
            title:
              language === "ar"
                ? "عرض المزيد من الفئات"
                : "View More Categories",
            href: "/simple/definitions-categories",
            icon: ArrowRight,
            count: "",
            imageUrl: null,
          },
        ]),
    },

    // {
    //   id: "media1",
    //   title: t("beginners.cards.media.title"),
    //   description: t("beginners.cards.media.description"),
    //   icon: Video,
    //   color: "from-emerald-500 to-teal-600",
    //   bgColor:
    //     "bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/30 dark:to-teal-900/20",
    //   borderColor: "border-emerald-300/60 dark:border-emerald-600/40",
    //   href: "/simple/media",
    //   items: [
    //     {
    //       title: language === "ar" ? "دروس تعليمية" : "Educational Lessons",
    //       href: "/simple/media/lessons",
    //       icon: GraduationCap,
    //       count: "",
    //     },
    //     {
    //       title: language === "ar" ? "مقالات" : "Articles",
    //       href: "/simple/media/articles",
    //       icon: FileText,
    //       count: "",
    //     },
    //     {
    //       title: language === "ar" ? "مراجع" : "References",
    //       href: "/simple/media/references",
    //       icon: BookOpen,
    //       count: "",
    //     },
    //   ],
    // },
    // {
    //   id: "definitions1",
    //   title: t("beginners.cards.definitions.title"),
    //   description: t("beginners.cards.definitions.description"),
    //   icon: BookOpen,
    //   color: "from-indigo-500 to-purple-600",
    //   bgColor:
    //     "bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-900/30 dark:to-purple-900/20",
    //   borderColor: "border-indigo-300/60 dark:border-indigo-600/40",
    //   href: "/simple/definitions-categories",
    //   items: definitionCategories.slice(0, 2).map(category => ({
    //     title: language === "ar" ? category.name : category.nameEn || category.name,
    //     href: `/simple/definitions-categories/${category.id}`,
    //     icon: BookOpen,
    //     count: "",
    //     imageUrl: null // Don't show images in main page
    //   })).concat([
    //     {
    //       title: language === "ar" ? "عرض المزيد من الفئات" : "View More Categories",
    //       href: "/simple/definitions-categories",
    //       icon: ArrowRight,
    //       count: "",
    //       imageUrl: null
    //     }
    //   ]),
    // },
    // {
    //   id: "personal-protect1",
    //   title: t("beginners.cards.personalProtect.title"),
    //   description: t("beginners.cards.personalProtect.description"),
    //   icon: ShieldCheck,
    //   color: "from-amber-500 to-orange-600",
    //   bgColor:
    //     "bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-900/30 dark:to-orange-900/20",
    //   borderColor: "border-amber-300/60 dark:border-amber-600/40",
    //   href: "/simple/personal-protect",
    //   items: [
    //     {
    //       title: t("beginners.cards.personalProtect.tips"),
    //       href: "/simple/personal-protect",
    //       icon: ShieldCheck,
    //       count: "",
    //     },
    //     {
    //       title: t("beginners.cards.personalProtect.tools"),
    //       href: "/simple/personal-protect/tools",
    //       icon: Settings,
    //       count: "",
    //     },
    //   ],
    // },
    // {
    //   id: "media2",
    //   title: t("beginners.cards.media.title"),
    //   description: t("beginners.cards.media.description"),
    //   icon: Video,
    //   color: "from-emerald-500 to-teal-600",
    //   bgColor:
    //     "bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/30 dark:to-teal-900/20",
    //   borderColor: "border-emerald-300/60 dark:border-emerald-600/40",
    //   href: "/simple/media",
    //   items: [
    //     {
    //       title: language === "ar" ? "دروس تعليمية" : "Educational Lessons",
    //       href: "/simple/media/lessons",
    //       icon: GraduationCap,
    //       count: "",
    //     },
    //     {
    //       title: language === "ar" ? "مقالات" : "Articles",
    //       href: "/simple/media/articles",
    //       icon: FileText,
    //       count: "",
    //     },
    //     {
    //       title: language === "ar" ? "مراجع" : "References",
    //       href: "/simple/media/references",
    //       icon: BookOpen,
    //       count: "",
    //     },
    //   ],
    // },
    // {
    //   id: "definitions2",
    //   title: t("beginners.cards.definitions.title"),
    //   description: t("beginners.cards.definitions.description"),
    //   icon: BookOpen,
    //   color: "from-indigo-500 to-purple-600",
    //   bgColor:
    //     "bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-900/30 dark:to-purple-900/20",
    //   borderColor: "border-indigo-300/60 dark:border-indigo-600/40",
    //   href: "/simple/definitions-categories",
    //   items: definitionCategories.slice(0, 2).map(category => ({
    //     title: language === "ar" ? category.name : category.nameEn || category.name,
    //     href: `/simple/definitions-categories/${category.id}`,
    //     icon: BookOpen,
    //     count: "",
    //     imageUrl: null // Don't show images in main page
    //   })).concat([
    //     {
    //       title: language === "ar" ? "عرض المزيد من الفئات" : "View More Categories",
    //       href: "/simple/definitions-categories",
    //       icon: ArrowRight,
    //       count: "",
    //       imageUrl: null
    //     }
    //   ]),
    // },
    // {
    //   id: "personal-protect2",
    //   title: t("beginners.cards.personalProtect.title"),
    //   description: t("beginners.cards.personalProtect.description"),
    //   icon: ShieldCheck,
    //   color: "from-amber-500 to-orange-600",
    //   bgColor:
    //     "bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-900/30 dark:to-orange-900/20",
    //   borderColor: "border-amber-300/60 dark:border-amber-600/40",
    //   href: "/simple/personal-protect",
    //   items: [
    //     {
    //       title: t("beginners.cards.personalProtect.tips"),
    //       href: "/simple/personal-protect",
    //       icon: ShieldCheck,
    //       count: "",
    //     },
    //     {
    //       title: t("beginners.cards.personalProtect.tools"),
    //       href: "/simple/personal-protect/tools",
    //       icon: Settings,
    //       count: "",
    //     },
    //   ],
    // },
    // {
    //   id: "media3",
    //   title: t("beginners.cards.media.title"),
    //   description: t("beginners.cards.media.description"),
    //   icon: Video,
    //   color: "from-emerald-500 to-teal-600",
    //   bgColor:
    //     "bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/30 dark:to-teal-900/20",
    //   borderColor: "border-emerald-300/60 dark:border-emerald-600/40",
    //   href: "/simple/media",
    //   items: [
    //     {
    //       title: language === "ar" ? "دروس تعليمية" : "Educational Lessons",
    //       href: "/simple/media/lessons",
    //       icon: GraduationCap,
    //       count: "",
    //     },
    //     {
    //       title: language === "ar" ? "مقالات" : "Articles",
    //       href: "/simple/media/articles",
    //       icon: FileText,
    //       count: "",
    //     },
    //     {
    //       title: language === "ar" ? "مراجع" : "References",
    //       href: "/simple/media/references",
    //       icon: BookOpen,
    //       count: "",
    //     },
    //   ],
    // },
    // {
    //   id: "definitions3",
    //   title: t("beginners.cards.definitions.title"),
    //   description: t("beginners.cards.definitions.description"),
    //   icon: BookOpen,
    //   color: "from-indigo-500 to-purple-600",
    //   bgColor:
    //     "bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-900/30 dark:to-purple-900/20",
    //   borderColor: "border-indigo-300/60 dark:border-indigo-600/40",
    //   href: "/simple/definitions-categories",
    //   items: definitionCategories.slice(0, 2).map(category => ({
    //     title: language === "ar" ? category.name : category.nameEn || category.name,
    //     href: `/simple/definitions-categories/${category.id}`,
    //     icon: BookOpen,
    //     count: "",
    //     imageUrl: null // Don't show images in main page
    //   })).concat([
    //     {
    //       title: language === "ar" ? "عرض المزيد من الفئات" : "View More Categories",
    //       href: "/simple/definitions-categories",
    //       icon: ArrowRight,
    //       count: "",
    //       imageUrl: null
    //     }
    //   ]),
    // },
    // {
    //   id: "personal-protect3",
    //   title: t("beginners.cards.personalProtect.title"),
    //   description: t("beginners.cards.personalProtect.description"),
    //   icon: ShieldCheck,
    //   color: "from-amber-500 to-orange-600",
    //   bgColor:
    //     "bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-900/30 dark:to-orange-900/20",
    //   borderColor: "border-amber-300/60 dark:border-amber-600/40",
    //   href: "/simple/personal-protect",
    //   items: [
    //     {
    //       title: t("beginners.cards.personalProtect.tips"),
    //       href: "/simple/personal-protect",
    //       icon: ShieldCheck,
    //       count: "",
    //     },
    //     {
    //       title: t("beginners.cards.personalProtect.tools"),
    //       href: "/simple/personal-protect/tools",
    //       icon: Settings,
    //       count: "",
    //     },
    //   ],
    // },
  ];

  return (
    <>
      <SimpleTipsTicker />
      <SimpleTipOfTheDayPopup />

      {/* GIF-Focused Interactive Section */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Subtle Background Animation */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.1),transparent_50%)] animate-pulse"></div>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
          {/* Main Interactive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {mainCards.map((card, index) => {
              const gifPath =
                card.id === "media"
                  ? "/assets/images/beginners/Gemini_Generated_Image_izzu99izzu99izzu.png"
                  : card.id === "definitions"
                  ? "/assets/images/beginners/Gemini_Generated_Image_dudzufdudzufdudz.png"
                  : card.id === "personal-protect"
                  ? "/assets/images/beginners/Gemini_Generated_Image_70kvgb70kvgb70kv.png"
                  : card.id === "awareness"
                  ? "/assets/images/beginners/Gemini_Generated_Image_ut3c4xut3c4xut3c.png"
                  : card.id === "definitions1"
                  ? "/assets/images/beginners/Gemini_Generated_Image_ut3c4xut3c4xut3c.png"
                  : card.id === "personal-protect1"
                  ? "/assets/images/beginners/Gemini_Generated_Image_70kvgb70kvgb70kv.png"
                  : card.id === "media2"
                  ? "/assets/images/beginners/Gemini_Generated_Image_scvpqscvpqscvpqs.png"
                  : card.id === "definitions2"
                  ? "/assets/images/beginners/Gemini_Generated_Image_pjw9t4pjw9t4pjw9.png"
                  : card.id === "personal-protect2"
                  ? "/assets/images/beginners/Gemini_Generated_Image_im25tyim25tyim25.png"
                  : card.id === "media3"
                  ? "/assets/images/beginners/Gemini_Generated_Image_loa5htloa5htloa5.png"
                  : card.id === "definitions3"
                  ? "/assets/images/beginners/Gemini_Generated_Image_izzu99izzu99izzu.png"
                  : card.id === "personal-protect3"
                  ? "/assets/images/beginners/Gemini_Generated_Image_izwtzfizwtzfizwt.png"
                  : "/assets/images/beginners/Gemini_Generated_Image_70kvgb70kvgb70kv.png";

              return (
                <div
                  key={card.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(card.href)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(card.href);
                    }
                  }}
                  className="group h-full block"
                >
                  <div
                    className={`relative ${card.bgColor} backdrop-blur-sm border-2 ${card.borderColor} rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 h-full flex flex-col cursor-pointer`}
                    onMouseMove={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      const rect = el.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const rotateX =
                        ((y - rect.height / 2) / rect.height) * -5;
                      const rotateY = ((x - rect.width / 2) / rect.width) * 5;
                      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform =
                        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
                    }}
                    style={{ transform: "perspective(1000px)" }}
                  >
                    {/* GIF Hero Section - Optimized for Full Display */}
                    <div className="relative h-80 overflow-hidden flex-shrink-0">
                      <img
                        src={gifPath}
                        alt={`${card.title} animation`}
                        className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:from-black/60 dark:via-transparent dark:to-transparent"></div>
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
                        {card.id === "personal-protect" ? (
                          // Show actual personal protect categories
                          <>
                            {personalProtectLoading ? (
                              // Loading state
                              <>
                                {[...Array(2)].map((_, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10 animate-pulse"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                    <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                  </div>
                                ))}
                              </>
                            ) : personalProtectCategories.length > 0 ? (
                              // Show actual categories
                              personalProtectCategories
                                .slice(0, 2)
                                .map((category, categoryIndex) => (
                                  <Link
                                    key={category.id}
                                    href={`/simple/personal-protect/${category.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group/item border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <span className="text-gray-700 dark:text-white text-sm font-medium group-hover/item:text-amber-700 dark:group-hover/item:text-amber-400 transition-colors duration-300 line-clamp-1">
                                        {language === "ar"
                                          ? category.name
                                          : category.nameEn || category.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      {isRtl ? (
                                        <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors duration-300" />
                                      ) : (
                                        <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors duration-300" />
                                      )}
                                    </div>
                                  </Link>
                                ))
                            ) : (
                              // Empty state - show placeholder items
                              <></>
                            )}
                            <Link
                              href="/simple/personal-protect"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-between p-3 bg-amber-500/20 dark:bg-amber-500/10 hover:bg-amber-500/30 dark:hover:bg-amber-500/20 rounded-lg transition-all duration-300 group/item border border-amber-500/30 dark:border-amber-500/20 hover:border-amber-500/50 dark:hover:border-amber-500/30"
                            >
                              <span className="text-amber-700 dark:text-amber-400 text-sm font-medium group-hover/item:text-amber-800 dark:group-hover/item:text-amber-300 transition-colors duration-300">
                                {language === "ar"
                                  ? "عرض المزيد من الفئات"
                                  : "View More"}
                              </span>
                              <div className="flex items-center">
                                {isRtl ? (
                                  <ArrowLeft className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover/item:text-amber-700 dark:group-hover/item:text-amber-300 transition-colors duration-300" />
                                ) : (
                                  <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover/item:text-amber-700 dark:group-hover/item:text-amber-300 transition-colors duration-300" />
                                )}
                              </div>
                            </Link>
                          </>
                        ) : (
                          // Show regular items for other cards
                          card.items.map((item, itemIndex) => (
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
                                {item.count && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 bg-white/60 dark:bg-white/10 px-2 py-1 rounded-full group-hover/item:bg-green-200 dark:group-hover/item:bg-green-800 group-hover/item:text-green-700 dark:group-hover/item:text-green-200 transition-colors duration-300">
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
                          ))
                        )}
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
                localStorage.setItem("beginnersMode", "false");
                window.location.href = "/advanced";
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
  );
}
