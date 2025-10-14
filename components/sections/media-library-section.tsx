"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { container } from "@/core/di/container"
import type { ApiVideo, ApiLecture, ApiPresentation, VideoCategory, LectureCategory } from "@/core/domain/models/media"  
import { slugify, getLocalizedText } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Play, BookOpen, Presentation, Calendar, Clock, X, Maximize2, Minimize2, Search, Video } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useVideoCategoriesForProfessionals } from "@/core/hooks/use-video-categories-for-professionals"
import { useVideosByCategoryForProfessionals } from "@/core/hooks/use-videos-by-category-for-professionals"
import { useLectureCategoriesForProfessionals } from "@/core/hooks/use-lecture-categories-for-professionals"
import { useLecturesByCategoryForProfessionals } from "@/core/hooks/use-lectures-by-category-for-professionals"
import { useDebounce } from "@/hooks/use-debounce"
import VideoImageCarousel from "@/components/video-image-carousel"

export default function MediaLibrarySection() {
  const { t, language, isRtl } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("videos")
  const [videos, setVideos] = useState<ApiVideo[]>([])
  const [lectures, setLectures] = useState<ApiLecture[]>([])
  const [presentations, setPresentations] = useState<ApiPresentation[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [lecturesLoading, setLecturesLoading] = useState(true)
  const [presentationsLoading, setPresentationsLoading] = useState(true)
  const [videosError, setVideosError] = useState<string | null>(null)
  const [lecturesError, setLecturesError] = useState<string | null>(null)
  const [presentationsError, setPresentationsError] = useState<string | null>(null)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)
  const [showVideoCarousel, setShowVideoCarousel] = useState(false)
  const [activeVideoCategory, setActiveVideoCategory] = useState<string | null>(null)
  const [activeLectureCategory, setActiveLectureCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 500)
  const debouncedCategorySearch = useDebounce(searchQuery, 500)

  // Video categories for professionals
  const { categories: videoCategories, loading: videoCategoriesLoading, error: videoCategoriesError } = useVideoCategoriesForProfessionals(1, 100, debouncedCategorySearch)
  
  // Videos for selected category
  const { videos: categoryVideos, loading: categoryVideosLoading, error: categoryVideosError } = useVideosByCategoryForProfessionals(
    activeVideoCategory || "",
    1,
    100,
    debouncedSearch
  )

  // Lecture categories for professionals
  const { categories: lectureCategories, loading: lectureCategoriesLoading, error: lectureCategoriesError } = useLectureCategoriesForProfessionals(1, 100, debouncedCategorySearch)
  
  // Lectures for selected category
  const { lectures: categoryLectures, loading: categoryLecturesLoading, error: categoryLecturesError } = useLecturesByCategoryForProfessionals(
    activeLectureCategory || "",
    1,
    100,
    debouncedSearch
  )

  // Check URL for tab parameter on mount
  useEffect(() => {
    const tabParam = searchParams?.get("tab")
    if (tabParam && ["videos", "lectures"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Listen for tab change events
  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent
      const { sectionId, tab } = customEvent.detail

      if (sectionId === "media" && tab) {
        setActiveTab(tab)
      }
    }

    window.addEventListener("tabchange", handleTabChange)
    return () => {
      window.removeEventListener("tabchange", handleTabChange)
    }
  }, [])

  // Set first category as active when categories load
  useEffect(() => {
    if (videoCategories.length > 0 && !activeVideoCategory) {
      setActiveVideoCategory(videoCategories[0].id)
    }
  }, [videoCategories, activeVideoCategory])

  // Set first lecture category as active when categories load
  useEffect(() => {
    if (lectureCategories.length > 0 && !activeLectureCategory) {
      setActiveLectureCategory(lectureCategories[0].id)
    }
  }, [lectureCategories, activeLectureCategory])

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setVideosLoading(true)
        setVideosError(null)
        const response = await container.services.media.getVideos(1, 6) // Get first 6 videos
        setVideos(response.data)
      } catch (error) {
        console.error("Error fetching videos:", error)
        setVideosError(error instanceof Error ? error.message : "An error occurred while fetching videos")
        setVideos([])
      } finally {
        setVideosLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Fetch lectures from API
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLecturesLoading(true)
        setLecturesError(null)
        const response = await container.services.media.getLectures(1, 6) // Get first 6 lectures
        setLectures(response.data)
      } catch (error) {
        console.error("Error fetching lectures:", error)
        setLecturesError(error instanceof Error ? error.message : "An error occurred while fetching lectures")
        setLectures([])
      } finally {
        setLecturesLoading(false)
      }
    }

    fetchLectures()
  }, [])

  // Fetch presentations from API
  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        setPresentationsLoading(true)
        setPresentationsError(null)
        const response = await container.services.media.getPresentations(1, 6) // Get first 6 presentations
        setPresentations(response.data)
      } catch (error) {
        console.error("Error fetching presentations:", error)
        setPresentationsError(error instanceof Error ? error.message : "An error occurred while fetching presentations")
        setPresentations([])
      } finally {
        setPresentationsLoading(false)
      }
    }

    fetchPresentations()
  }, [])

  // Prefetch media pages
  useEffect(() => {
    // Prefetch pages
    router.prefetch("/advanced/videos")
    router.prefetch("/advanced/lectures")
  }, [router])

  // Handle video click to show carousel
  const handleVideoClick = (videoIndex: number) => {
    setSelectedVideoIndex(videoIndex)
    setShowVideoCarousel(true)
  }

  // Handle closing the carousel
  const handleCloseVideoCarousel = () => {
    setShowVideoCarousel(false)
    setSelectedVideoIndex(null)
  }

  // Handle carousel item change
  const handleCarouselItemChange = (item: any, index: number) => {
    setSelectedVideoIndex(index)
  }

  return (
    <SectionContainer id="media" className="bg-gradient-to-br from-blue-50/50 via-white to-violet-50/30 dark:from-blue-950/30 dark:via-slate-900 dark:to-violet-950/20">
      <SectionHeader title={t("section.media")} subtitle={t("media.subtitle")} />

      {/* Search Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8 mx-4 sm:mx-0">
        <div className="flex items-center gap-4" dir={isRtl ? "rtl" : "ltr"}>
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRtl ? "right-3" : "left-3"}`} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "ar"
                  ? "ابحث في الوسائط..."
                  : "Search media..."
              }
              className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${isRtl ? "left-3" : "right-3"}`}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-3 rounded-xl">
            <Search className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(videosError || lecturesError || presentationsError || videoCategoriesError || lectureCategoriesError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 mx-4 sm:mx-0" dir={isRtl ? "rtl" : "ltr"}>
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <X className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">
              {language === "ar" ? "حدث خطأ أثناء تحميل المحتوى" : "Error loading content"}
            </span>
          </div>
          <p className="text-red-600 dark:text-red-400 mt-2 text-sm">
            {videosError || lecturesError || presentationsError || videoCategoriesError || lectureCategoriesError}
          </p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`w-full max-w-2xl mx-auto mb-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
          <TabsTrigger value="videos" className="flex-1 font-semibold transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {t("media.videos")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="lectures" className="flex-1 font-semibold transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t("media.lectures")}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-0">
          {/* Video Categories Tabs */}
          {videoCategoriesError ? (
            <div className="mb-8 text-center py-8">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-2xl mx-auto" dir={isRtl ? "rtl" : "ltr"}>
                <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300 mb-2">
                  <X className="h-5 w-5" />
                  <span className="font-medium">
                    {language === "ar" ? "حدث خطأ أثناء تحميل الفئات" : "Error loading categories"}
                  </span>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {videoCategoriesError}
                </p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                  {language === "ar" ? "إعادة المحاولة" : "Retry"}
                </Button>
              </div>
            </div>
          ) : videoCategoriesLoading ? (
            <div className="mb-8">
              <div className="flex overflow-x-auto pb-2 mb-6 justify-center">
                <div className="flex space-x-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex-shrink-0 w-32 h-12 bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : videoCategories.length > 0 && (
            <div className="mb-8">
              <div className="flex overflow-x-auto pb-2 mb-6 justify-center">
                <div className={`flex ${isRtl ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-2`}>
                  {videoCategories.map((category: VideoCategory) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveVideoCategory(category.id)}
                      className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        activeVideoCategory === category.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      }`}
                    >
                      {language === "ar" ? category.name : category.nameEn || category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Videos for Selected Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}} dir={isRtl ? "rtl" : "ltr"}>
                {categoryVideosError ? (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-2xl mx-auto" dir={isRtl ? "rtl" : "ltr"}>
                      <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300 mb-2">
                        <X className="h-5 w-5" />
                        <span className="font-medium">
                          {language === "ar" ? "حدث خطأ أثناء تحميل الفيديوهات" : "Error loading videos"}
                        </span>
                      </div>
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        {categoryVideosError}
                      </p>
                      <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                      >
                        {language === "ar" ? "إعادة المحاولة" : "Retry"}
                      </Button>
                    </div>
                  </div>
                ) : showVideoCarousel && selectedVideoIndex !== null ? (
                  /* Video/Image Carousel */
                  <div className="col-span-full bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                    <VideoImageCarousel
                      items={categoryVideos.map((v) => ({
                        id: v.id,
                        name: v.nameAr,
                        nameEn: v.nameEn,
                        summary: v.summaryAr,
                        summaryEn: v.summaryEn,
                        content: null,
                        contentEn: null,
                        imageUrl: v.imageUrl,
                        videoUrl: v.videoUrl,
                        order: 0,
                        createdAt: v.createdAt,
                      }))}
                      initialIndex={selectedVideoIndex}
                      onItemChange={handleCarouselItemChange}
                      className="w-full"
                    />

                    {/* Carousel Controls */}
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-3 rounded-xl">
                            <Video className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              {language === "ar" ? "مشغل الفيديوهات" : "Video Player"}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {language === "ar"
                                ? "استخدم الأسهم للتنقل بين الفيديوهات"
                                : "Use arrows to navigate between videos"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleCloseVideoCarousel}
                          className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors duration-300"
                        >
                          {isRtl ? (
                            <ArrowRight className="h-5 w-5 mr-2" />
                          ) : (
                            <ArrowLeft className="h-5 w-5 mr-2" />
                          )}
                          {language === "ar" ? "العودة للقائمة" : "Back to List"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : categoryVideosLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <div 
                      key={index} 
                      className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden animate-pulse"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-3xl"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                      </div>
                    </div>
                  ))
                ) : categoryVideos.length > 0 ? (
                  categoryVideos.map((video, index) => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      onClick={() => handleVideoClick(index)} 
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12" dir={isRtl ? "rtl" : "ltr"}>
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      {debouncedSearch
                        ? language === "ar"
                          ? "لا توجد فيديوهات تطابق البحث"
                          : "No videos match your search"
                        : language === "ar"
                        ? "لا توجد فيديوهات متاحة"
                        : "No videos available"}
                    </h3>
                    <p className="text-muted-foreground">
                      {debouncedSearch
                        ? language === "ar"
                          ? "جرب البحث بكلمات مختلفة"
                          : "Try searching with different keywords"
                        : language === "ar"
                        ? "لم يتم العثور على أي فيديوهات في هذه الفئة"
                        : "No videos found in this category"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {videoCategories.length > 0 && !videoCategoriesLoading && !videoCategoriesError && !showVideoCarousel && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={() => router.push(`/advanced/videos/${activeVideoCategory}`)} 
                className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/40 border border-blue-500/30 dark:border-blue-400/30"
                dir={isRtl ? "rtl" : "ltr"}
              >
                <span className={isRtl ? "mr-2" : "mr-2"}>
                  {t("common.viewAll")}
                </span>
                {isRtl ? (
                  <ArrowLeft className="ml-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                )}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="lectures" className="mt-0">
          {/* Lecture Categories Tabs */}
          {lectureCategoriesError ? (
            <div className="mb-8 text-center py-8">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-2xl mx-auto" dir={isRtl ? "rtl" : "ltr"}>
                <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300 mb-2">
                  <X className="h-5 w-5" />
                  <span className="font-medium">
                    {language === "ar" ? "حدث خطأ أثناء تحميل الفئات" : "Error loading categories"}
                  </span>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {lectureCategoriesError}
                </p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                  {language === "ar" ? "إعادة المحاولة" : "Retry"}
                </Button>
              </div>
            </div>
          ) : lectureCategoriesLoading ? (
            <div className="mb-8">
              <div className="flex overflow-x-auto pb-2 mb-6 justify-center">
                <div className="flex space-x-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex-shrink-0 w-32 h-12 bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : lectureCategories.length > 0 && (
            <div className="mb-8">
              <div className="flex overflow-x-auto pb-2 mb-6 justify-center">
                <div className={`flex ${isRtl ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-2`}>
                  {lectureCategories.map((category: LectureCategory) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveLectureCategory(category.id)}
                      className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        activeLectureCategory === category.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      }`}
                    >
                      {language === "ar" ? category.name : category.nameEn || category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lectures for Selected Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}} dir={isRtl ? "rtl" : "ltr"}>
                {categoryLecturesError ? (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-2xl mx-auto" dir={isRtl ? "rtl" : "ltr"}>
                      <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300 mb-2">
                        <X className="h-5 w-5" />
                        <span className="font-medium">
                          {language === "ar" ? "حدث خطأ أثناء تحميل المحاضرات" : "Error loading lectures"}
                        </span>
                      </div>
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        {categoryLecturesError}
                      </p>
                      <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                      >
                        {language === "ar" ? "إعادة المحاولة" : "Retry"}
                      </Button>
                    </div>
                  </div>
                ) : categoryLecturesLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <div 
                      key={index} 
                      className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden animate-pulse"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-3xl"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                      </div>
                    </div>
                  ))
                ) : categoryLectures.length > 0 ? (
                  categoryLectures.map((lecture, index) => (
                    <LectureCard 
                      key={lecture.id} 
                      lecture={lecture} 
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12" dir={isRtl ? "rtl" : "ltr"}>
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      {debouncedSearch
                        ? language === "ar"
                          ? "لا توجد محاضرات تطابق البحث"
                          : "No lectures match your search"
                        : language === "ar"
                        ? "لا توجد محاضرات متاحة"
                        : "No lectures available"}
                    </h3>
                    <p className="text-muted-foreground">
                      {debouncedSearch
                        ? language === "ar"
                          ? "جرب البحث بكلمات مختلفة"
                          : "Try searching with different keywords"
                        : language === "ar"
                        ? "لم يتم العثور على أي محاضرات في هذه الفئة"
                        : "No lectures found in this category"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {lectureCategories.length > 0 && !lectureCategoriesLoading && !lectureCategoriesError && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={() => router.push(`/advanced/lectures/${activeLectureCategory}`)} 
                className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/40 border border-blue-500/30 dark:border-blue-400/30"
                dir={isRtl ? "rtl" : "ltr"}
              >
                <span className={isRtl ? "mr-2" : "mr-2"}>
                  {t("common.viewAll")}
                </span>
                {isRtl ? (
                  <ArrowLeft className="ml-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                )}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </SectionContainer>
  )
}

// Enhanced Video Card Component for API videos
const VideoCard = ({ video, onClick }: { video: ApiVideo; onClick: (videoIndex: number) => void }) => {
  const { language, isRtl } = useLanguage()

  const handleCardClick = () => {
    onClick(0) // We'll handle the index in the parent component
  }

  return (
    <button
      className="group w-full text-left"
      onClick={handleCardClick}
      onMouseMove={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / rect.height) * -3;
        const rotateY = ((x - rect.width / 2) / rect.width) * 3;
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
      }}
      style={{ transform: "perspective(900px)", animationDelay: "0ms" }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-blue-600">
          {video.imageUrl ? (
            <img
              src={video.imageUrl}
              alt={language === "ar" ? video.nameAr : video.nameEn || video.nameAr}
              className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
              <Play className="h-8 w-8 text-blue-600 ml-1" />
            </div>
          </div>

          {/* Video Duration Badge */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
            <Clock className="h-3 w-3 inline mr-1" />
            {language === "ar" ? "فيديو" : "Video"}
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4 bg-blue-500/90 text-white text-xs px-3 py-1 rounded-full">
            {video.forBeginners
              ? language === "ar"
                ? "للعامة"
                : "Beginners"
              : ""}
            {video.forBeginners && video.forProfessionals
              ? " • "
              : ""}
            {video.forProfessionals
              ? language === "ar"
                ? "للمحترفين"
                : "Professionals"
              : ""}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Video Header */}
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg mr-3 rtl:mr-0 rtl:ml-3 group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <Play className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Clock className="h-3 w-3" />{" "}
                {new Date(video.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Video Title */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
            {language === "ar" ? video.nameAr : video.nameEn || video.nameAr}
          </h3>

          {/* Video Summary */}
          <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {language === "ar" ? video.summaryAr : video.summaryEn || video.summaryAr}
          </div>

          {/* Video Footer */}
          <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-blue-400">
            <span className="mr-2 rtl:mr-0 rtl:ml-2">
              {language === "ar" ? "مشاهدة الفيديو" : "Watch Video"}
            </span>
            {isRtl ? (
              <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
            ) : (
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// Enhanced Lecture Card Component for API lectures with category-based navigation
const LectureCard = ({ lecture }: { lecture: ApiLecture }) => {
  const { language, isRtl } = useLanguage()
  const router = useRouter()

  const handleCardClick = () => {
    // Navigate to the nested route structure: /advanced/lectures/[categoryId]/[lectureId]
    router.push(`/advanced/lectures/${lecture.lectureCategoryId}/${lecture.id}`)
  }

  return (
    <button
      className="group w-full text-left"
      onClick={handleCardClick}
      onMouseMove={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / rect.height) * -3;
        const rotateY = ((x - rect.width / 2) / rect.width) * 3;
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
      }}
      style={{ transform: "perspective(900px)", animationDelay: "0ms" }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden">
        {/* Lecture Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-violet-500 to-purple-600">
          {lecture.documentUrl ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
            <Clock className="h-3 w-3 inline mr-1" />
            {language === "ar" ? "محاضرة" : "Lecture"}
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4 bg-violet-500/90 text-white text-xs px-3 py-1 rounded-full">
            {lecture.forBeginners
              ? language === "ar"
                ? "للعامة"
                : "Beginners"
              : ""}
            {lecture.forBeginners && lecture.forProfessionals
              ? " • "
              : ""}
            {lecture.forProfessionals
              ? language === "ar"
                ? "للمحترفين"
                : "Professionals"
              : ""}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Lecture Header */}
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-2 rounded-lg mr-3 rtl:mr-0 rtl:ml-3 group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Clock className="h-3 w-3" />{" "}
                {new Date(lecture.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Lecture Title */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300 line-clamp-2">
            {language === "ar" ? lecture.nameAr : lecture.nameEn || lecture.nameAr}
          </h3>

          {/* Lecture Summary */}
          <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {language === "ar" ? lecture.summaryAr : lecture.summaryEn || lecture.summaryAr}
          </div>

          {/* Lecture Footer */}
          <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-violet-400">
            <span className="mr-2 rtl:mr-0 rtl:ml-2">
              {language === "ar" ? "عرض المحاضرة" : "View Lecture"}
            </span>
            {isRtl ? (
              <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
            ) : (
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// Enhanced Presentation Card Component for API presentations with slug-based navigation
const PresentationCard = ({ presentation }: { presentation: ApiPresentation }) => {
  const { language, isRtl } = useLanguage()
  const router = useRouter()

  const handleCardClick = () => {
    const englishTitle = presentation.nameEn || ""
    const slug = slugify(englishTitle, presentation.id)
    router.push(`/advanced/presentations/${slug}`)
  }

  return (
    <button
      className="group w-full text-left"
      onClick={handleCardClick}
      onMouseMove={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / rect.height) * -3;
        const rotateY = ((x - rect.width / 2) / rect.width) * 3;
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
      }}
      style={{ transform: "perspective(900px)", animationDelay: "0ms" }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden">
        {/* Presentation Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-teal-500 to-green-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
              <Presentation className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
              <Presentation className="h-8 w-8 text-teal-600" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
            <Clock className="h-3 w-3 inline mr-1" />
            {language === "ar" ? "عرض تقديمي" : "Presentation"}
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4 bg-teal-500/90 text-white text-xs px-3 py-1 rounded-full">
            {presentation.forBeginners
              ? language === "ar"
                ? "للعامة"
                : "Beginners"
              : ""}
            {presentation.forBeginners && presentation.forProfessionals
              ? " • "
              : ""}
            {presentation.forProfessionals
              ? language === "ar"
                ? "للمحترفين"
                : "Professionals"
              : ""}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Presentation Header */}
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-green-600 p-2 rounded-lg mr-3 rtl:mr-0 rtl:ml-3 group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <Presentation className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Clock className="h-3 w-3" />{" "}
                {new Date(presentation.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Presentation Title */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300 line-clamp-2">
            {language === "ar" ? presentation.nameAr : presentation.nameEn || presentation.nameAr}
          </h3>

          {/* Presentation Summary */}
          <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {language === "ar" ? presentation.summaryAr : presentation.summaryEn || presentation.summaryAr}
          </div>

          {/* Presentation Footer */}
          <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-green-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-teal-400">
            <span className="mr-2 rtl:mr-0 rtl:ml-2">
              {language === "ar" ? "عرض العرض" : "View Presentation"}
            </span>
            {isRtl ? (
              <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
            ) : (
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}