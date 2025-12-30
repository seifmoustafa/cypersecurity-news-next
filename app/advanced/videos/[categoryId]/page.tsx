"use client"

import { useEffect, useState, use } from "react"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { ApiVideo, VideoCategory } from "@/core/domain/models/media"
import { Play, ArrowRight, ArrowLeft, Search, X, Clock, Image as ImageIcon, Video } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import VideoImageCarousel from "@/components/video-image-carousel"
import { CommentSection } from "@/components/video/comments"

export default function VideoCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
      const resolvedParams = use(params)
      const { language, isRtl } = useLanguage()
      const [videos, setVideos] = useState<ApiVideo[]>([])
      const [category, setCategory] = useState<VideoCategory | null>(null)
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
      const [searchQuery, setSearchQuery] = useState("")
      const debouncedSearch = useDebounce(searchQuery, 500)
      const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)
      const [showCarousel, setShowCarousel] = useState(false)
      const [currentPage, setCurrentPage] = useState(1)
      const [totalPages, setTotalPages] = useState(1)
      const pageSize = 12

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)
                        setError(null)

                        // Fetch all categories to find the current one
                        const categoriesResponse = await container.services.media.getVideoCategoriesForProfessionals(1, 100)
                        const foundCategory = categoriesResponse.data.find((cat: VideoCategory) => cat.id === resolvedParams.categoryId)
                        if (foundCategory) {
                              setCategory(foundCategory)
                        }

                        // Fetch videos for this category
                        const videosResponse = await container.services.media.getVideosByCategoryForProfessionals(
                              resolvedParams.categoryId,
                              currentPage,
                              pageSize,
                              debouncedSearch
                        )
                        setVideos(videosResponse.data)
                        setTotalPages(videosResponse.pagination.pagesCount)
                  } catch (err) {
                        console.error("❌ Error fetching videos:", err)
                        setError(language === "ar" ? "حدث خطأ في تحميل الفيديوهات" : "Error loading videos")
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.categoryId, currentPage, debouncedSearch, language])

      const handleVideoClick = (index: number) => {
            setSelectedVideoIndex(index)
            setShowCarousel(true)
      }

      const handleCloseCarousel = () => {
            setShowCarousel(false)
            setSelectedVideoIndex(null)
      }

      const handleCarouselItemChange = (item: any, index: number) => {
            setSelectedVideoIndex(index)
      }

      // Check if URL is valid
      const isValidUrl = (url: string | null | undefined): boolean => {
            if (!url || typeof url !== "string") return false
            const trimmed = url.trim()
            return trimmed !== "" && trimmed !== "null" && trimmed !== "undefined"
      }

      const categoryName = category
            ? (language === "ar" ? category.name : category.nameEn || category.name)
            : (language === "ar" ? "فيديوهات" : "Videos")

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                                    { label: language === "ar" ? "الفيديوهات" : "Videos" },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {Array.from({ length: 6 }).map((_, i) => (
                                                <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </div>
            )
      }

      if (error) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                                    { label: language === "ar" ? "الفيديوهات" : "Videos" },
                                    { label: language === "ar" ? "خطأ" : "Error" }
                              ]} />
                              <div className="text-center py-16">
                                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">{error}</p>
                                    <Button onClick={() => window.location.reload()} className="mt-4">
                                          {language === "ar" ? "إعادة المحاولة" : "Retry"}
                                    </Button>
                              </div>
                        </div>
                  </div>
            )
      }

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                              { label: language === "ar" ? "الفيديوهات" : "Videos" },
                              { label: categoryName }
                        ]} />

                        {/* Page Header */}
                        <div className="mt-8 mb-8">
                              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    {categoryName}
                              </h1>
                              <p className="text-gray-600 dark:text-gray-400">
                                    {language === "ar"
                                          ? `${videos.length} فيديو متاح`
                                          : `${videos.length} videos available`}
                              </p>
                        </div>

                        {/* Search Section */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
                              <div className="flex items-center gap-4" dir={isRtl ? "rtl" : "ltr"}>
                                    <div className="relative flex-1">
                                          <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRtl ? "right-3" : "left-3"}`} />
                                          <input
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder={language === "ar" ? "ابحث في الفيديوهات..." : "Search videos..."}
                                                className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white`}
                                          />
                                          {searchQuery && (
                                                <button
                                                      onClick={() => setSearchQuery("")}
                                                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRtl ? "left-3" : "right-3"}`}
                                                >
                                                      <X className="h-5 w-5" />
                                                </button>
                                          )}
                                    </div>
                                    <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-3 rounded-xl">
                                          <Video className="h-6 w-6 text-white" />
                                    </div>
                              </div>
                        </div>

                        {/* Videos Grid or Carousel */}
                        {showCarousel && selectedVideoIndex !== null ? (
                              <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                                    <VideoImageCarousel
                                          items={videos.map((v) => ({
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
                                                      onClick={handleCloseCarousel}
                                                      className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors duration-300"
                                                >
                                                      {isRtl ? <ArrowRight className="h-5 w-5 ml-2" /> : <ArrowLeft className="h-5 w-5 mr-2" />}
                                                      {language === "ar" ? "العودة للقائمة" : "Back to List"}
                                                </button>
                                          </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                                          <CommentSection videoId={videos[selectedVideoIndex].id} />
                                    </div>
                              </div>
                        ) : videos.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir={isRtl ? "rtl" : "ltr"}>
                                    {videos.map((video, index) => {
                                          const hasVideo = isValidUrl(video.videoUrl)
                                          const hasImage = isValidUrl(video.imageUrl)

                                          return (
                                                <button
                                                      key={video.id}
                                                      onClick={() => handleVideoClick(index)}
                                                      className="group w-full text-left"
                                                >
                                                      <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] h-full overflow-hidden">
                                                            {/* Video Thumbnail */}
                                                            <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-blue-600">
                                                                  {hasImage ? (
                                                                        <img
                                                                              src={video.imageUrl}
                                                                              alt={language === "ar" ? video.nameAr : video.nameEn || video.nameAr}
                                                                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                        />
                                                                  ) : (
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                                                                                    {hasVideo ? <Play className="h-12 w-12 text-white" /> : <ImageIcon className="h-12 w-12 text-white" />}
                                                                              </div>
                                                                        </div>
                                                                  )}

                                                                  {/* Play Button Overlay */}
                                                                  {hasVideo && (
                                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                                                                              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                                                                                    <Play className="h-8 w-8 text-blue-600 ml-1" />
                                                                              </div>
                                                                        </div>
                                                                  )}

                                                                  {/* Type Badge */}
                                                                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                                                        {hasVideo ? (
                                                                              <>
                                                                                    <Clock className="h-3 w-3" />
                                                                                    <span>{language === "ar" ? "فيديو" : "Video"}</span>
                                                                              </>
                                                                        ) : (
                                                                              <>
                                                                                    <ImageIcon className="h-3 w-3" />
                                                                                    <span>{language === "ar" ? "صورة" : "Image"}</span>
                                                                              </>
                                                                        )}
                                                                  </div>
                                                            </div>

                                                            {/* Content */}
                                                            <div className="p-6">
                                                                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                                                                        {language === "ar" ? video.nameAr : video.nameEn || video.nameAr}
                                                                  </h3>

                                                                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                                                                        {language === "ar" ? video.summaryAr : video.summaryEn || video.summaryAr}
                                                                  </p>

                                                                  <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                                                                        <span className={isRtl ? "ml-2" : "mr-2"}>
                                                                              {language === "ar" ? "مشاهدة الفيديو" : "Watch Video"}
                                                                        </span>
                                                                        {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </button>
                                          )
                                    })}
                              </div>
                        ) : (
                              <div className="text-center py-16">
                                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {debouncedSearch
                                                ? (language === "ar" ? "لا توجد فيديوهات تطابق البحث" : "No videos match your search")
                                                : (language === "ar" ? "لا توجد فيديوهات متاحة" : "No videos available")}
                                    </p>
                              </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && !showCarousel && (
                              <div className="flex justify-center gap-2 mt-8">
                                    <Button
                                          variant="outline"
                                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                          disabled={currentPage === 1}
                                    >
                                          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                                    </Button>
                                    <span className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border">
                                          {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                          variant="outline"
                                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                          disabled={currentPage === totalPages}
                                    >
                                          {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                                    </Button>
                              </div>
                        )}
                  </div>
            </div>
      )
}
