"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import {
  Video,
  ArrowRight,
  ArrowLeft,
  Star,
  BookOpen,
  Search,
  Play,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import VideoImageCarousel from "@/components/video-image-carousel";
import { useVideosByCategory } from "@/core/hooks/use-videos-by-category";
import { useVideoCategories } from "@/core/hooks/use-video-categories";
import { useDebounce } from "@/hooks/use-debounce";

interface VideoCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function VideoCategoryPage({ params }: VideoCategoryPageProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const isRtl = language === "ar";
  const [query, setQuery] = useState("");
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(
    null
  );
  const [showCarousel, setShowCarousel] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  // Unwrap the params Promise
  const resolvedParams = use(params);
  const { videos, loading, error } = useVideosByCategory(
    resolvedParams.id,
    1,
    100,
    debouncedQuery
  );
  const { categories: allCategories } = useVideoCategories(1, 100);

  // Resolve current video category name for breadcrumbs
  const currentCategory = allCategories.find(
    (cat) => cat.id === resolvedParams.id
  );
  const categoryName = currentCategory
    ? language === "ar"
      ? currentCategory.name
      : currentCategory.nameEn || currentCategory.name
    : language === "ar"
    ? "فئة فيديوهات"
    : "Video Category";

  const handleVideoClick = (videoIndex: number) => {
    setSelectedVideoIndex(videoIndex);
    setShowCarousel(true);
  };

  const handleCloseCarousel = () => {
    setShowCarousel(false);
    setSelectedVideoIndex(null);
  };

  const handleCarouselItemChange = (item: any, index: number) => {
    setSelectedVideoIndex(index);
  };

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
              {
                label:
                  language === "ar" ? "الحماية الشخصية" : "Personal Protection",
                href: "/simple/personal-protect",
              },
              { label: language === "ar" ? "جاري التحميل..." : "Loading..." },
            ]}
          />

          {/* Search Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "ابحث في فيديوهات..."
                      : "Search videos..."
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                />
              </div>
              <div className="bg-gradient-to-rfrom-teal-500 to-blue-600 p-3 rounded-xl">
                <Video className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg h-[400px] animate-pulse"
              >
                <div className="p-8 space-y-4">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {language === "ar"
              ? "حدث خطأ في تحميل فيديوهات"
              : "Error loading videos"}
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
      </div>
    );
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
            {
              label:
                language === "ar" ? "الحماية الشخصية" : "Personal Protection",
              href: "/simple/personal-protect",
            },

            { label: categoryName },
          ]}
        />

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  language === "ar" ? "ابحث في فيديوهات..." : "Search videos..."
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-3 rounded-xl">
              <Video className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {debouncedQuery
                ? language === "ar"
                  ? "لا توجد فيديوهات تطابق البحث"
                  : "No videos match your search"
                : language === "ar"
                ? "لا توجد فيديوهات متاحة"
                : "No videos available"}
            </h3>
            <p className="text-muted-foreground">
              {debouncedQuery
                ? language === "ar"
                  ? "جرب البحث بكلمات مختلفة"
                  : "Try searching with different keywords"
                : language === "ar"
                ? "لم يتم العثور على أي فيديوهات في هذه الفئة"
                : "No videos found in this category"}
            </p>
          </div>
        ) : showCarousel && selectedVideoIndex !== null ? (
          /* Video/Image Carousel */
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
        ) : (
          /* Videos Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => handleVideoClick(index)}
                className="group w-full text-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden"
                  onMouseMove={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const rotateX = ((y - rect.height / 2) / rect.height) * -3;
                    const rotateY = ((x - rect.width / 2) / rect.width) * 3;
                    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform =
                      "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
                  }}
                  style={{ transform: "perspective(900px)" }}
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-blue-600">
                    {video.imageUrl ? (
                      <img
                        src={video.imageUrl}
                        alt={
                          language === "ar"
                            ? video.nameAr
                            : video.nameEn || video.nameAr
                        }
                        className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                          <Video className="h-12 w-12 text-white" />
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
                          ? "لغير المتخصصين"
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
                        <Video className="h-4 w-4 text-white" />
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
                      {language === "ar"
                        ? video.nameAr
                        : video.nameEn || video.nameAr}
                    </h3>

                    {/* Video Summary */}
                    <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                      {language === "ar"
                        ? video.summaryAr
                        : video.summaryEn || video.summaryAr}
                    </div>

                    {/* Video Footer */}
                    <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-blue-400">
                      <span className="mr-2 rtl:mr-0 rtl:ml-2">
                        {language === "ar" ? "مشاهدة الحماية الشخصية" : "Watch Video"}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
