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
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import BeginnersTipsTicker from "@/components/layouts/beginners-tips-ticker";
import BeginnersTipOfTheDayPopup from "@/components/beginners-tip-of-the-day-popup";

export default function BeginnersHome() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const isRtl = language === "ar";

  useEffect(() => {
    router.prefetch("/beginners/videos");
    router.prefetch("/beginners/definitions");
    router.prefetch("/beginners/personal-protect");
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
      href: "/beginners/media",
      items: [
        {
          title: t("beginners.cards.media.videos"),
          href: "/beginners/videos",
          icon: Play,
          count: "50+",
        },
        {
          title: t("beginners.cards.media.lectures"),
          href: "/beginners/lectures",
          icon: GraduationCap,
          count: "30+",
        },
        {
          title: t("beginners.cards.media.presentations"),
          href: "/beginners/presentations",
          icon: Presentation,
          count: "25+",
        },
        {
          title: language === "ar" ? "الأخبار" : "News",
          href: "/beginners/news",
          icon: CheckCircle,
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
      href: "/beginners/definitions",
      items: [
        {
          title: t("beginners.cards.definitions.terms"),
          href: "/beginners/definitions",
          icon: BookOpen,
          count: "200+",
        },
        {
          title: t("beginners.cards.definitions.categories"),
          href: "/beginners/definitions/categories",
          icon: CheckCircle,
          count: "15+",
        },
      ],
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
      href: "/beginners/personal-protect",
      items: [
        {
          title: t("beginners.cards.personalProtect.tips"),
          href: "/beginners/personal-protect",
          icon: ShieldCheck,
          count: "100+",
        },
        {
          title: t("beginners.cards.personalProtect.tools"),
          href: "/beginners/personal-protect/tools",
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
      href: "/beginners/media",
      items: [
        {
          title: t("beginners.cards.media.videos"),
          href: "/beginners/videos",
          icon: Play,
          count: "50+",
        },
        {
          title: t("beginners.cards.media.lectures"),
          href: "/beginners/lectures",
          icon: GraduationCap,
          count: "30+",
        },
        {
          title: t("beginners.cards.media.presentations"),
          href: "/beginners/presentations",
          icon: Presentation,
          count: "25+",
        },
        {
          title: language === "ar" ? "الأخبار" : "News",
          href: "/beginners/news",
          icon: CheckCircle,
          count: "",
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
      href: "/beginners/definitions",
      items: [
        {
          title: t("beginners.cards.definitions.terms"),
          href: "/beginners/definitions",
          icon: BookOpen,
          count: "200+",
        },
        {
          title: t("beginners.cards.definitions.categories"),
          href: "/beginners/definitions/categories",
          icon: CheckCircle,
          count: "15+",
        },
      ],
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
      href: "/beginners/personal-protect",
      items: [
        {
          title: t("beginners.cards.personalProtect.tips"),
          href: "/beginners/personal-protect",
          icon: ShieldCheck,
          count: "100+",
        },
        {
          title: t("beginners.cards.personalProtect.tools"),
          href: "/beginners/personal-protect/tools",
          icon: Settings,
          count: "20+",
        },
      ],
    },
  ];

  return (
    <>
      <BeginnersTipsTicker />
      <BeginnersTipOfTheDayPopup />

      {/* GIF-Focused Interactive Section */}
      <div className="min-h-screen relative overflow-hidden">
         {/* Background Image */}
         <div
           className="absolute inset-0 bg-cover bg-center bg-no-repeat "
           style={{
             backgroundImage:
               "url('/images/beginners/Gemini_Generated_Image_ry6ctary6ctary6c.png')",
           }}
         ></div>

         {/* Background Overlay */}
         <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60"></div>

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {mainCards.map((card, index) => {
              const gifPath =
                card.id === "media"
                  ? "/images/media.gif"
                  : card.id === "definitions"
                  ? "/images/definitions.gif"
                  : card.id === "personal-protect"
                  ? "/images/personal_protect.gif"
                  : card.id === "media1"
                  ? "/images/beginners/Gemini_Generated_Image_2q2d7n2q2d7n2q2d.png"
                  : card.id === "definitions1"
                  ? "/images/beginners/Gemini_Generated_Image_ut3c4xut3c4xut3c.png"
                  : card.id === "personal-protect1"
                  ? "/images/beginners/Gemini_Generated_Image_70kvgb70kvgb70kv.png"
                  : "/images/beginners/Gemini_Generated_Image_70kvgb70kvgb70kv.png";

              return (
                <Link
                  key={card.id}
                  href={card.href}
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
                </Link>
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
