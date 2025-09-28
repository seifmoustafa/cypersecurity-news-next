"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Video, ArrowRight, ArrowLeft, Star, BookOpen, Play, Clock, Calendar, User } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { container } from "@/core/di/container"
import type { ApiVideo } from "@/core/domain/models/media"

interface VideoDetailPageProps {
  params: Promise<{
    id: string
    videoId: string
  }>
}

export default function VideoDetailPage({ params }: VideoDetailPageProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const isRtl = language === "ar"
  const [video, setVideo] = useState<ApiVideo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Unwrap the params Promise
  const resolvedParams = use(params)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        setError(null)
        const videoData = await container.services.media.getApiVideoById(resolvedParams.videoId)
        setVideo(videoData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (resolvedParams.videoId) {
      fetchVideo()
    }
  }, [resolvedParams.videoId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        {/* Cybersecurity Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "المكتبة الثقافية" : "Media Library", href: "/simple/media" },
              { label: language === "ar" ? "دروس تعليمية" : "Educational Lessons", href: "/simple/media/lessons" },
              { label: language === "ar" ? "الفيديوهات" : "Videos", href: "/simple/media/lessons/videos" },
              { label: language === "ar" ? "جاري التحميل..." : "Loading..." }
            ]} 
          />

          {/* Loading Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg p-8 animate-pulse">
              <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl mb-6"></div>
              <div className="space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {language === "ar" ? "حدث خطأ في تحميل الفيديو" : "Error loading video"}
          </h3>
          <p className="text-muted-foreground mb-4">{error || "Video not found"}</p>
          <Link
            href={`/simple/media/lessons/videos/${resolvedParams.id}`}
            className="inline-flex items-center px-6 py-3 bg-teal-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-300"
          >
            {language === "ar" ? "العودة للفيديوهات" : "Back to Videos"}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: language === "ar" ? "المكتبة الثقافية" : "Media Library", href: "/simple/media" },
            { label: language === "ar" ? "دروس تعليمية" : "Educational Lessons", href: "/simple/media/lessons" },
            { label: language === "ar" ? "الفيديوهات" : "Videos", href: "/simple/media/lessons/videos" },
            { label: language === "ar" ? "فئة الفيديوهات" : "Video Category", href: `/simple/media/lessons/videos/${resolvedParams.id}` },
            { label: language === "ar" ? video.nameAr : video.nameEn || video.nameAr }
          ]} 
        />

        {/* Video Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
            {/* Video Player */}
            <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-blue-600">
              {video.videoUrl ? (
                <video
                  controls
                  className="w-full h-full object-fill"
                  poster={video.imageUrl}
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

            {/* Video Info */}
            <div className="p-8">
              {/* Video Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-3 rounded-xl">
                    <Video className="h-6 w-6 text-white" />
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
                      {language === "ar" ? "للعامة" : "Beginners"}
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
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                {language === "ar" ? video.nameAr : video.nameEn || video.nameAr}
              </h1>

              {/* Video Summary */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {language === "ar" ? "ملخص الفيديو" : "Video Summary"}
                </h3>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {language === "ar" ? video.summaryAr : video.summaryEn || video.summaryAr}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <Link
                  href={`/simple/media/lessons/videos/${resolvedParams.id}`}
                  className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors duration-300"
                >
                  {isRtl ? (
                    <ArrowRight className="h-5 w-5 mr-2" />
                  ) : (
                    <ArrowLeft className="h-5 w-5 mr-2" />
                  )}
                  {language === "ar" ? "العودة للفيديوهات" : "Back to Videos"}
                </Link>
                
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-blue-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  {language === "ar" ? "إعادة تشغيل" : "Replay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
