"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import { useVideosByCategoryForProfessionals } from "@/core/hooks/use-videos-by-category-for-professionals";
import { useVideoCategoriesForProfessionals } from "@/core/hooks/use-video-categories-for-professionals";
import { useDebounce } from "@/hooks/use-debounce";
import VideoModal from "@/components/video-modal";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";

interface VideoCategoryPageClientProps {
  initialVideos: any[];
  initialPagination: any;
  initialSearch: string;
  initialPage: number;
  category: any;
}

export default function VideoCategoryPageClient({
  initialVideos,
  initialPagination,
  initialSearch,
  initialPage,
  category,
}: VideoCategoryPageClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const isRtl = language === "ar";
  const [query, setQuery] = useState(initialSearch);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const { videos, loading, error } = useVideosByCategoryForProfessionals(
    category.id,
    initialPage,
    12,
    debouncedQuery
  );
  const { categories: allCategories } = useVideoCategoriesForProfessionals(
    1,
    100
  );

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideoId(null);
  };

  const categoryName =
    language === "ar" ? category.name : category.nameEn || category.name;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        {/* Cybersecurity Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/advanced#media")}
              className="group"
            >
              {isRtl ? (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              ) : (
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              )}
              <span className={isRtl ? "mr-2" : "ml-2"}>
                {language === "ar" ? "العودة إلى الرئيسية" : "Back to Home"}
              </span>
            </Button>
          </div>

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
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-3 rounded-xl">
                <Video className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          {(loading || videos.length === 0) && !debouncedQuery ? (
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {language === "ar"
                  ? "لا توجد فيديوهات متاحة"
                  : "No videos available"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "لم يتم العثور على أي فيديوهات في هذه الفئة"
                  : "No videos found in this category"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video: any, index: number) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoClick(video.id)}
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
                      const rotateX =
                        ((y - rect.height / 2) / rect.height) * -3;
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
                            ? "للعامة"
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
                          {language === "ar" ? "مشاهدة الفيديو" : "Watch Video"}
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

        {/* Video Modal */}
        <VideoModal
          videoId={selectedVideoId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </MainLayout>
  );
}
