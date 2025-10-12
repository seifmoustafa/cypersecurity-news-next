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
import { ArrowRight, ArrowLeft, Play, BookOpen, Presentation, Calendar, Clock, X, Maximize2, Minimize2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useVideoCategoriesForProfessionals } from "@/core/hooks/use-video-categories-for-professionals"
import { useVideosByCategoryForProfessionals } from "@/core/hooks/use-videos-by-category-for-professionals"
import { useLectureCategoriesForProfessionals } from "@/core/hooks/use-lecture-categories-for-professionals"
import { useLecturesByCategoryForProfessionals } from "@/core/hooks/use-lectures-by-category-for-professionals"
import { useDebounce } from "@/hooks/use-debounce"

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
  const [selectedVideo, setSelectedVideo] = useState<ApiVideo | null>(null)
  const [activeVideoCategory, setActiveVideoCategory] = useState<string | null>(null)
  const [activeLectureCategory, setActiveLectureCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 500)

  // Video categories for professionals
  const { categories: videoCategories, loading: videoCategoriesLoading } = useVideoCategoriesForProfessionals(1, 100, debouncedSearch)
  
  // Videos for selected category
  const { videos: categoryVideos, loading: categoryVideosLoading } = useVideosByCategoryForProfessionals(
    activeVideoCategory || "",
    1,
    100,
    debouncedSearch
  )

  // Lecture categories for professionals
  const { categories: lectureCategories, loading: lectureCategoriesLoading } = useLectureCategoriesForProfessionals(1, 100, debouncedSearch)
  
  // Lectures for selected category
  const { lectures: categoryLectures, loading: categoryLecturesLoading } = useLecturesByCategoryForProfessionals(
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
        const response = await container.services.media.getVideos(1, 6) // Get first 6 videos
        setVideos(response.data)
      } catch (error) {
        console.error("Error fetching videos:", error)
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
        const response = await container.services.media.getLectures(1, 6) // Get first 6 lectures
        setLectures(response.data)
      } catch (error) {
        console.error("Error fetching lectures:", error)
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
        const response = await container.services.media.getPresentations(1, 6) // Get first 6 presentations
        setPresentations(response.data)
      } catch (error) {
        console.error("Error fetching presentations:", error)
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

  return (
    <SectionContainer id="media" className="bg-gradient-to-br from-blue-50/50 via-white to-violet-50/30 dark:from-blue-950/30 dark:via-slate-900 dark:to-violet-950/20">
      <SectionHeader title={t("section.media")} subtitle={t("media.subtitle")} />

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
          {videoCategories.length > 0 && (
            <div className="mb-8">
              <div className="flex overflow-x-auto pb-2 mb-6 justify-center">
                {videoCategoriesLoading ? (
                  <div className="flex space-x-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex-shrink-0 w-32 h-12 bg-muted rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : (
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
                )}
              </div>

              {/* Videos for Selected Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
                {categoryVideosLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  ))
                ) : categoryVideos.length > 0 ? (
                  categoryVideos.map((video) => <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />)
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">{t("media.noVideos")}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {videoCategories.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={() => router.push(`/advanced/videos/${activeVideoCategory}`)} 
                className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/40 border border-blue-500/30 dark:border-blue-400/30"
              >
                {t("common.viewAll")}
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
          {lectureCategories.length > 0 && (
            <div className="mb-8">
              <div className="flex overflow-x-auto pb-2 mb-6 justify-center">
                {lectureCategoriesLoading ? (
                  <div className="flex space-x-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex-shrink-0 w-32 h-12 bg-muted rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : (
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
                )}
              </div>

              {/* Lectures for Selected Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
                {categoryLecturesLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  ))
                ) : categoryLectures.length > 0 ? (
                  categoryLectures.map((lecture) => <LectureCard key={lecture.id} lecture={lecture} />)
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">{t("media.noLectures")}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {lectureCategories.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={() => router.push(`/advanced/lectures/${activeLectureCategory}`)} 
                className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/40 border border-blue-500/30 dark:border-blue-400/30"
              >
                {t("common.viewAll")}
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

      {/* Video Dialog */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
          <DialogContent className="max-w-6xl p-0 overflow-hidden rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl">
            <DialogTitle className="sr-only">
              {getLocalizedText(language, selectedVideo.nameAr, selectedVideo.nameEn)}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {getLocalizedText(language, selectedVideo.summaryAr, selectedVideo.summaryEn)}
            </DialogDescription>
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex flex-col h-full">
              {/* Video Player */}
              <div className="relative bg-gray-100 dark:bg-gray-800 w-full h-96 flex items-center justify-center">
                {selectedVideo.videoUrl ? (
                  <video
                    controls
                    className="max-w-full max-h-full object-contain"
                    poster={selectedVideo.imageUrl}
                    autoPlay
                  >
                    <source src={selectedVideo.videoUrl} type="video/mp4" />
                    {language === "ar" ? "متصفحك لا يدعم تشغيل الفيديو" : "Your browser does not support the video tag"}
                  </video>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-white mx-auto mb-4" />
                      <p className="text-white text-lg">
                        {language === "ar" ? "لا يمكن تشغيل الفيديو" : "Video not available"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300 dark:border-gray-600"></div>

              {/* Video Info */}
              <div className="p-6 bg-gradient-to-b from-white via-gray-50/50 to-gray-100 dark:from-slate-800 dark:via-slate-700/50 dark:to-slate-900 flex-shrink-0">
                {/* Video Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-teal-600 p-2.5 rounded-lg shadow-lg">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(selectedVideo.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {language === "ar" ? "فيديو تعليمي" : "Educational Video"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Target Audience Badges */}
                  <div className="flex gap-2">
                    {selectedVideo.forBeginners && (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                        {language === "ar" ? "للعامة" : "Beginners"}
                      </span>
                    )}
                    {selectedVideo.forProfessionals && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        {language === "ar" ? "للمحترفين" : "Professionals"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Video Title */}
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  {getLocalizedText(language, selectedVideo.nameAr, selectedVideo.nameEn)}
                </h1>

                {/* Video Summary */}
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {getLocalizedText(language, selectedVideo.summaryAr, selectedVideo.summaryEn)}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </SectionContainer>
  )
}

// Enhanced Video Card Component for API videos
const VideoCard = ({ video, onClick }: { video: ApiVideo; onClick: (video: ApiVideo) => void }) => {
  const { language, isRtl } = useLanguage()

  const handleCardClick = () => {
    onClick(video)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US")
  }

  return (
    <div
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 border border-blue-200/30 dark:border-blue-800/30 overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/50 dark:to-violet-900/50">
        {video.imageUrl ? (
          <img 
            src={video.imageUrl} 
            alt={getLocalizedText(language, video.nameAr, video.nameEn)}
            className="w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-600/90 dark:bg-blue-700/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400/50 dark:border-blue-300/50 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/40 group-hover:scale-110 transition-transform duration-300">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-33 right-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-white bg-blue-600/95 dark:bg-blue-700/95 px-3 py-1.5 rounded-full backdrop-blur-sm border border-blue-400/50 dark:border-blue-300/50 shadow-lg">
            Video
          </span>
          <span className="text-xs text-white/90 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
            {formatDate(video.createdAt)}
          </span>
        </div>
      </div>
      <div className={`p-6 ${isRtl ? "text-right" : "text-left"}`}>
        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {getLocalizedText(language, video.nameAr, video.nameEn)}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {getLocalizedText(language, video.summaryAr, video.summaryEn)}
        </p>
      </div>
    </div>
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US")
  }

  return (
    <div
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 border border-blue-200/30 dark:border-blue-800/30 overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/50 dark:to-violet-900/50 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-blue-600/90 dark:bg-blue-700/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400/50 dark:border-blue-300/50 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/40 group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-white bg-blue-600/95 dark:bg-blue-700/95 px-3 py-1.5 rounded-full backdrop-blur-sm border border-blue-400/50 dark:border-blue-300/50 shadow-lg">
            Lecture
          </span>
          <span className="text-xs text-white/90 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
            {formatDate(lecture.createdAt)}
          </span>
        </div>
      </div>
      <div className={`p-6 ${isRtl ? "text-right" : "text-left"}`}>
        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {getLocalizedText(language, lecture.nameAr, lecture.nameEn)}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {getLocalizedText(language, lecture.summaryAr, lecture.summaryEn)}
        </p>
      </div>
    </div>
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US")
  }

  return (
    <div
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 border border-blue-200/30 dark:border-blue-800/30 overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/50 dark:to-violet-900/50 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-blue-600/90 dark:bg-blue-700/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400/50 dark:border-blue-300/50 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/40 group-hover:scale-110 transition-transform duration-300">
            <Presentation className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-white bg-blue-600/95 dark:bg-blue-700/95 px-3 py-1.5 rounded-full backdrop-blur-sm border border-blue-400/50 dark:border-blue-300/50 shadow-lg">
            Presentation
          </span>
          <span className="text-xs text-white/90 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
            {formatDate(presentation.createdAt)}
          </span>
        </div>
      </div>
      <div className={`p-6 ${isRtl ? "text-right" : "text-left"}`}>
        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {getLocalizedText(language, presentation.nameAr, presentation.nameEn)}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {getLocalizedText(language, presentation.summaryAr, presentation.summaryEn)}
        </p>
      </div>
    </div>
  )
}