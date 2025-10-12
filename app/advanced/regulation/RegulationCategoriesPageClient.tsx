"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { container } from "@/core/di/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  BookOpen,
  Calendar,
  Filter,
  ChevronRight,
  ChevronLeft,
  Shield,
  FileText,
} from "lucide-react";
import Link from "next/link";
import type { RegulationCategory } from "@/core/domain/models/regulation-category";
import { motion } from "framer-motion";

export default function RegulationCategoriesPageClient() {
  const { language } = useLanguage();
  const [allCategories, setAllCategories] = useState<RegulationCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all categories at once
        const response =
          await container.services.regulationCategories.getAllCategories(
            1,
            1000
          );

        if (response && response.data) {
          setAllCategories(response.data);
        } else {
          setAllCategories([]);
        }
      } catch (err) {
        console.error("Error fetching regulation categories:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch regulation categories"
        );
        setAllCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  useEffect(() => {
    // Reset to page 1 when search term changes
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // Filter categories based on search term
  const filteredCategories = allCategories.filter((category) => {
    const name = language === "ar" ? category.name : category.name_En;
    return (
      name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name_En?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate pagination for filtered results
  const totalFilteredItems = filteredCategories.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 mx-auto mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <Shield className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                {language === "ar"
                  ? "خطأ في تحميل فئات اللوائح"
                  : "Error Loading Regulation Categories"}
              </h3>
              <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                {error}
              </p>
              <Button
                onClick={fetchAllCategories}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                {language === "ar" ? "إعادة المحاولة" : "Try Again"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="ml-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            {language === "ar"
              ? "فئات اللوائح والتنظيمات"
              : "Regulation Categories"}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mt-4">
            {language === "ar"
              ? "اختر فئة اللوائح لعرض التنظيمات المتخصصة في كل مجال من مجالات الأمن السيبراني"
              : "Select a regulation category to view specialized regulations in each cybersecurity domain"}
          </p>
        </div>
        <div className="mb-8 flex items-center">
          <Link href="/advanced#concepts">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>{language === "ar" ? "رجوع" : "Back"}</span>
            </Button>
          </Link>
        </div>
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={
                  language === "ar"
                    ? "البحث في فئات اللوائح..."
                    : "Search regulation categories..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Filter className="h-4 w-4" />
              <span>
                {language === "ar"
                  ? `عرض ${paginatedCategories.length} من ${totalFilteredItems} فئة`
                  : `Showing ${paginatedCategories.length} of ${totalFilteredItems} categories`}
              </span>
            </div>
          </div>
        </div>

        {/* Categories Grid - Home Page Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedCategories.map((category, index) => {
            const categoryName =
              language === "ar" ? category.name : category.name_En;

            // Choose icon based on category name (same logic as home page)
            const isGroup =
              (category.name_En ?? "").toLowerCase().includes("group") ||
              (category.name ?? "").includes("مجموعة");
            const icon = isGroup ? (
              <Shield className="h-10 w-10 text-primary" />
            ) : (
              <FileText className="h-10 w-10 text-primary" />
            );

            const description =
              language === "ar"
                ? `لوائح الأمن السيبراني ${categoryName}`
                : `${
                    category.name_En || category.name || ""
                  } cybersecurity regulations`;

            return (
              <Link
                key={category.id}
                href={`/advanced/regulation/category/${category.id}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden h-[280px] transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer group flex flex-col">
                    <CardContent className="p-6 flex flex-col items-center text-center flex-1">
                      <div className="mb-4 p-4 rounded-full bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-100 dark:group-hover:bg-purple-800/30 transition-colors">
                        <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                          {icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {categoryName}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 text-ellipsis overflow-hidden">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {language === "ar" ? "السابق" : "Previous"}
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              {language === "ar" ? "التالي" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {totalFilteredItems === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 max-w-md mx-auto">
              <FileText className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {language === "ar"
                  ? "لا توجد فئات لوائح"
                  : "No Regulation Categories Found"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {language === "ar"
                  ? "لم يتم العثور على فئات لوائح تطابق البحث"
                  : "No regulation categories match your search"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
