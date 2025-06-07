"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import Image from "next/image"
import Link from "next/link"
import { useLatestNews } from "@/core/hooks/use-news"

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

  if (loading || news.length === 0) return null

  // Determine the direction of the slide based on RTL setting
  const slideDirection = isRtl ? -1 : 1

  return (
    <div
      ref={carouselRef}
      className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-900"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      <div className="relative h-[400px] md:h-[500px]">
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
                src={news[currentIndex].imageUrl || "/placeholder.svg"}
                alt={
                  language === "ar"
                    ? news[currentIndex].title || news[currentIndex].titleEn || "News image"
                    : news[currentIndex].titleEn || news[currentIndex].title || "News image"
                }
                fill
                className="object-cover"
                priority
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                <div className="container mx-auto">
                  <div className={`max-w-3xl ${isRtl ? "mr-0 ml-auto text-right" : "ml-0 mr-auto text-left"}`}>
                    <div
                      className={`mb-2 text-sm md:text-base bg-primary/80 inline-block px-2 py-1 rounded ${
                        isRtl ? "float-right" : "float-left"
                      }`}
                    >
                      {new Date(news[currentIndex].date ?? "").toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                    </div>
                    <div className="clear-both"></div>
                    <h2 className="text-xl md:text-3xl font-bold mb-2 line-clamp-2">
                      {language === "ar"
                        ? news[currentIndex].title || news[currentIndex].titleEn || "No title available"
                        : news[currentIndex].titleEn || news[currentIndex].title || "No title available"}
                    </h2>
                    <p className="text-sm md:text-base mb-4 line-clamp-2 text-gray-200">
                      {language === "ar"
                        ? news[currentIndex].summary || news[currentIndex].summaryEn || "No summary available"
                        : news[currentIndex].summaryEn || news[currentIndex].summary || "No summary available"}
                    </p>
                    <Link
                      href={`/news/${news[currentIndex].id}`}
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

        {/* Navigation arrows - Fixed for RTL/LTR */}
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

        {/* Indicators - Fixed spacing */}
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
