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

export default function BeginnersHome() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const isRtl = language === "ar";

  // Fetch definition categories
  const { categories: definitionCategories, loading: definitionsLoading } = useDefinitionCategories(1, 3);

  useEffect(() => {
    router.prefetch("/simple/videos");
    router.prefetch("/simple/advanced/definitions");
    router.prefetch("/simple/advanced/personal-protect");
  }, [router]);

  const mainCards = [
    {
      id: "media",
      title: t("beginners.cards.media.title"),
      description: t("beginners.cards.media.description"),
      icon: Video,
      color: "from-emerald-500 to-teal-600",
      bgColor:
        "bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/30 dark:to-teal-900/20",
      borderColor: "border-emerald-300/60 dark:border-emerald-600/40",
      href: "/simple/media",
      items: [
        {
          title: t("beginners.cards.media.videos"),
          href: "/simple/videos",
          icon: Play,
          count: "50+",
        },
        {
          title: t("beginners.cards.media.lectures"),
          href: "/simple/lectures",
          icon: GraduationCap,
          count: "30+",
        },
        {
          title: t("beginners.cards.media.presentations"),
          href: "/simple/presentations",
          icon: Presentation,
          count: "25+",
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
      color: "from-yellow-400 to-amber-600",
      bgColor:
        "bg-gradient-to-br from-yellow-50/80 to-amber-50/60 dark:from-yellow-900/30 dark:to-amber-900/20",
      borderColor: "border-yellow-300/60 dark:border-yellow-600/40",
      href: "/simple/awareness",
      items: [
        {
          title: language === "ar" ? "الأخبار" : "News",
          href: "/advanced/news",
          icon: Newspaper,
          count: "",
        },
        {
          title: language === "ar" ? "نشرات التوعية" : "Awareness",
          href: "/advanced/awareness",
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
      color: "from-indigo-500 to-purple-600",
      bgColor:
        "bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-900/30 dark:to-purple-900/20",
      borderColor: "border-indigo-300/60 dark:border-indigo-600/40",
      href: "/simple/definitions-categories",
      items: definitionCategories.slice(0, 2).map(category => ({
        title: language === "ar" ? category.name : category.nameEn || category.name,
        href: `/simple/definitions-categories/${category.id}`,
        icon: BookOpen,
        count: "",
        imageUrl: null // Don't show images in main page
      })).concat([
        {
          title: language === "ar" ? "عرض المزيد من الفئات" : "View More Categories",
          href: "/simple/definitions-categories",
          icon: ArrowRight,
          count: "",
          imageUrl: null
        }
      ]),
    },
    {
      id: "personal-protect",
      title: t("beginners.cards.personalProtect.title"),
      description: t("beginners.cards.personalProtect.description"),
      icon: ShieldCheck,
      color: "from-amber-500 to-orange-600",
      bgColor:
        "bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-900/30 dark:to-orange-900/20",
      borderColor: "border-amber-300/60 dark:border-amber-600/40",
      href: "/simple/advanced/personal-protect",
      items: [
        {
          title: t("beginners.cards.personalProtect.tips"),
          href: "/simple/advanced/personal-protect",
          icon: ShieldCheck,
          count: "100+",
        },
        {
          title: t("beginners.cards.personalProtect.tools"),
          href: "/simple/advanced/personal-protect/tools",
          icon: Settings,
          count: "20+",
        },
      ],
    },
    {
      id: "media1",
      title: t("beginners.cards.media.title"),
      description: t("beginners.cards.media.description"),
      icon: Video,
      color: "from-emerald-500 to-teal-600",
      bgColor:
        "bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/30 dark:to-teal-900/20",
      borderColor: "border-emerald-300/60 dark:border-emerald-600/40",
      href: "/simple/media",
      items: [
        {
          title: t("beginners.cards.media.videos"),
          href: "/simple/videos",
          icon: Play,
          count: "50+",
        },
        {
          title: t("beginners.cards.media.lectures"),
          href: "/simple/lectures",
          icon: GraduationCap,
          count: "30+",
        },
        {
          title: t("beginners.cards.media.presentations"),
          href: "/simple/presentations",
          icon: Presentation,
          count: "25+",
        },
      ],
    },
    {
      id: "definitions1",
      title: t("beginners.cards.definitions.title"),
      description: t("beginners.cards.definitions.description"),
      icon: BookOpen,
      color: "from-indigo-500 to-purple-600",
      bgColor:
        "bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-900/30 dark:to-purple-900/20",
      borderColor: "border-indigo-300/60 dark:border-indigo-600/40",
      href: "/simple/definitions-categories",
      items: definitionCategories.slice(0, 2).map(category => ({
        title: language === "ar" ? category.name : category.nameEn || category.name,
        href: `/simple/definitions-categories/${category.id}`,
        icon: BookOpen,
        count: "",
        imageUrl: null // Don't show images in main page
      })).concat([
        {
          title: language === "ar" ? "عرض المزيد من الفئات" : "View More Categories",
          href: "/simple/definitions-categories",
          icon: ArrowRight,
          count: "",
          imageUrl: null
        }
      ]),
    },
    {
      id: "personal-protect1",
      title: t("beginners.cards.personalProtect.title"),
      description: t("beginners.cards.personalProtect.description"),
      icon: ShieldCheck,
      color: "from-amber-500 to-orange-600",
      bgColor:
        "bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-900/30 dark:to-orange-900/20",
      borderColor: "border-amber-300/60 dark:border-amber-600/40",
      href: "/simple/advanced/personal-protect",
      items: [
        {
          title: t("beginners.cards.personalProtect.tips"),
          href: "/simple/advanced/personal-protect",
          icon: ShieldCheck,
          count: "100+",
        },
        {
          title: t("beginners.cards.personalProtect.tools"),
          href: "/simple/advanced/personal-protect/tools",
          icon: Settings,
          count: "20+",
        },
      ],
    },
    {
      id: "media2",
      title: t("beginners.cards.media.title"),
      description: t("beginners.cards.media.description"),
      icon: Video,
      color: "from-emerald-500 to-teal-600",
      bgColor:
        "bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/30 dark:to-teal-900/20",
      borderColor: "border-emerald-300/60 dark:border-emerald-600/40",
      href: "/simple/media",
      items: [
        {
          title: t("beginners.cards.media.videos"),
          href: "/simple/videos",
          icon: Play,
          count: "50+",
        },
        {
          title: t("beginners.cards.media.lectures"),
          href: "/simple/lectures",
          icon: GraduationCap,
          count: "30+",
        },
        {
          title: t("beginners.cards.media.presentations"),
          href: "/simple/presentations",
          icon: Presentation,
          count: "25+",
        },
      ],
    },
    {
      id: "definitions2",
      title: t("beginners.cards.definitions.title"),
      description: t("beginners.cards.definitions.description"),
      icon: BookOpen,
      color: "from-indigo-500 to-purple-600",
      bgColor:
        "bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-900/30 dark:to-purple-900/20",
      borderColor: "border-indigo-300/60 dark:border-indigo-600/40",
      href: "/simple/definitions-categories",
      items: definitionCategories.slice(0, 2).map(category => ({
        title: language === "ar" ? category.name : category.nameEn || category.name,
        href: `/simple/definitions-categories/${category.id}`,
        icon: BookOpen,
        count: "",
        imageUrl: null // Don't show images in main page
      })).concat([
        {
          title: language === "ar" ? "عرض المزيد من الفئات" : "View More Categories",
          href: "/simple/definitions-categories",
          icon: ArrowRight,
          count: "",
          imageUrl: null
        }
      ]),
    },
    {
      id: "personal-protect2",
      title: t("beginners.cards.personalProtect.title"),
      description: t("beginners.cards.personalProtect.description"),
      icon: ShieldCheck,
      color: "from-amber-500 to-orange-600",
      bgColor:
        "bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-900/30 dark:to-orange-900/20",
      borderColor: "border-amber-300/60 dark:border-amber-600/40",
      href: "/simple/advanced/personal-protect",
      items: [
        {
          title: t("beginners.cards.personalProtect.tips"),
          href: "/simple/advanced/personal-protect",
          icon: ShieldCheck,
          count: "100+",
        },
        {
          title: t("beginners.cards.personalProtect.tools"),
          href: "/simple/advanced/personal-protect/tools",
          icon: Settings,
          count: "20+",
        },
      ],
    },
    {
      id: "media3",
      title: t("beginners.cards.media.title"),
      description: t("beginners.cards.media.description"),
      icon: Video,
      color: "from-emerald-500 to-teal-600",
      bgColor:
        "bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/30 dark:to-teal-900/20",
      borderColor: "border-emerald-300/60 dark:border-emerald-600/40",
      href: "/simple/media",
      items: [
        {
          title: t("beginners.cards.media.videos"),
          href: "/simple/videos",
          icon: Play,
          count: "50+",
        },
        {
          title: t("beginners.cards.media.lectures"),
          href: "/simple/lectures",
          icon: GraduationCap,
          count: "30+",
        },
        {
          title: t("beginners.cards.media.presentations"),
          href: "/simple/presentations",
          icon: Presentation,
          count: "25+",
        },
      ],
    },
    {
      id: "definitions3",
      title: t("beginners.cards.definitions.title"),
      description: t("beginners.cards.definitions.description"),
      icon: BookOpen,
      color: "from-indigo-500 to-purple-600",
      bgColor:
        "bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-900/30 dark:to-purple-900/20",
      borderColor: "border-indigo-300/60 dark:border-indigo-600/40",
      href: "/simple/definitions-categories",
      items: definitionCategories.slice(0, 2).map(category => ({
        title: language === "ar" ? category.name : category.nameEn || category.name,
        href: `/simple/definitions-categories/${category.id}`,
        icon: BookOpen,
        count: "",
        imageUrl: null // Don't show images in main page
      })).concat([
        {
          title: language === "ar" ? "عرض المزيد من الفئات" : "View More Categories",
          href: "/simple/definitions-categories",
          icon: ArrowRight,
          count: "",
          imageUrl: null
        }
      ]),
    },
    {
      id: "personal-protect3",
      title: t("beginners.cards.personalProtect.title"),
      description: t("beginners.cards.personalProtect.description"),
      icon: ShieldCheck,
      color: "from-amber-500 to-orange-600",
      bgColor:
        "bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-900/30 dark:to-orange-900/20",
      borderColor: "border-amber-300/60 dark:border-amber-600/40",
      href: "/simple/advanced/personal-protect",
      items: [
        {
          title: t("beginners.cards.personalProtect.tips"),
          href: "/simple/advanced/personal-protect",
          icon: ShieldCheck,
          count: "100+",
        },
        {
          title: t("beginners.cards.personalProtect.tools"),
          href: "/simple/advanced/personal-protect/tools",
          icon: Settings,
          count: "20+",
        },
      ],
    },
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
                  ? "/images/beginners/Gemini_Generated_Image_c7ds1sc7ds1sc7ds.png"
                  : card.id === "definitions"
                  ? "/images/beginners/Gemini_Generated_Image_dudzufdudzufdudz.png"
                  : card.id === "personal-protect"
                  ? "/images/beginners/Gemini_Generated_Image_ry6ctary6ctary6c.png"
                  : card.id === "media1"
                  ? "/images/beginners/Gemini_Generated_Image_2q2d7n2q2d7n2q2d.png"
                  : card.id === "definitions1"
                  ? "/images/beginners/Gemini_Generated_Image_ut3c4xut3c4xut3c.png"
                  : card.id === "personal-protect1"
                  ? "/images/beginners/Gemini_Generated_Image_70kvgb70kvgb70kv.png"
                  : card.id === "media2"
                  ? "/images/beginners/Gemini_Generated_Image_scvpqscvpqscvpqs.png"
                  : card.id === "definitions2"
                  ? "/images/beginners/Gemini_Generated_Image_pjw9t4pjw9t4pjw9.png"
                  : card.id === "personal-protect2"
                  ? "/images/beginners/Gemini_Generated_Image_im25tyim25tyim25.png"
                  : card.id === "media3"
                  ? "/images/beginners/Gemini_Generated_Image_loa5htloa5htloa5.png"
                  : card.id === "definitions3"
                  ? "/images/beginners/Gemini_Generated_Image_izzu99izzu99izzu.png"
                  : card.id === "personal-protect3"
                  ? "/images/beginners/Gemini_Generated_Image_izwtzfizwtzfizwt.png"
                  : "/images/beginners/Gemini_Generated_Image_70kvgb70kvgb70kv.png";

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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                        {card.items.map((item, itemIndex) => (
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
                localStorage.setItem("beginnersMode", "false");
                window.location.href = "/";
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
