"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { container } from "@/core/di/container"
import type { ApiVideo, ApiLecture, ApiPresentation } from "@/core/domain/models/media"
import { slugify, getLocalizedText } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Play, BookOpen, Presentation } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"

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

  // Check URL for tab parameter on mount
  useEffect(() => {
    const tabParam = searchParams?.get("tab")
    if (tabParam && ["videos", "lectures", "presentations"].includes(tabParam)) {
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
    router.prefetch("/videos")
    router.prefetch("/lectures")
    router.prefetch("/presentations")
  }, [router])

  return (
    <SectionContainer id="media" className="bg-gradient-to-br from-purple-50/50 via-white to-violet-50/30 dark:from-purple-950/30 dark:via-slate-900 dark:to-violet-950/20">
      <SectionHeader title={t("section.media")} subtitle={t("media.subtitle")} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`w-full max-w-2xl mx-auto mb-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
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
          <TabsTrigger value="presentations" className="flex-1 font-semibold transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2">
              <Presentation className="h-4 w-4" />
              {t("media.presentations")}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
            {videosLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ))
            ) : videos.length > 0 ? (
              videos.map((video) => <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />)
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">{t("media.noVideos")}</p>
              </div>
            )}
          </div>

          {videos.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={() => router.push("/advanced/videos")} 
                className="group bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/30 dark:shadow-purple-500/40 border border-purple-500/30 dark:border-purple-400/30"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
            {lecturesLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ))
            ) : lectures.length > 0 ? (
              lectures.map((lecture) => <LectureCard key={lecture.id} lecture={lecture} />)
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">{t("media.noLectures")}</p>
              </div>
            )}
          </div>

          {lectures.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={() => router.push("/advanced/lectures")} 
                className="group bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/30 dark:shadow-purple-500/40 border border-purple-500/30 dark:border-purple-400/30"
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

        <TabsContent value="presentations" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
            {presentationsLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ))
            ) : presentations.length > 0 ? (
              presentations.map((presentation) => (
                <PresentationCard key={presentation.id} presentation={presentation} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">{t("media.noPresentations")}</p>
              </div>
            )}
          </div>

          {presentations.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={() => router.push("/advanced/presentations")} 
                className="group bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/30 dark:shadow-purple-500/40 border border-purple-500/30 dark:border-purple-400/30"
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
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <DialogTitle className="sr-only">
              {getLocalizedText(language, selectedVideo.nameAr, selectedVideo.nameEn)}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {getLocalizedText(language, selectedVideo.summaryAr, selectedVideo.summaryEn)}
            </DialogDescription>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {getLocalizedText(language, selectedVideo.nameAr, selectedVideo.nameEn)}
              </h2>
              <p className="text-muted-foreground mb-4">
                {getLocalizedText(language, selectedVideo.summaryAr, selectedVideo.summaryEn)}
              </p>
            </div>
            <div className="aspect-video w-full">
              <video width="100%" height="100%" controls className="w-full h-full" src={selectedVideo.videoUrl}>
                Your browser does not support the video tag.
              </video>
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
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 border border-purple-200/30 dark:border-purple-800/30 overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-purple-600/90 dark:bg-purple-700/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-400/50 dark:border-purple-300/50 shadow-xl shadow-purple-500/30 dark:shadow-purple-500/40 group-hover:scale-110 transition-transform duration-300">
            <Play className="h-8 w-8 text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-white bg-purple-600/95 dark:bg-purple-700/95 px-3 py-1.5 rounded-full backdrop-blur-sm border border-purple-400/50 dark:border-purple-300/50 shadow-lg">
            Video
          </span>
          <span className="text-xs text-white/90 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
            {formatDate(video.createdAt)}
          </span>
        </div>
      </div>
      <div className={`p-6 ${isRtl ? "text-right" : "text-left"}`}>
        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
          {getLocalizedText(language, video.nameAr, video.nameEn)}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {getLocalizedText(language, video.summaryAr, video.summaryEn)}
        </p>
      </div>
    </div>
  )
}

// Enhanced Lecture Card Component for API lectures with slug-based navigation
const LectureCard = ({ lecture }: { lecture: ApiLecture }) => {
  const { language, isRtl } = useLanguage()
  const router = useRouter()

  const handleCardClick = () => {
    const englishTitle = lecture.nameEn || ""
    const slug = slugify(englishTitle, lecture.id)
    router.push(`/lectures/${slug}`)
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
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 border border-purple-200/30 dark:border-purple-800/30 overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-purple-600/90 dark:bg-purple-700/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-400/50 dark:border-purple-300/50 shadow-xl shadow-purple-500/30 dark:shadow-purple-500/40 group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-white bg-purple-600/95 dark:bg-purple-700/95 px-3 py-1.5 rounded-full backdrop-blur-sm border border-purple-400/50 dark:border-purple-300/50 shadow-lg">
            Lecture
          </span>
          <span className="text-xs text-white/90 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
            {formatDate(lecture.createdAt)}
          </span>
        </div>
      </div>
      <div className={`p-6 ${isRtl ? "text-right" : "text-left"}`}>
        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
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
    router.push(`/presentations/${slug}`)
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
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 border border-purple-200/30 dark:border-purple-800/30 overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-purple-600/90 dark:bg-purple-700/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-400/50 dark:border-purple-300/50 shadow-xl shadow-purple-500/30 dark:shadow-purple-500/40 group-hover:scale-110 transition-transform duration-300">
            <Presentation className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-white bg-purple-600/95 dark:bg-purple-700/95 px-3 py-1.5 rounded-full backdrop-blur-sm border border-purple-400/50 dark:border-purple-300/50 shadow-lg">
            Presentation
          </span>
          <span className="text-xs text-white/90 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
            {formatDate(presentation.createdAt)}
          </span>
        </div>
      </div>
      <div className={`p-6 ${isRtl ? "text-right" : "text-left"}`}>
        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
          {getLocalizedText(language, presentation.nameAr, presentation.nameEn)}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {getLocalizedText(language, presentation.summaryAr, presentation.summaryEn)}
        </p>
      </div>
    </div>
  )
}
