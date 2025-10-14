"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Video, X, Play, Clock, Calendar, Maximize2, Minimize2 } from "lucide-react"
import { container } from "@/core/di/container"
import type { ApiVideo } from "@/core/domain/models/media"

interface VideoModalProps {
  videoId: string | null
  isOpen: boolean
  onClose: () => void
}

export default function VideoModal({ videoId, isOpen, onClose }: VideoModalProps) {
  const { language } = useLanguage()
  const [video, setVideo] = useState<ApiVideo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return
      
      try {
        setLoading(true)
        setError(null)
        const videoData = await container.services.media.getApiVideoById(videoId)
        setVideo(videoData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }  
    }

    if (isOpen && videoId) {
      fetchVideo()
    }
  }, [videoId, isOpen])

  // Prevent page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleClose = () => {
    setVideo(null)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className={`relative bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'w-screen h-screen rounded-none' : 'w-full max-w-6xl mx-4'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-300"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={handleFullscreen}
          className="absolute top-4 right-16 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-300"
        >
          {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                {language === "ar" ? "جاري تحميل الفيديو..." : "Loading video..."}
              </p>
            </div>
          </div>
        ) : error || !video ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                {language === "ar" ? "حدث خطأ في تحميل الفيديو" : "Error loading video"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{error || "Video not found"}</p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-300"
              >
                {language === "ar" ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col ${isFullscreen ? 'h-full' : 'h-full'}`}>
            {/* Video Player */}
            <div className={`relative bg-gray-100 dark:bg-gray-800 w-full ${
              isFullscreen ? 'flex-1 max-h-[70vh] flex items-center justify-center' : 'h-96 flex items-center justify-center'
            }`}>
              {video.videoUrl ? (
                <video
                  controls
                  className={`${isFullscreen ? 'w-full h-full' : 'max-w-full max-h-full'} object-contain`}
                  poster={video.imageUrl}
                  autoPlay
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  {language === "ar" ? "متصفحك لا يدعم تشغيل الفيديو" : "Your browser does not support the video tag"}
                </video>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-16 w-16 text-white mx-auto mb-4" />
                    <p className="text-white text-lg">
                      {language === "ar" ? "لا يمكن تشغيل الفيديو" : "Video not available"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 dark:border-gray-600 "></div>

            {/* Video Info */}
            <div className={`p-6 bg-gradient-to-b from-white via-gray-50/50 to-gray-100 dark:from-slate-800 dark:via-slate-700/50 dark:to-slate-900 ${
              isFullscreen ? 'flex-1 overflow-y-auto' : 'flex-shrink-0 min-h-0 overflow-y-auto'
            }`}>
              {/* Video Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-teal-600 p-2.5 rounded-lg shadow-lg">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(video.createdAt).toLocaleDateString()}
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
                  {video.forBeginners && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                      {language === "ar" ? "لغير المتخصصين" : "Beginners"}
                    </span>
                  )}
                  {video.forProfessionals && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                      {language === "ar" ? "للمحترفين" : "Professionals"}
                    </span>
                  )}
                </div>
              </div>

              {/* Video Title */}
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                {language === "ar" ? video.nameAr : video.nameEn || video.nameAr}
              </h1>

              {/* Video Summary */}
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                {language === "ar" ? video.summaryAr : video.summaryEn || video.summaryAr}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
