"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import Image from "next/image"
import Link from "next/link"
import { useLatestNews } from "@/core/hooks/use-news"
import { slugify } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewsCarousel() {
  const { language, t, isRtl } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const { news, loading } = useLatestNews(5)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    if (news.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length)
  }

  const prevSlide = () => {
    if (news.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto play functionality
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    if (news.length > 0) {
      startAutoPlay()
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [news])

  // Pause auto play on hover
  const pauseAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }

  const resumeAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    autoPlayRef.current = setInterval(() => {
      nextSlide()
    }, 5000)
  }

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-900">
        <div className="relative h-full">
          {/* Skeleton for image */}
          <Skeleton className="absolute inset-0 w-full h-full" />

          {/* Skeleton for content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="container mx-auto">
              <div className={`max-w-3xl ${isRtl ? "mr-0 ml-auto text-right" : "ml-0 mr-auto text-left"}`}>
                {/* Date skeleton */}
                <Skeleton className={`mb-2 h-8 w-24 ${isRtl ? "float-right" : "float-left"}`} />
                <div className="clear-both"></div>

                {/* Title skeleton */}
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-3/4 mb-2" />

                {/* Summary skeleton */}
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-5/6 mb-4" />

                {/* Button skeleton */}
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>

          {/* Skeleton for navigation buttons */}
          <Skeleton
            className={`absolute top-1/2 ${isRtl ? "right-4" : "left-4"} -translate-y-1/2 h-10 w-10 rounded-full`}
          />
          <Skeleton
            className={`absolute top-1/2 ${isRtl ? "left-4" : "right-4"} -translate-y-1/2 h-10 w-10 rounded-full`}
          />

          {/* Skeleton for indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="w-3 h-3 mx-1.5 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // If no news after loading, don't show anything
  if (news.length === 0) return null

  // Determine the direction of the slide based on RTL setting
  const slideDirection = isRtl ? -1 : 1

  // Get the current news item
  const currentNews = news[currentIndex]

  // Get the title for DISPLAY (based on current language)
  const displayTitle =
    language === "ar"
      ? currentNews.title || currentNews.titleEn || "News"
      : currentNews.titleEn || currentNews.title || "News"

  // ALWAYS use English title for URL slug (regardless of current language)
  const englishTitle = currentNews.titleEn || ""
  const newsSlug = slugify(englishTitle, currentNews.id)
  // ONLY GET SUMMARY - NO FALLBACK TO CONTENT!
  const newsSummary =
    language === "ar"
      ? currentNews.summary || currentNews.summaryEn || ""
      : currentNews.summaryEn || currentNews.summary || ""

  // Clean HTML tags and validate summary
  const cleanSummary = newsSummary.replace(/<\/?[^>]+(>|$)/g, "").trim()
  const hasValidSummary = cleanSummary && cleanSummary !== "string" && cleanSummary.length > 0

  // Debug logging
  console.log(`🔍 News Carousel - Language: ${language}`)
  console.log(`📰 Display Title: ${displayTitle}`)
  console.log(`🔗 English Title for URL: ${englishTitle}`)
  console.log(`🌐 Generated Slug: ${newsSlug}`)

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Latest News Title */}
      <div className="bg-gradient-to-r from-blue-600/90 via-blue-700/80 to-blue-800/70 dark:from-blue-700/90 dark:via-blue-800/80 dark:to-blue-900/70 px-6 py-4 border-b border-blue-500/30 dark:border-blue-400/30">
        <div className="container mx-auto">
          <h1 className={`text-xl md:text-2xl font-bold text-white ${isRtl ? "text-right" : "text-left"} flex items-center gap-3`}>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            {language === "ar" ? "أحدث الأخبار" : "Latest News"}
          </h1>
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
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.div
            key={currentIndex}
            custom={slideDirection}
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -30 : 30 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              {/* Image */}
              <Image
                src={currentNews.imageUrl || "/placeholder.svg"}
                alt={displayTitle}
                fill
                className="object-cover"
                priority
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <div className="container mx-auto">
                  <div className={`max-w-4xl ${isRtl ? "mr-0 ml-auto text-right" : "ml-0 mr-auto text-left"}`}>
                    {/* Date Badge */}
                    <div className={`mb-4 ${isRtl ? "text-right" : "text-left"}`}>
                      <span className="inline-flex items-center gap-2 bg-blue-600/90 dark:bg-blue-700/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30 dark:border-blue-400/30 shadow-lg">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                        {new Date(currentNews.date || currentNews.createdAt).toLocaleDateString("en-US")}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 line-clamp-2 leading-tight text-white drop-shadow-lg">
                      {displayTitle}
                    </h2>
                    
                    {/* Summary */}
                    {hasValidSummary && (
                      <p className="text-base md:text-lg mb-6 line-clamp-3 text-gray-100 dark:text-gray-200 leading-relaxed drop-shadow-md">
                        {cleanSummary}
                      </p>
                    )}
                    
                    {/* Read More Button */}
                    <Link
                      href={`/news/${newsSlug}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-500/30 dark:border-blue-400/30"
                    >
                      {t("common.readMore")}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows - Fixed for RTL/LTR */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-1/2 ${
            isRtl ? "right-6" : "left-6"
          } -translate-y-1/2 bg-black/40 hover:bg-black/60 dark:bg-white/20 dark:hover:bg-white/30 text-white dark:text-gray-800 rounded-full z-10 backdrop-blur-sm border border-white/20 dark:border-gray-300/30 transition-all duration-300 hover:scale-110`}
          onClick={prevSlide}
          aria-label={t("common.previous")}
        >
          {isRtl ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-1/2 ${
            isRtl ? "left-6" : "right-6"
          } -translate-y-1/2 bg-black/40 hover:bg-black/60 dark:bg-white/20 dark:hover:bg-white/30 text-white dark:text-gray-800 rounded-full z-10 backdrop-blur-sm border border-white/20 dark:border-gray-300/30 transition-all duration-300 hover:scale-110`}
          onClick={nextSlide}
          aria-label={t("common.next")}
        >
          {isRtl ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </Button>

        {/* Indicators - Fixed spacing */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex z-10 gap-2">
          {news.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-blue-500 dark:bg-blue-400 shadow-lg shadow-blue-500/50 dark:shadow-blue-400/50 scale-125" 
                  : "bg-gray-600/50 dark:bg-white/30 hover:bg-gray-600/70 dark:hover:bg-white/60 hover:scale-110"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

/*
OLD VERSION - UNCOMMENT TO REVERT

export default function NewsCarousel() {
  const { language, t, isRtl } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const { news, loading } = useLatestNews(5)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    if (news.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length)
  }

  const prevSlide = () => {
    if (news.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto play functionality
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    if (news.length > 0) {
      startAutoPlay()
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [news])

  // Pause auto play on hover
  const pauseAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }

  const resumeAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    autoPlayRef.current = setInterval(() => {
      nextSlide()
    }, 5000)
  }

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-900">
        <div className="relative h-full">
         
          <Skeleton className="absolute inset-0 w-full h-full" />

      
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="container mx-auto">
              <div className={`max-w-3xl ${isRtl ? "mr-0 ml-auto text-right" : "ml-0 mr-auto text-left"}`}>
             
                <Skeleton className={`mb-2 h-8 w-24 ${isRtl ? "float-right" : "float-left"}`} />
                <div className="clear-both"></div>

                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-3/4 mb-2" />

                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-5/6 mb-4" />

            
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>

      
          <Skeleton
            className={`absolute top-1/2 ${isRtl ? "right-4" : "left-4"} -translate-y-1/2 h-10 w-10 rounded-full`}
          />
          <Skeleton
            className={`absolute top-1/2 ${isRtl ? "left-4" : "right-4"} -translate-y-1/2 h-10 w-10 rounded-full`}
          />

     
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="w-3 h-3 mx-1.5 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // If no news after loading, don't show anything
  if (news.length === 0) return null

  // Determine the direction of the slide based on RTL setting
  const slideDirection = isRtl ? -1 : 1

  // Get the current news item
  const currentNews = news[currentIndex]

  // Get the title for DISPLAY (based on current language)
  const displayTitle =
    language === "ar"
      ? currentNews.title || currentNews.titleEn || "News"
      : currentNews.titleEn || currentNews.title || "News"

  // ALWAYS use English title for URL slug (regardless of current language)
  const englishTitle = currentNews.titleEn || ""
  const newsSlug = slugify(englishTitle, currentNews.id)
  // ONLY GET SUMMARY - NO FALLBACK TO CONTENT!
  const newsSummary =
    language === "ar"
      ? currentNews.summary || currentNews.summaryEn || ""
      : currentNews.summaryEn || currentNews.summary || ""

  // Clean HTML tags and validate summary
  const cleanSummary = newsSummary.replace(/<\/?[^>]+(>|$)/g, "").trim()
  const hasValidSummary = cleanSummary && cleanSummary !== "string" && cleanSummary.length > 0

  return (
    <div
      ref={carouselRef}
      className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-900"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      <div className="relative h-full">
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.div
            key={currentIndex}
            custom={slideDirection}
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -30 : 30 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
         
              <Image
                src={currentNews.imageUrl || "/placeholder.svg"}
                alt={displayTitle}
                fill
                className="object-cover"
                priority
              />

           
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

             
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                <div className="container mx-auto">
                  <div className={`max-w-3xl ${isRtl ? "mr-0 ml-auto text-right" : "ml-0 mr-auto text-left"}`}>
                    <div
                      className={`mb-2 text-sm md:text-base bg-primary/80 inline-block px-2 py-1 rounded ${
                        isRtl ? "float-right" : "float-left"
                      }`}
                    >
                      {new Date(currentNews.date || currentNews.createdAt).toLocaleDateString("en-US")}
                    </div>
                    <div className="clear-both"></div>
                    <h2 className="text-xl md:text-3xl font-bold mb-2 line-clamp-2">{displayTitle}</h2>
                   
                    <p className="text-sm md:text-base mb-4 line-clamp-2 text-gray-200">
                      {hasValidSummary ? cleanSummary : ""}
                    </p>
                    <Link
                      href={`/news/${newsSlug}`}
                      className="inline-block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      {t("common.readMore")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

     
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-1/2 ${
            isRtl ? "right-4" : "left-4"
          } -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full z-10`}
          onClick={prevSlide}
          aria-label={t("common.previous")}
        >
          {isRtl ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-1/2 ${
            isRtl ? "left-4" : "right-4"
          } -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full z-10`}
          onClick={nextSlide}
          aria-label={t("common.next")}
        >
          {isRtl ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </Button>

       
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex z-10">
          {news.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 mx-1.5 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

END OLD VERSION
*/
