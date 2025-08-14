"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { container } from "@/core/di/container"
import type { ApiVideo, ApiLecture, ApiPresentation } from "@/core/domain/models/media"
import { slugify } from "@/lib/utils"
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
    <SectionContainer id="media">
      <SectionHeader title={t("section.media")} subtitle={t("media.subtitle")} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`w-full max-w-md mx-auto mb-8 ${isRtl ? "flex-row-reverse" : ""}`}>
          <TabsTrigger value="videos" className="flex-1">
            {t("media.videos")}
          </TabsTrigger>
          <TabsTrigger value="lectures" className="flex-1">
            {t("media.lectures")}
          </TabsTrigger>
          <TabsTrigger value="presentations" className="flex-1">
            {t("media.presentations")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="flex justify-center mt-8">
              <Button onClick={() => router.push("/videos")} variant="outline" className="group">
                {t("common.viewAll")}
                {isRtl ? (
                  <ArrowLeft className="ml-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="lectures" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="flex justify-center mt-8">
              <Button onClick={() => router.push("/lectures")} variant="outline" className="group">
                {t("common.viewAll")}
                {isRtl ? (
                  <ArrowLeft className="ml-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="presentations" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="flex justify-center mt-8">
              <Button onClick={() => router.push("/presentations")} variant="outline" className="group">
                {t("common.viewAll")}
                {isRtl ? (
                  <ArrowLeft className="ml-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
              {language === "ar" ? selectedVideo.nameAr : selectedVideo.nameEn}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {language === "ar" ? selectedVideo.summaryAr : selectedVideo.summaryEn}
            </DialogDescription>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {language === "ar" ? selectedVideo.nameAr : selectedVideo.nameEn}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === "ar" ? selectedVideo.summaryAr : selectedVideo.summaryEn}
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

// Video Card Component for API videos
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
      className="card group cursor-pointer transition-all duration-300 hover:shadow-lg border border-border/50 overflow-hidden rounded-lg bg-card"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden bg-muted flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
        <Play className="h-12 w-12 text-white/80 group-hover:text-white transition-colors" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-xs font-medium text-white bg-primary/80 px-2 py-1 rounded">Video</span>
          <span className="text-xs text-white/90">{formatDate(video.createdAt)}</span>
        </div>
      </div>
      <div className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
        <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2">
          {language === "ar" ? video.nameAr : video.nameEn}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {language === "ar" ? video.summaryAr : video.summaryEn}
        </p>
      </div>
    </div>
  )
}

// Lecture Card Component for API lectures with slug-based navigation
const LectureCard = ({ lecture }: { lecture: ApiLecture }) => {
  const { language, isRtl } = useLanguage()
  const router = useRouter()

  const handleCardClick = () => {
    const englishTitle = lecture.nameEn || ""
    const slug = slugify(englishTitle)
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
      className="card group cursor-pointer transition-all duration-300 hover:shadow-lg border border-border/50 overflow-hidden rounded-lg bg-card"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden bg-muted flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
        <BookOpen className="h-12 w-12 text-white/80 group-hover:text-white transition-colors" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-xs font-medium text-white bg-primary/80 px-2 py-1 rounded">Lecture</span>
          <span className="text-xs text-white/90">{formatDate(lecture.createdAt)}</span>
        </div>
      </div>
      <div className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
        <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2">
          {language === "ar" ? lecture.nameAr : lecture.nameEn}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {language === "ar" ? lecture.summaryAr : lecture.summaryEn}
        </p>
      </div>
    </div>
  )
}

// Presentation Card Component for API presentations with slug-based navigation
const PresentationCard = ({ presentation }: { presentation: ApiPresentation }) => {
  const { language, isRtl } = useLanguage()
  const router = useRouter()

  const handleCardClick = () => {
    const englishTitle = presentation.nameEn || ""
    const slug = slugify(englishTitle)
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
      className="card group cursor-pointer transition-all duration-300 hover:shadow-lg border border-border/50 overflow-hidden rounded-lg bg-card"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden bg-muted flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
        <Presentation className="h-12 w-12 text-white/80 group-hover:text-white transition-colors" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-xs font-medium text-white bg-primary/80 px-2 py-1 rounded">Presentation</span>
          <span className="text-xs text-white/90">{formatDate(presentation.createdAt)}</span>
        </div>
      </div>
      <div className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
        <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2">
          {language === "ar" ? presentation.nameAr : presentation.nameEn}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {language === "ar" ? presentation.summaryAr : presentation.summaryEn}
        </p>
      </div>
    </div>
  )
}
