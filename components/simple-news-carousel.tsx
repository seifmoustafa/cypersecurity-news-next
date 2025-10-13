"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLatestNews } from "@/hooks/use-latest-news";
import { formatDateArabicNumbers } from "@/lib/content-purifier";

export default function SimpleNewsCarousel() {
  const { language } = useLanguage();
  const isRtl = language === "ar";
  const { news: latestNews, loading: latestNewsLoading } = useLatestNews();
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Image handling functions from news-carousel.tsx
  const getImageObjectFit = (imageUrl: string) => {
    // Use contain to show the whole image without cropping
    return "object-contain";
  };

  const getImageObjectPosition = (imageUrl: string) => {
    // Different positioning strategies
    const positions = {
      center: "center center",
      top: "center top",
      bottom: "center bottom",
      left: "left center",
      right: "right center",
      "top-left": "left top",
      "top-right": "right top",
      "bottom-left": "left bottom",
      "bottom-right": "right bottom",
    };

    // Default to center for news images
    return positions.center;
  };
  // Reset carousel when news data changes
  const [currentSlide, setCurrentSlide] = useState(0);
  const resumeAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000); // Increased from 3000ms to 5000ms for slower rotation
  };
  useEffect(() => {
    setCurrentSlide(0);
  }, [latestNews]);
  // Navigation functions from news-carousel.tsx
  const nextSlide = () => {
    if (latestNews.length === 0) return;
    setCurrentSlide((prevIndex) => (prevIndex + 1) % latestNews.length);
  };

  const prevSlide = () => {
    if (latestNews.length === 0) return;
    setCurrentSlide(
      (prevIndex) => (prevIndex - 1 + latestNews.length) % latestNews.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Pause auto play on hover
  const pauseAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  if (latestNews.length > 0) {
    return (
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
                              {formatDateArabicNumbers(latestNews[currentSlide]?.date||latestNews[currentSlide]?.createdAt)}
                              {/* {latestNews[currentSlide]?.date ? new Date(latestNews[currentSlide].date).toLocaleDateString("en-US") : ""} */}
                            </span>
                          </div>
                          
                          {/* Enhanced Title */}
                          <h2 className="text-2xl md:text-4xl font-bold mb-6 line-clamp-2 leading-tight text-white drop-shadow-2xl">
                            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                              {language === "ar" ? latestNews[currentSlide]?.title : latestNews[currentSlide]?.titleEn || latestNews[currentSlide]?.title}
                            </span>
                          </h2>
                          
                          {/* Enhanced Summary */}
                          {/* {latestNews[currentSlide]?.summary && (
                            <div className="mb-1">
                              <p className="text-base md:text-lg text-gray-100 line-clamp-3 leading-relaxed drop-shadow-lg font-medium max-w-3xl">
                                {language === "ar" ? latestNews[currentSlide].summary : latestNews[currentSlide].summaryEn || latestNews[currentSlide].summary}
                              </p>
                            </div>
                          )} */}
                          
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
    );
  }
}
