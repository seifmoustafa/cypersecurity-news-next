"use client";

import { use, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { useVideoCategoriesForProfessionals } from "@/core/hooks/use-video-categories-for-professionals";
import { useVideosByCategoryForProfessionals } from "@/core/hooks/use-videos-by-category-for-professionals";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Video,
  ArrowRight,
  ArrowLeft,
  Search,
  Play,
  Image as ImageIcon,
} from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import VideoImageCarousel from "@/components/video-image-carousel";
import { CommentSection } from "@/components/video/comments";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";

interface VideoCategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default function VideoCategoryPage({ params }: VideoCategoryPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentItemHasVideo, setCurrentItemHasVideo] = useState(true);
  const debouncedQuery = useDebounce(query, 500);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Fetch videos using client-side hook
  const { videos, loading, error, pagination } = useVideosByCategoryForProfessionals(
    resolvedParams.categoryId,
    currentPage,
    12,
    debouncedQuery
  );

  // Fetch categories for breadcrumb and category info
  const { categories: allCategories, loading: categoriesLoading } = useVideoCategoriesForProfessionals(1, 100);

  // Find current category
  const category = allCategories.find((cat) => cat.id === resolvedParams.categoryId);
  const categoryName = category
    ? language === "ar"
      ? category.name
      : category.nameEn || category.name
    : language === "ar"
      ? "فئة فيديوهات"
      : "Video Category";

  const isValidUrl = (url: string | null | undefined): boolean => {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    return trimmed !== "" && trimmed !== "null" && trimmed !== "undefined";
  };

  const handleVideoClick = (videoIndex: number) => {
    setSelectedVideoIndex(videoIndex);
    setShowCarousel(true);
    const video = videos[videoIndex];
    setCurrentItemHasVideo(isValidUrl(video?.videoUrl));
  };

  const handleCloseCarousel = () => {
    setShowCarousel(false);
    setSelectedVideoIndex(null);
  };

  const handleCarouselItemChange = (item: any, index: number) => {
    setSelectedVideoIndex(index);
    setCurrentItemHasVideo(isValidUrl(item?.videoUrl));
  };

  // Loading state
  if (loading || categoriesLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-red-500 py-12">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p>{language === "ar" ? "حدث خطأ في تحميل الفيديوهات" : "Error loading videos"}</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        {/* Cybersecurity Pattern Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container relative mx-auto px-4 py-6 md:py-8" dir={isRtl ? "rtl" : "ltr"}>
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: isRtl ? "الرئيسية" : "Home", href: "/advanced" },
                { label: isRtl ? "المكتبة" : "Library", href: "/advanced#media" },
                { label: isRtl ? "الفيديوهات" : "Videos", href: "/advanced#media" },
                { label: categoryName, href: "#" },
              ]}
            />
          </div>

          {/* Header with Search */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#00A4EF] to-[#0078D4] shadow-lg">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {categoryName}
                </h1>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search
                  className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRtl ? "right-3" : "left-3"
                    }`}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isRtl ? "ابحث في الفيديوهات..." : "Search videos..."}
                  className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
                    } py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00A4EF]/30 focus:border-[#00A4EF] transition-all`}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {isRtl ? "لا توجد فيديوهات" : "No videos found"}
              </p>
            </div>
          ) : showCarousel && selectedVideoIndex !== null ? (
            /* Video Carousel View (Inline - like simple layout) */
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
                      {currentItemHasVideo ? (
                        <Video className="h-6 w-6 text-white" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {currentItemHasVideo
                          ? isRtl
                            ? "مشغل الفيديوهات"
                            : "Video Player"
                          : isRtl
                            ? "مشغل الصور"
                            : "Image Viewer"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {currentItemHasVideo
                          ? isRtl
                            ? "استخدم الأسهم للتنقل بين الفيديوهات"
                            : "Use arrows to navigate between videos"
                          : isRtl
                            ? "استخدم الأسهم للتنقل بين الصور"
                            : "Use arrows to navigate between images"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseCarousel}
                    className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors duration-300"
                  >
                    {isRtl ? (
                      <ArrowRight className="h-5 w-5 mr-2" />
                    ) : (
                      <ArrowLeft className="h-5 w-5 mr-2" />
                    )}
                    {isRtl ? "العودة للقائمة" : "Back to List"}
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                <CommentSection videoId={videos[selectedVideoIndex].id} />
              </div>
            </div>
          ) : (
            /* Videos Grid */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoClick(index)}
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      {video.imageUrl ? (
                        <img
                          src={video.imageUrl}
                          alt={isRtl ? video.nameAr : video.nameEn || video.nameAr}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {isRtl ? video.nameAr : video.nameEn || video.nameAr}
                      </h3>
                      {video.summaryAr && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {isRtl ? video.summaryAr : video.summaryEn || video.summaryAr}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.itemsCount > pagination.pageSize && (
                <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => router.push(`/advanced/videos/${resolvedParams.categoryId}?page=${currentPage - 1}`)}
                  >
                    {isRtl ? "السابق" : "Previous"}
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
                    {currentPage} / {Math.ceil(pagination.itemsCount / pagination.pageSize)}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage >= Math.ceil(pagination.itemsCount / pagination.pageSize)}
                    onClick={() => router.push(`/advanced/videos/${resolvedParams.categoryId}?page=${currentPage + 1}`)}
                  >
                    {isRtl ? "التالي" : "Next"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}