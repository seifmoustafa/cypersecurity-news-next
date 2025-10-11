"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { container } from "@/core/di/container";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Star,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import { useNewsCategories } from "@/core/hooks/use-news-categories";
import { useCurrentYearAwareness } from "@/core/hooks/use-current-year-awareness";
import { useLatestNews } from "@/hooks/use-latest-news";

export default function SimpleAwarenessPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const [counts, setCounts] = useState({
    news: 0,
    awareness: 0,
  });

  // Fetch news categories and current year awareness
  const { categories: newsCategories, loading: categoriesLoading } =
    useNewsCategories(1, 100);
  const { awareness: currentYearAwareness, loading: awarenessLoading } =
    useCurrentYearAwareness("", 1, 100);
  const { news: latestNews, loading: latestNewsLoading } = useLatestNews();

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Image handling functions from news-carousel.tsx
  const getImageObjectFit = (imageUrl: string) => {
    // Use contain to show the whole image without cropping
    return 'object-contain'
  }

  const getImageObjectPosition = (imageUrl: string) => {
    // Different positioning strategies
    const positions = {
      'center': 'center center',
      'top': 'center top',
      'bottom': 'center bottom',
      'left': 'left center',
      'right': 'right center',
      'top-left': 'left top',
      'top-right': 'right top',
      'bottom-left': 'left bottom',
      'bottom-right': 'right bottom'
    }
    
    // Default to center for news images
    return positions.center
  }

  // Auto play functionality from news-carousel.tsx
  useEffect(() => {
    const startAutoPlay = () => {
      intervalRef.current = setInterval(() => {
        nextSlide()
      }, 5000) // Increased from 3000ms to 5000ms for slower rotation
    }

    if (latestNews.length > 0) {
      startAutoPlay()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [latestNews])

  // Reset carousel when news data changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [latestNews]);

  // Navigation functions from news-carousel.tsx
  const nextSlide = () => {
    if (latestNews.length === 0) return
    setCurrentSlide((prevIndex) => (prevIndex + 1) % latestNews.length)
  }

  const prevSlide = () => {
    if (latestNews.length === 0) return
    setCurrentSlide((prevIndex) => (prevIndex - 1 + latestNews.length) % latestNews.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Pause auto play on hover
  const pauseAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resumeAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 5000) // Increased from 3000ms to 5000ms for slower rotation
  }

  // Debug logging
  console.log("Latest news:", latestNews);
  console.log("Latest news loading:", latestNewsLoading);
  console.log("Current slide:", currentSlide);
  console.log("Is paused:", isPaused);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [newsData, awarenessResp] = await Promise.all([
          container.services.news.getNewsByCategory(null, 1, 100),
          container.services.awareness.getCurrentYearAwareness("", 1, 100),
        ]);
        setCounts({
          news: newsData?.length || 0,
          awareness:
            awarenessResp?.pagination?.itemsCount ||
            awarenessResp?.data?.length ||
            0,
        });
      } catch (e) {
        setCounts({ news: 0, awareness: 0 });
      }
    };
    fetchCounts();
  }, []);

  const mainCards = [
    {
      id: "news",
      title: language === "ar" ? "الأخبار" : "News",
      description:
        language === "ar"
          ? "آخر أخبار وتحديثات الأمن السيبراني"
          : "Latest cybersecurity news and updates",
      icon: Newspaper,
        color: "from-sky-400 to-blue-500",
        bgColor:
          "bg-gradient-to-br from-sky-50/80 to-blue-50/60 dark:from-sky-900/30 dark:to-blue-900/20",
        borderColor: "border-sky-300/60 dark:border-sky-600/40",
      href: "/simple/news-categories",
      // OLD WAY (commented): Show only first 3 categories + show more
      // items: newsCategories
      //   .slice(0, 3)
      //   .map((category) => ({
      //     title:
      //       language === "ar"
      //         ? category.name
      //         : category.nameEn || category.name,
      //     href: `/simple/news-categories/${category.id}`,
      //     icon: Newspaper,
      //     count: "",
      //     imageUrl: null,
      //   }))
      //   .concat([
      //     {
      //       title:
      //         language === "ar"
      //           ? "عرض المزيد من الفئات"
      //           : "View More Categories",
      //       href: "/simple/news-categories",
      //       icon: ArrowRight,
      //       count: "",
      //       imageUrl: null,
      //     },
      //   ]),
      
      // NEW WAY: Show all categories
      items: newsCategories.map((category) => ({
        title:
          language === "ar"
            ? category.name
            : category.nameEn || category.name,
        href: `/simple/news-categories/${category.id}`,
        icon: Newspaper,
        count: "",
        imageUrl: null,
      })),
    },
    {
      id: "awareness",
      title: language === "ar" ? "نشرات التوعية" : "Awareness Materials",
      description:
        language === "ar"
          ? "نشرات توعوية مبسطة حسب السنوات"
          : "Awareness materials by year",
      icon: Lightbulb,
        color: "from-blue-400 to-cyan-500",
        bgColor:
          "bg-gradient-to-br from-blue-50/80 to-cyan-50/60 dark:from-blue-900/30 dark:to-cyan-900/20",
        borderColor: "border-blue-300/60 dark:border-blue-600/40",
      href: "/simple/awareness-years",
      // OLD WAY (commented): Show only first 2 awareness items + show more
      // items:
      //   currentYearAwareness.length > 0
      //     ? currentYearAwareness
      //         .slice(0, 2)
      //         .map((item) => ({
      //           title:
      //             language === "ar" ? item.title : item.titleEn || item.title,
      //           href: `/simple/awareness/${item.year}/${item.id}`,
      //           icon: Lightbulb,
      //           count: "",
      //           imageUrl: null,
      //         }))
      //         .concat([
      //           {
      //             title:
      //               language === "ar"
      //                 ? "عرض المزيد من هذا العام"
      //                 : "View More This Year",
      //             href: "/simple/awareness/current-year",
      //             icon: ArrowRight,
      //             count: "",
      //             imageUrl: null,
      //           },
      //           {
      //             title:
      //               language === "ar" ? "عرض جميع السنوات" : "View All Years",
      //             href: "/simple/awareness-years",
      //             icon: BookOpen,
      //             count: "",
      //             imageUrl: null,
      //           },
      //         ])
      //     : [
      //         {
      //           title:
      //             language === "ar"
      //               ? "نشرات التوعية للعام الحالي"
      //               : "Current Year Materials",
      //           href: "/simple/awareness/current-year",
      //           icon: Lightbulb,
      //           count: "",
      //           imageUrl: null,
      //         },
      //         {
      //           title:
      //             language === "ar" ? "عرض جميع السنوات" : "View All Years",
      //           href: "/simple/awareness-years",
      //           icon: BookOpen,
      //           count: "",
      //           imageUrl: null,
      //         },
      //       ],
      
      // NEW WAY: Show all awareness items
      items:
        currentYearAwareness.length > 0
          ? currentYearAwareness.map((item) => ({
              title:
                language === "ar" ? item.title : item.titleEn || item.title,
              href: `/simple/awareness-years/current/${item.id}`,
              icon: Lightbulb,
              count: "",
              imageUrl: null,
            }))
          : [
              {
                title:
                  language === "ar"
                    ? "نشرات التوعية للعام الحالي"
                    : "Current Year Materials",
                href: "/simple/awareness-years/current-year",
                icon: Lightbulb,
                count: "",
                imageUrl: null,
              },
              {
                title:
                  language === "ar" ? "عرض جميع السنوات" : "View All Years",
                href: "/simple/awareness-years",
                icon: BookOpen,
                count: "",
                imageUrl: null,
              },
            ],
    },
  ];

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
            {
              label:
                language === "ar" ? "التوعية والأخبار" : "Awareness & News",
            },
          ]}
        />

        {/* Professional Latest News Carousel */}
        {latestNews.length > 0 && (
          <div className="mb-12">
            {/* <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "ar" ? "آخر الأخبار" : "Latest News"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {language === "ar" 
                  ? "أحدث الأخبار والتحديثات في الأمن السيبراني"
                  : "Latest cybersecurity news and updates"
                }
              </p>
            </div> */}
            
            <div className="w-full max-w-5xl mx-auto h-[28rem] flex flex-col bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 dark:from-blue-950/50 dark:via-slate-900 dark:to-cyan-950/50 relative overflow-hidden rounded-2xl shadow-2xl">
              {/* Enhanced background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.2),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.2),transparent_50%)]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.03)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
              </div>

              {/* Enhanced Latest News Title */}
              <div className="relative bg-gradient-to-r from-blue-600/95 via-blue-700/90 to-blue-800/85 dark:from-blue-700/95 dark:via-blue-800/90 dark:to-blue-900/85 px-8 py-4 border-b border-blue-500/40 dark:border-blue-400/40 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 z-10">
                <div className="container mx-auto">
                  <div className="flex items-center justify-between">
                    <h1 className={`text-xl md:text-2xl font-bold text-white ${isRtl ? "text-right" : "text-left"} flex items-center gap-4`}>
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-60 animate-pulse"></div>
                        <div className="relative w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
                      </div>
                      <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                        {language === "ar" ? "أحدث الأخبار" : "Latest News"}
                      </span>
                    </h1>
                    
                    {/* Enhanced News Counter */}
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-sm font-semibold">
                          {currentSlide + 1} / {latestNews.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="relative flex-1 overflow-hidden"
                onMouseEnter={pauseAutoPlay}
                onMouseLeave={resumeAutoPlay}
              >
                <div className="relative h-full">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? -30 : 30 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <div className="relative w-full h-full overflow-hidden">
                        {/* Enhanced Image Container with Clear Image Display */}
                        <div className="relative w-full h-full aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={latestNews[currentSlide]?.imageUrl || "/placeholder.svg"}
                            alt={language === "ar" ? latestNews[currentSlide]?.title : latestNews[currentSlide]?.titleEn || latestNews[currentSlide]?.title}
                            fill
                            className={`${getImageObjectFit(latestNews[currentSlide]?.imageUrl || "")} transition-transform duration-700 hover:scale-105`}
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                            quality={95}
                            style={{
                              objectPosition: getImageObjectPosition(latestNews[currentSlide]?.imageUrl || "")
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully')
                            }}
                            onError={(e) => {
                              console.log('Image failed to load, using placeholder')
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                          />
                          
                          {/* Subtle overlay for better text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                        </div>

                        {/* Enhanced Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 dark:from-black/95 dark:via-black/75 dark:to-black/30"></div>
                        
                        {/* Enhanced Cybersecurity pattern overlay */}
                        <div className="absolute inset-0 opacity-15">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.4),transparent_60%)]"></div>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.4),transparent_60%)]"></div>
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(99,102,241,0.1)_50%,transparent_70%)]"></div>
                        </div>

                        {/* Enhanced Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-20">
                          <div className="container mx-auto">
                            <div className={`max-w-4xl ${isRtl ? "mr-20 ml-auto text-right" : "ml-20 mr-auto text-left"}`}>
                              {/* Enhanced Date Badge */}
                              <div className={`mb-6 ${isRtl ? "text-right" : "text-left"}`}>
                                <span className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/95 to-cyan-600/95 dark:from-blue-700/95 dark:to-cyan-700/95 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm font-semibold border border-blue-500/50 dark:border-blue-400/50 shadow-2xl shadow-blue-500/40 dark:shadow-blue-500/50">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm opacity-60 animate-pulse"></div>
                                    <div className="relative w-2 h-2 bg-yellow-400 rounded-full shadow-lg"></div>
                                  </div>
                                  {latestNews[currentSlide]?.date ? new Date(latestNews[currentSlide].date).toLocaleDateString("en-US") : ""}
                                </span>
                              </div>
                              
                              {/* Enhanced Title */}
                              <h2 className="text-2xl md:text-4xl font-bold mb-6 line-clamp-2 leading-tight text-white drop-shadow-2xl">
                                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                                  {language === "ar" ? latestNews[currentSlide]?.title : latestNews[currentSlide]?.titleEn || latestNews[currentSlide]?.title}
                                </span>
                              </h2>
                              
                              {/* Enhanced Summary */}
                              {latestNews[currentSlide]?.summary && (
                                <div className="mb-1">
                                  <p className="text-base md:text-lg text-gray-100 line-clamp-3 leading-relaxed drop-shadow-lg font-medium max-w-3xl">
                                    {language === "ar" ? latestNews[currentSlide].summary : latestNews[currentSlide].summaryEn || latestNews[currentSlide].summary}
                                  </p>
                                </div>
                              )}
                              
                              {/* Enhanced Read More Button */}
                              <Link
                                href={`/simple/news-categories/${latestNews[currentSlide]?.categoryId}/${latestNews[currentSlide]?.id}`}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/40 dark:shadow-blue-500/50 border border-blue-500/40 dark:border-blue-400/40 backdrop-blur-sm mt-1"
                              >
                                {language === "ar" ? "اقرأ المزيد" : "Read More"}
                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Enhanced Navigation arrows */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-1/2 ${
                      isRtl ? "right-6" : "left-6"
                    } -translate-y-1/2 bg-gradient-to-r from-blue-600/90 to-cyan-600/90 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-700/90 dark:to-cyan-700/90 dark:hover:from-blue-800 dark:hover:to-cyan-800 text-white rounded-full z-20 backdrop-blur-xl border border-blue-500/50 dark:border-blue-400/50 transition-all duration-300 hover:scale-110 shadow-2xl shadow-blue-500/50 dark:shadow-blue-500/60 w-12 h-12`}
                    onClick={prevSlide}
                    aria-label={language === "ar" ? "السابق" : "Previous"}
                  >
                    {isRtl ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-1/2 ${
                      isRtl ? "left-6" : "right-6"
                    } -translate-y-1/2 bg-gradient-to-r from-blue-600/90 to-cyan-600/90 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-700/90 dark:to-cyan-700/90 dark:hover:from-blue-800 dark:hover:to-cyan-800 text-white rounded-full z-20 backdrop-blur-xl border border-blue-500/50 dark:border-blue-400/50 transition-all duration-300 hover:scale-110 shadow-2xl shadow-blue-500/50 dark:shadow-blue-500/60 w-12 h-12`}
                    onClick={nextSlide}
                    aria-label={language === "ar" ? "التالي" : "Next"}
                  >
                    {isRtl ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                  </Button>

                  {/* Enhanced Indicators */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex z-20 gap-3">
                    {latestNews.map((_, index) => (
                      <button
                        key={index}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/70 scale-125 border-2 border-white/60 backdrop-blur-sm" 
                            : "bg-white/40 hover:bg-white/60 hover:scale-110 border border-white/40 backdrop-blur-sm"
                        }`}
                        onClick={() => goToSlide(index)}
                        aria-label={`${language === "ar" ? "انتقل إلى الشريحة" : "Go to slide"} ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Interactive Cards - Same Design as Main Page */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto items-stretch">
          {mainCards.map((card, index) => {
            const gifPath =
              card.id === "news"
                ? "/assets/images/beginners/Gemini_Generated_Image_c7ds1sc7ds1sc7ds.png"
                : card.id === "awareness"
                ? "/assets/images/beginners/Gemini_Generated_Image_70kvgb70kvgb70kv.png"
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
                  // OLD WAY (commented): Fixed height with scrollable content
                  // className={`relative ${card.bgColor} backdrop-blur-sm border-2 ${card.borderColor} rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 h-[600px] flex flex-col cursor-pointer`}
                  onMouseMove={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const rotateX = ((y - rect.height / 2) / rect.height) * -5;
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
                  {/* GIF Hero Section - Bigger Size */}
                  <div className="relative h-80 overflow-hidden flex-shrink-0">
                    <img
                      src={gifPath}
                      alt={`${card.title} animation`}
                      className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:from-black/60 dark:via-transparent dark:to-transparent"></div>
                  </div>

                  {/* Content Section - Responsive like Media Page */}
                  <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex-1 flex flex-col">
                    <div className="flex-shrink-0 mb-2 sm:mb-3 md:mb-4">
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    {/* Quick Access Links - Responsive */}
                    <div className="space-y-1 sm:space-y-2 flex-1 flex flex-col justify-center">
                      {/* OLD WAY (commented): Scrollable content with max height
                      <div className="space-y-2 flex-1 flex flex-col justify-start overflow-y-auto max-h-64">
                      */}
                      {card.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.href}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-between p-2 sm:p-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-md sm:rounded-lg transition-all duration-300 group/item border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20"
                        >
                          <div className="flex items-center gap-3">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-8 h-8 rounded-lg object-fill"
                              />
                            )}
                            <span className="text-gray-700 dark:text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium group-hover/item:text-green-700 dark:group-hover/item:text-green-400 transition-colors duration-300">
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {item.count && (
                              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mr-2 bg-white/60 dark:bg-white/10 px-2 py-1 rounded-full group-hover/item:bg-green-200 dark:group-hover/item:bg-green-800 group-hover/item:text-green-700 dark:group-hover/item:text-green-200 transition-colors duration-300">
                                {item.count}
                              </span>
                            )}
                            {isRtl ? (
                              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
                            ) : (
                              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300" />
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
      </div>
    </div>
  );
}
