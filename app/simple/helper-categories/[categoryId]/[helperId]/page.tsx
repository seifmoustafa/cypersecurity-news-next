"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import Breadcrumbs from "@/components/breadcrumbs";
import { useHelperCategories } from "@/hooks/use-helper-categories";
import { useHelpersByCategory } from "@/hooks/use-helper-categories";
import { getFullImageUrl } from "@/lib/utils";
import { useShare } from "@/hooks/use-share";
import {
  ArrowLeft,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Download,
  Share2,
} from "lucide-react";

export default function HelperDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const categoryId = params.categoryId as string;
  const helperId = params.helperId as string;

  // Fetch all categories for sidebar
  const { categories: allCategories } = useHelperCategories(1, 100);

  // Fetch helpers for the category
  const { helpers } = useHelpersByCategory(categoryId, 1, 100);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Find current helper index and get current helper
  useEffect(() => {
    if (helpers && helperId) {
      const index = helpers.findIndex((h) => h.id === helperId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [helpers, helperId]);

  // Get current helper from the helpers array based on currentIndex
  const currentHelper =
    helpers && helpers[currentIndex] ? helpers[currentIndex] : null;

  // Debug logging
  console.log("Current state:", {
    currentIndex,
    helpersLength: helpers?.length,
    currentHelper: currentHelper?.title,
    helpers: helpers?.map((h) => h.title),
  });

  const selectedCategory = allCategories.find((cat) => cat.id === categoryId);
  
  // Share functionality
  const { share, isSharing } = useShare();
  
  const handleShare = async () => {
    if (currentHelper) {
      await share({
        title: language === "ar" ? currentHelper.title : currentHelper.titleEn || currentHelper.title,
        url: typeof window !== 'undefined' ? window.location.href : '',
        text: language === "ar" ? `شاهد هذا الإرشاد: ${currentHelper.title}` : `Check out this helper: ${currentHelper.titleEn || currentHelper.title}`
      });
    }
  };

  const goToPrevious = () => {
    if (helpers && helpers.length > 0) {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : helpers.length - 1;
      console.log("Going to previous:", {
        currentIndex,
        newIndex,
        helper: helpers[newIndex],
      });
      setCurrentIndex(newIndex);
      // Update URL without page reload
      window.history.replaceState(
        null,
        "",
        `/simple/helper-categories/${categoryId}/${helpers[newIndex].id}`
      );
    }
  };

  const goToNext = () => {
    if (helpers && helpers.length > 0) {
      const newIndex = currentIndex < helpers.length - 1 ? currentIndex + 1 : 0;
      console.log("Going to next:", {
        currentIndex,
        newIndex,
        helper: helpers[newIndex],
      });
      setCurrentIndex(newIndex);
      // Update URL without page reload
      window.history.replaceState(
        null,
        "",
        `/simple/helper-categories/${categoryId}/${helpers[newIndex].id}`
      );
    }
  };

  const goToHelper = (index: number) => {
    if (helpers && helpers[index]) {
      setCurrentIndex(index);
      // Update URL without page reload
      window.history.replaceState(
        null,
        "",
        `/simple/helper-categories/${categoryId}/${helpers[index].id}`
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    } else if (e.key === "Escape") {
      router.push(`/simple/helper-categories?category=${categoryId}`);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, helpers]);

  if (!helpers || helpers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!currentHelper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {language === "ar" ? "الإرشاد غير موجود" : "Helper not found"}
          </h2>
          <Link
            href={`/simple/helper-categories?category=${categoryId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "ar" ? "العودة إلى الفئة" : "Back to Category"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(147,51,234,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            {
              label: language === "ar" ? "التوعية" : "Awareness",
              href: "/simple/awareness",
            },
            {
              label: language === "ar" ? "الإرشادات" : "Helpers",
              href: "/simple/helper-categories",
            },
            {
              label:
                language === "ar"
                  ? selectedCategory?.title || "Category"
                  : selectedCategory?.titleEn ||
                    selectedCategory?.title ||
                    "Category",
              href: `/simple/helper-categories?category=${categoryId}`,
            },
            {
              label:
                language === "ar"
                  ? currentHelper.title
                  : currentHelper.titleEn || currentHelper.title,
            },
          ]}
        />

        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Sidebar - Categories */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  {language === "ar" ? "الفئات" : "Categories"}
                </h2>

                <div className="space-y-2">
                  {allCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/simple/helper-categories?category=${category.id}`}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                        categoryId === category.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                          : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span className="font-medium">
                        {language === "ar"
                          ? category.title
                          : category.titleEn || category.title}
                      </span>
                      {isRtl ? (
                        <ArrowLeft
                          className={`h-4 w-4 transition-colors duration-300 ${
                            categoryId === category.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                          }`}
                        />
                      ) : (
                        <ArrowRight
                          className={`h-4 w-4 transition-colors duration-300 ${
                            categoryId === category.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                          }`}
                        />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Carousel */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {language === "ar"
                          ? currentHelper.title
                          : currentHelper.titleEn || currentHelper.title}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300">
                        {currentIndex + 1} {language === "ar" ? "من" : "of"}{" "}
                        {helpers?.length || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleShare}
                        disabled={isSharing}
                        className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={language === "ar" ? "مشاركة" : "Share"}
                      >
                        <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </button>
                      <Link
                        href={`/simple/helper-categories?category=${categoryId}`}
                        className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-300"
                      >
                        <X className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Image Display */}
                <div className="relative overflow-hidden">
                  <div className="relative h-[70vh] bg-gray-50 dark:bg-gray-900">
                    {helpers && helpers.length > 0 ? (
                      <div className="relative w-full h-full">
                        {/* Main Image Container */}
                        <div className="absolute inset-0 transition-opacity duration-500 ease-in-out">
                          {currentHelper.imageUrl ? (
                            <img
                              key={currentHelper.id}
                              src={getFullImageUrl(currentHelper.imageUrl)}
                              alt={
                                language === "ar"
                                  ? currentHelper.title
                                  : currentHelper.titleEn || currentHelper.title
                              }
                              className="w-full h-full object-contain"
                              style={{
                                opacity: 1,
                                transition: "opacity 0.3s ease-in-out",
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                              <BookOpen className="h-20 w-20 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                        </div>

                        {/* Preload next/previous images for smooth transitions */}
                        {helpers.map((helper, index) => {
                          if (index === currentIndex || !helper.imageUrl)
                            return null;
                          return (
                            <img
                              key={`preload-${helper.id}`}
                              src={getFullImageUrl(helper.imageUrl)}
                              alt={
                                language === "ar"
                                  ? helper.title
                                  : helper.titleEn || helper.title
                              }
                              className="absolute inset-0 w-full h-full object-contain opacity-0 pointer-events-none"
                              style={{ display: "none" }} // Hidden but loaded
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                        <BookOpen className="h-20 w-20 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </div>

                  {/* Navigation Arrows */}
                  {helpers && helpers.length > 1 && (
                    <>
                      <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-100/90 dark:bg-blue-900/30 rounded-full p-3 shadow-lg hover:bg-blue-200/90 dark:hover:bg-blue-900/50 transition-all duration-200 ease-in-out hover:scale-110"
                      >
                        <ChevronLeft className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                      </button>
                      <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-100/90 dark:bg-blue-900/30 rounded-full p-3 shadow-lg hover:bg-blue-200/90 dark:hover:bg-blue-900/50 transition-all duration-200 ease-in-out hover:scale-110"
                      >
                        <ChevronRight className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {helpers && helpers.length > 1 && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {helpers.map((helper, index) => (
                        <button
                          key={helper.id}
                          onClick={() => goToHelper(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ease-in-out transform ${
                            index === currentIndex
                              ? "ring-2 ring-blue-500 dark:ring-blue-400 scale-105"
                              : "hover:opacity-80 hover:scale-105"
                          }`}
                        >
                          {helper.imageUrl ? (
                            <img
                              src={getFullImageUrl(helper.imageUrl)}
                              alt={
                                language === "ar"
                                  ? helper.title
                                  : helper.titleEn || helper.title
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {language === "ar"
                        ? "استخدم الأسهم للتنقل بين الإرشادات"
                        : "Use arrow keys to navigate between helpers"}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToNext}
                        disabled={!helpers || helpers.length <= 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center gap-2"
                      >
                        <ChevronRight className="h-4 w-4" />

                        {language === "ar" ? "التالي" : "Next"}
                      </button>
                      <button
                        onClick={goToPrevious}
                        disabled={!helpers || helpers.length <= 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center gap-2"
                      >
                        {language === "ar" ? "السابق" : "Previous"}
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
