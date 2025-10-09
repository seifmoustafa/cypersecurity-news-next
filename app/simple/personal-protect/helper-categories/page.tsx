"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import Breadcrumbs from "@/components/breadcrumbs";
import { useHelperCategories } from "@/hooks/use-helper-categories";
import { useHelpersByCategory } from "@/hooks/use-helper-categories";
import { BookOpen, ArrowRight, ArrowLeft, Grid, List } from "lucide-react";
import { getFullImageUrl } from "@/lib/utils";

export default function HelperCategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const selectedCategoryId = searchParams.get("category") || "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch all categories for sidebar
  const { categories: allCategories, loading: categoriesLoading, error: categoriesError } = useHelperCategories(1, 100);
  
  // Debug logging
  console.log("Helper categories:", allCategories);
  console.log("Helper categories loading:", categoriesLoading);
  console.log("Helper categories error:", categoriesError);
  
  // Fetch helpers for selected category
  const { helpers, loading: helpersLoading, pagination } = useHelpersByCategory(
    selectedCategoryId,
    1,
    100
  );

  const selectedCategory = allCategories.find(cat => cat.id === selectedCategoryId);

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/simple/personal-protect/helpers?category=${categoryId}`);
  };

  const handleHelperClick = (helperId: string) => {
    router.push(`/simple/personal-protect/helpers/${selectedCategoryId}/${helperId}`);
  };

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
              label: language === "ar" ? "الحماية الشخصية" : "Personal Protection",
              href: "/simple/personal-protect",
            },
            {
              label: language === "ar" ? "إرشادات" : "Helpers",
              href: "/simple/personal-protect/helpers",
            },
            ...(selectedCategory ? [{
              label: language === "ar" ? selectedCategory.title : selectedCategory.titleEn || selectedCategory.title,
            }] : []),
          ]}
        />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {language === "ar" ? "إرشادات" : "Helpers"}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {language === "ar" 
                ? "إرشادات وأدلة مساعدة في الأمن السيبراني" 
                : "Cybersecurity guides and helpful instructions"
              }
            </p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar - Categories */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  {language === "ar" ? "الفئات" : "Categories"}
                </h2>
                
                {categoriesLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                          selectedCategoryId === category.id
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                            : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="font-medium">
                          {language === "ar" ? category.title : category.titleEn || category.title}
                        </span>
                        {isRtl ? (
                          <ArrowLeft className={`h-4 w-4 transition-colors duration-300 ${
                            selectedCategoryId === category.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                          }`} />
                        ) : (
                          <ArrowRight className={`h-4 w-4 transition-colors duration-300 ${
                            selectedCategoryId === category.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                          }`} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {selectedCategoryId ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  {/* Category Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {language === "ar" ? selectedCategory?.title : selectedCategory?.titleEn || selectedCategory?.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {pagination?.itemsCount || 0} {language === "ar" ? "إرشاد" : "helper"}
                      {(pagination?.itemsCount || 0) !== 1 ? (language === "ar" ? "ات" : "s") : ""}
                    </p>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          viewMode === "grid"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <Grid className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          viewMode === "list"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <List className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Helpers Grid/List */}
                  {helpersLoading ? (
                    <div className={`grid gap-4 ${
                      viewMode === "grid" 
                        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" 
                        : "grid-cols-1"
                    }`}>
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${
                          viewMode === "grid" ? "aspect-square" : "h-20"
                        }`}></div>
                      ))}
                    </div>
                  ) : helpers.length > 0 ? (
                    <div className={`grid gap-4 ${
                      viewMode === "grid" 
                        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" 
                        : "grid-cols-1"
                    }`}>
                      {helpers.map((helper) => (
                        <button
                          key={helper.id}
                          onClick={() => handleHelperClick(helper.id)}
                          className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                            viewMode === "grid" ? "aspect-square" : "h-20 flex items-center"
                          }`}
                        >
                          {helper.imageUrl ? (
                            <img
                              src={getFullImageUrl(helper.imageUrl)}
                              alt={language === "ar" ? helper.title : helper.titleEn || helper.title}
                              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                                viewMode === "list" ? "w-20 h-20 rounded-l-lg" : ""
                              }`}
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center ${
                              viewMode === "list" ? "w-20 h-20 rounded-l-lg" : ""
                            }`}>
                              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2">
                                <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                          </div>

                          {/* Title for list view */}
                          {viewMode === "list" && (
                            <div className="flex-1 p-4 text-left">
                              <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                {language === "ar" ? helper.title : helper.titleEn || helper.title}
                              </h3>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {language === "ar" ? "لا توجد إرشادات متاحة" : "No helpers available"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500">
                        {language === "ar" 
                          ? "لم يتم العثور على إرشادات في هذه الفئة" 
                          : "No helpers found in this category"
                        }
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                  <BookOpen className="h-20 w-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    {language === "ar" ? "اختر فئة إرشادات" : "Select a Helper Category"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {language === "ar" 
                      ? "اختر فئة من القائمة الجانبية لعرض إرشادات المتاحة" 
                      : "Select a category from the sidebar to view available helpers"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
