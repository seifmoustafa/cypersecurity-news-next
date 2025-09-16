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

  // Simplified aspect ratio handling for better image display
  const getImageAspectRatio = (imageUrl: string) => {
    // Use a flexible aspect ratio that works well for most images
    return 'aspect-[16/9]' // Standard widescreen ratio that works for most content
  }

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
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 dark:from-blue-950/50 dark:via-slate-900 dark:to-cyan-950/50 relative overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.2),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.03)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
      </div>

      {/* Enhanced Latest News Title */}
      <div className="relative bg-gradient-to-r from-blue-600/95 via-blue-700/90 to-blue-800/85 dark:from-blue-700/95 dark:via-blue-800/90 dark:to-blue-900/85 px-8 py-6 border-b border-blue-500/40 dark:border-blue-400/40 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl md:text-3xl font-bold text-white ${isRtl ? "text-right" : "text-left"} flex items-center gap-4`}>
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-60 animate-pulse"></div>
                <div className="relative w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
              </div>
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                {language === "ar" ? "أحدث الأخبار" : "Latest News"}
              </span>
            </h1>
            
            {/* Enhanced News Counter */}
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-semibold">
                  {currentIndex + 1} / {news.length}
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
            <div className="relative w-full h-full overflow-hidden">
              {/* Enhanced Image Container with Clear Image Display */}
              <div className="relative w-full h-full aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                <Image
                  src={currentNews.imageUrl || "/placeholder.svg"}
                  alt={displayTitle}
                  fill
                  className={`${getImageObjectFit(currentNews.imageUrl || "")} transition-transform duration-700 hover:scale-105`}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  quality={95}
                  style={{
                    objectPosition: getImageObjectPosition(currentNews.imageUrl || "")
                  }}
                  onLoad={() => {
                    // Image loaded successfully
                    console.log('Image loaded successfully')
                  }}
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
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
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white z-20">
                <div className="container mx-auto">
                  <div className={`max-w-5xl ${isRtl ? "mr-0 ml-auto text-right" : "ml-0 mr-auto text-left"}`}>
                    {/* Enhanced Date Badge */}
                    <div className={`mb-8 ${isRtl ? "text-right" : "text-left"}`}>
                      <span className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/95 to-cyan-600/95 dark:from-blue-700/95 dark:to-cyan-700/95 backdrop-blur-xl text-white px-6 py-3 rounded-full text-sm font-semibold border border-blue-500/50 dark:border-blue-400/50 shadow-2xl shadow-blue-500/40 dark:shadow-blue-500/50">
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm opacity-60 animate-pulse"></div>
                          <div className="relative w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
                        </div>
                        {new Date(currentNews.date || currentNews.createdAt).toLocaleDateString("en-US")}
                      </span>
                    </div>
                    
                    {/* Enhanced Title */}
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 line-clamp-2 leading-tight text-white drop-shadow-2xl">
                      <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                        {displayTitle}
                      </span>
                    </h2>
                    
                    {/* Enhanced Summary */}
                    {hasValidSummary && (
                      <div className="mb-10">
                        <p className="text-lg md:text-xl text-gray-100 line-clamp-3 leading-relaxed drop-shadow-lg font-medium max-w-4xl">
                          {cleanSummary}
                        </p>
                      </div>
                    )}
                    
                    {/* Enhanced Read More Button */}
                    <Link
                      href={`/news/${newsSlug}`}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/40 dark:shadow-blue-500/50 border border-blue-500/40 dark:border-blue-400/40 backdrop-blur-sm"
                    >
                      {t("common.readMore")}
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            isRtl ? "right-8" : "left-8"
          } -translate-y-1/2 bg-gradient-to-r from-blue-600/90 to-cyan-600/90 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-700/90 dark:to-cyan-700/90 dark:hover:from-blue-800 dark:hover:to-cyan-800 text-white rounded-full z-20 backdrop-blur-xl border border-blue-500/50 dark:border-blue-400/50 transition-all duration-300 hover:scale-110 shadow-2xl shadow-blue-500/50 dark:shadow-blue-500/60 w-14 h-14`}
          onClick={prevSlide}
          aria-label={t("common.previous")}
        >
          {isRtl ? <ChevronRight className="h-7 w-7" /> : <ChevronLeft className="h-7 w-7" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-1/2 ${
            isRtl ? "left-8" : "right-8"
          } -translate-y-1/2 bg-gradient-to-r from-blue-600/90 to-cyan-600/90 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-700/90 dark:to-cyan-700/90 dark:hover:from-blue-800 dark:hover:to-cyan-800 text-white rounded-full z-20 backdrop-blur-xl border border-blue-500/50 dark:border-blue-400/50 transition-all duration-300 hover:scale-110 shadow-2xl shadow-blue-500/50 dark:shadow-blue-500/60 w-14 h-14`}
          onClick={nextSlide}
          aria-label={t("common.next")}
        >
          {isRtl ? <ChevronLeft className="h-7 w-7" /> : <ChevronRight className="h-7 w-7" />}
        </Button>

        {/* Enhanced Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex z-20 gap-4">
          {news.map((_, index) => (
            <button
              key={index}
              className={`w-5 h-5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/70 scale-125 border-2 border-white/60 backdrop-blur-sm" 
                  : "bg-white/40 hover:bg-white/60 hover:scale-110 border border-white/40 backdrop-blur-sm"
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
