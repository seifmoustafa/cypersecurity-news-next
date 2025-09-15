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
  Scale, 
  Calendar, 
  Filter,
  ChevronRight,
  ChevronLeft,
  Download,
  Eye,
  Building2
} from "lucide-react";
import Link from "next/link";
import type { LawCategory } from "@/core/domain/models/law-category";

export default function LawsPageClient() {
  const { language } = useLanguage();
  const [allCategories, setAllCategories] = useState<LawCategory[]>([]);
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
        const response = await container.services.laws.getAllCategories(1, 1000);
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

  const getCategoryColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">
              {language === "ar" ? "جاري تحميل القوانين واللوائح..." : "Loading laws and regulations..."}
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
                {language === "ar" ? "حدث خطأ أثناء تحميل القوانين واللوائح" : "An error occurred while loading laws and regulations"}
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-blue-600 p-4 rounded-full">
                <Scale className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="ml-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              {language === "ar" ? "فئات القوانين واللوائح" : "Law & Regulation Categories"}
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {language === "ar" 
              ? "تصفح فئات القوانين واللوائح الأمنية السيبرانية المختلفة للوصول إلى القوانين المتخصصة"
              : "Browse different categories of cybersecurity laws and regulations to access specialized legal documents"
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
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
                placeholder={language === "ar" ? "البحث في القوانين واللوائح..." : "Search laws and regulations..."}
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
              ? `عرض ${paginatedCategories.length} من ${totalFilteredItems} فئة قانونية - انقر على أي فئة لعرض القوانين المتخصصة`
              : `Showing ${paginatedCategories.length} of ${totalFilteredItems} legal categories - Click on any category to view specialized laws`
            }
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedCategories.map((category, index) => {
            const categoryName = language === "ar" ? category.name : category.nameEn;
            
            return (
              <Card key={category.id} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${getCategoryColor(index)} text-sm font-medium`}>
                      #{index + 1}
                    </Badge>
                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    {categoryName || category.nameEn || "Unnamed Category"}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href={`/laws/category/${category.id}`}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:opacity-90 text-white border-0">
                      <Scale className="h-4 w-4 mr-2" />
                      {language === "ar" ? "عرض الفئة" : "View Category"}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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
              <Scale className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {language === "ar" ? "لا توجد فئات" : "No Categories Found"}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {language === "ar" 
                  ? "لم يتم العثور على فئات قانونية تطابق معايير البحث الخاصة بك"
                  : "No legal categories found matching your search criteria"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
