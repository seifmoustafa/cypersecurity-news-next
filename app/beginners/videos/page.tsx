"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { 
  Video, 
  Play, 
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Clock,
  Eye,
  Star,
  Download,
  Share2,
  Bookmark
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { container } from "@/core/di/container"

interface VideoItem {
  id: string
  title: string
  description: string
  duration: string
  views: number
  rating: number
  thumbnail: string
  url: string
  category: string
  createdAt: string
}

export default function BeginnersVideosPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        // Fetch real videos from backend
        const mediaData = await container.services.media.getAllMedia(1, 50)
        const videoItems = mediaData
          ?.filter((item: any) => item.type === 'video')
          ?.map((item: any) => ({
            id: item.id,
            title: item.title?.[language] || item.title || 'Untitled Video',
            description: item.description?.[language] || item.description || '',
            duration: item.duration || '0:00',
            views: item.views || 0,
            rating: item.rating || 4.5,
            thumbnail: item.thumbnail || '/placeholder.jpg',
            url: item.url || '#',
            category: item.category || 'general',
            createdAt: item.createdAt || new Date().toISOString()
          })) || []
        
        setVideos(videoItems)
      } catch (error) {
        console.error('Error fetching videos:', error)
        // Fallback to mock data
        setVideos([
          {
            id: '1',
            title: language === "ar" ? "مقدمة في الأمن السيبراني" : "Introduction to Cybersecurity",
            description: language === "ar" ? "تعلم أساسيات الأمن السيبراني من الصفر" : "Learn cybersecurity fundamentals from scratch",
            duration: "15:30",
            views: 2500,
            rating: 4.8,
            thumbnail: "/placeholder.jpg",
            url: "#",
            category: "general",
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: language === "ar" ? "كيفية إنشاء كلمة مرور قوية" : "How to Create Strong Passwords",
            description: language === "ar" ? "نصائح لإنشاء كلمات مرور آمنة" : "Tips for creating secure passwords",
            duration: "8:45",
            views: 1800,
            rating: 4.9,
            thumbnail: "/placeholder.jpg",
            url: "#",
            category: "security",
            createdAt: new Date().toISOString()
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [language])

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl blur-lg opacity-30"/>
              <div className="relative bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-xl">
                <Video className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === "ar" ? "الفيديوهات التعليمية" : "Educational Videos"}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {language === "ar" 
              ? "تعلم الأمن السيبراني من خلال فيديوهات تفاعلية ومبسطة"
              : "Learn cybersecurity through interactive and simplified videos"
            }
          </p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === "ar" ? "إجمالي الفيديوهات" : "Total Videos"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {videos.length} {language === "ar" ? "فيديو" : "videos"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === "ar" ? "محدث آخر مرة" : "Last updated"}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === "ar" ? "ابحث في الفيديوهات..." : "Search videos..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {language === "ar" ? "تصفية" : "Filter"}
              </Button>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:scale-105 will-change-transform"
                onMouseMove={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  const rect = el.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  const rotateX = ((y - rect.height / 2) / rect.height) * -3
                  const rotateY = ((x - rect.width / 2) / rect.width) * 3
                  el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)"
                }}
                style={{ transform: "perspective(900px)" }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.views.toLocaleString()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                    {video.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {video.rating}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white group/btn">
                    <span className="mr-2 rtl:mr-0 rtl:ml-2">
                      {language === "ar" ? "مشاهدة" : "Watch"}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                    ) : (
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {language === "ar" ? "لا توجد فيديوهات" : "No videos found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {language === "ar" ? "جرب البحث بكلمات مختلفة" : "Try searching with different keywords"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}