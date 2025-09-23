"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import MainLayout from "@/components/layouts/main-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, Play, ArrowLeft, ArrowRight } from "lucide-react"
import { container } from "@/core/di/container"
import type { ApiVideo } from "@/core/domain/models/media"

interface VideosPageClientProps {
  initialVideos: ApiVideo[]
  initialPagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
  initialSearch: string
  initialPage: number
}

export default function VideosPageClient({
  initialVideos,
  initialPagination,
  initialSearch,
  initialPage,
}: VideosPageClientProps) {
  const { t, language, isRtl } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [videos, setVideos] = useState<ApiVideo[]>(initialVideos)
  const [pagination, setPagination] = useState(initialPagination)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<ApiVideo | null>(null)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string, page: number) => {
      fetchVideos(term, page)
    }, 500),
    [],
  )

  // Fetch videos function
  const fetchVideos = async (search = "", page = 1) => {
    try {
      setLoading(true)
      const response = await container.services.media.getVideos(page, 12, search)
      setVideos(response.data)
      setPagination(response.pagination)

      // Update URL
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (page > 1) params.set("page", page.toString())

      const newUrl = params.toString() ? `/videos?${params.toString()}` : "/videos"
      router.replace(newUrl, { scroll: false })
    } catch (error) {
      console.error("Error fetching videos:", error)
      setVideos([])
      setPagination({
        itemsCount: 0,
        pagesCount: 0,
        pageSize: 12,
        currentPage: 1,
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    debouncedSearch(value, 1)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchVideos(searchTerm, page)
  }

  // Get video URL with proper base URL
  const getVideoUrl = (videoUrl: string) => {
    if (!videoUrl) return ""
    if (videoUrl.startsWith("http")) return videoUrl

    // Remove /api from base URL and add video URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
    const cleanBaseUrl = baseUrl.replace("/api", "")
    return `${cleanBaseUrl}${videoUrl}`
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/#media")} className="group">
              {isRtl ? (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              ) : (
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              )}
              <span className={isRtl ? "mr-2" : "ml-2"}>{t("media.backToMedia")}</span>
            </Button>
          </div>

          <h1 className={`text-3xl font-bold mb-2 ${isRtl ? "text-right" : "text-left"}`}>{t("media.videos")}</h1>
          <p className={`text-muted-foreground ${isRtl ? "text-right" : "text-left"}`}>
            {t("media.videosDescription")}
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${
                isRtl ? "right-3" : "left-3"
              }`}
            />
            <Input
              type="text"
              placeholder={t("common.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={isRtl ? "pr-10" : "pl-10"}
            />
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pagesCount > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                </Button>

                <span className="text-sm text-muted-foreground px-4">
                  {t("common.pageOf")}{" "}{currentPage}{t("common.of")}{" "}{pagination.pagesCount}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.pagesCount}
                >
                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">{searchTerm ? t("common.noSearchResults") : t("media.noVideos")}</p>
              {searchTerm && <p className="text-sm mt-2">{t("common.tryDifferentSearch")}</p>}
            </div>
          </div>
        )}

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
                <video
                  width="100%"
                  height="100%"
                  controls
                  className="w-full h-full"
                  src={getVideoUrl(selectedVideo.videoUrl)}
                >
                  {t("media.noVideoSupport")}
                </video>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  )
}

// Video Card Component
const VideoCard = ({
  video,
  onClick,
}: {
  video: ApiVideo
  onClick: (video: ApiVideo) => void
}) => {
  const { t,language, isRtl } = useLanguage()

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
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg border border-border/50 overflow-hidden rounded-lg bg-card"
      onClick={() => onClick(video)}
    >
      <div className="relative aspect-video overflow-hidden bg-muted flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
        <Play className="h-12 w-12 text-white/80 group-hover:text-white transition-colors" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-xs font-medium text-white bg-primary/80 px-2 py-1 rounded">{t("media.videoLabel")}</span>
          <span className="text-xs text-white/90">{formatDate(video.createdAt)}</span>
        </div>
      </div>
      <div className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
        <h3 className="font-bold text-base mb-2 line-clamp-2">
          {language === "ar" ? video.nameAr || video.nameEn : video.nameEn || video.nameAr}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {language === "ar" ? video.summaryAr || video.summaryEn : video.summaryEn || video.summaryAr}
        </p>
      </div>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
