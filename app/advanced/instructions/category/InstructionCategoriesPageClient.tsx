"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { container } from "@/core/di/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  BookOpen, 
  Calendar, 
  Filter,
  ChevronRight,
  ChevronLeft,
  Shield,
  FileText
} from "lucide-react";
import Link from "next/link";
import type { InstructionCategory } from "@/core/domain/models/instruction-category";
import { motion } from "framer-motion";

export default function InstructionCategoriesPageClient() {
  const { language } = useLanguage();
  const [allCategories, setAllCategories] = useState<InstructionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setLoading(true);
        // Fetch all categories at once
        const response = await container.services.instructionCategories.getAllCategories(1, 1000);
        setAllCategories(response.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
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
    const name = language === "ar" ? category.name : category.nameEn;
    return name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate pagination for filtered results
  const totalFilteredItems = filteredCategories.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">
              {language === "ar" ? "جاري تحميل فئات التعليمات..." : "Loading instruction categories..."}
            </p>
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
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
                {language === "ar" ? "خطأ في التحميل" : "Loading Error"}
              </h2>
              <p className="text-red-600 dark:text-red-300">
                {language === "ar" ? "حدث خطأ أثناء تحميل فئات التعليمات" : "An error occurred while loading instruction categories"}
              </p>
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
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-full">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="ml-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400">
              {language === "ar" ? "التعليمات الأمنية" : "Security Instructions"}
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {language === "ar" 
              ? "اختر فئة التعليمات الأمنية لعرض السنوات المتاحة والتعليمات المتخصصة لكل فئة"
              : "Select a security instruction category to view available years and specialized instructions for each category"
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {allCategories.length}
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                {language === "ar" ? "إجمالي الفئات" : "Total Categories"}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {totalPages}
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                {language === "ar" ? "إجمالي الصفحات" : "Total Pages"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder={language === "ar" ? "البحث في فئات التعليمات..." : "Search instruction categories..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-300">
            {language === "ar" 
              ? `عرض ${paginatedCategories.length} من ${totalFilteredItems} فئة تعليمات`
              : `Showing ${paginatedCategories.length} of ${totalFilteredItems} instruction categories`
            }
          </p>
        </div>

        {/* Categories Grid - Home Page Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedCategories.map((category, index) => {
            const categoryName = language === "ar" ? category.name : category.nameEn;
            
            // Choose icon based on category name (same logic as home page)
            const isGroup =
              (category.nameEn ?? "").toLowerCase().includes("group") ||
              (category.name ?? "").includes("مجموعة");
            const icon = isGroup ? (
              <Shield className="h-10 w-10 text-primary" />
            ) : (
              <FileText className="h-10 w-10 text-primary" />
            );

            const description =
              language === "ar"
                ? `تعليمات الأمن السيبراني ${categoryName}`
                : `${category.nameEn || category.name || ""} cybersecurity instructions`;

            return (
              <Link key={category.id} href={`/instructions/category/${category.id}`} className="block">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden h-[280px] transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer group flex flex-col">
                    <CardContent className="p-6 flex flex-col items-center text-center flex-1">
                      <div className="mb-4 p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors">
                        <div className="text-primary group-hover:scale-110 transition-transform duration-300">{icon}</div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{categoryName}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 text-ellipsis overflow-hidden">{description}</p>
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
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {language === "ar" ? "السابق" : "Previous"}
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              {language === "ar" ? "التالي" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* No Results */}
        {totalFilteredItems === 0 && (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {language === "ar" ? "لا توجد فئات" : "No Categories Found"}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {language === "ar" 
                  ? "لم يتم العثور على فئات تعليمات تطابق معايير البحث الخاصة بك"
                  : "No instruction categories found matching your search criteria"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
