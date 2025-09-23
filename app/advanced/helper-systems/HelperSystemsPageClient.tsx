"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { container } from "@/core/di/container";
import type {
  HelperSystem,
  HelperSystemsResponse,
} from "@/core/domain/models/helper-system";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Search, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layouts/main-layout";

interface HelperSystemsPageClientProps {
  initialHelperSystems: HelperSystemsResponse;
}

export default function HelperSystemsPageClient({
  initialHelperSystems,
}: HelperSystemsPageClientProps) {
  const { language, isRtl } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [helperSystems, setHelperSystems] = useState<HelperSystem[]>(
    initialHelperSystems.data || []
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    Number.parseInt(searchParams.get("page") || "1")
  );
  const [pagination, setPagination] = useState(initialHelperSystems.pagination);

  const loadHelperSystems = async (page: number, search?: string) => {
    try {
      setLoading(true);
      const response = await container.services.helperSystems.getHelperSystems(
        page,
        12,
        search
      );
      setHelperSystems(response.data || []);
      setPagination(response.pagination);
      setCurrentPage(page);

      // Update URL with search params
      const params = new URLSearchParams();
      if (search && search.trim()) {
        params.set("search", search.trim());
      }
      params.set("page", page.toString());

      const newUrl = `/advanced/helper-systems${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      router.replace(newUrl, { scroll: false });
    } catch (error) {
      console.error("Error loading helper systems:", error);
      setHelperSystems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      loadHelperSystems(1, value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleDownload = (downloadUrl: string, name: string) => {
    if (!downloadUrl) return;
    console.log("Url of the helper", downloadUrl);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.rel="noopener"
    // link.download = name || "download";
    // link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDisplayName = (system: HelperSystem) => {
    return language === "ar"
      ? system.name || system.nameEn || ""
      : system.nameEn || system.name || "";
  };

  const getDisplayDescription = (system: HelperSystem) => {
    return language === "ar"
      ? system.description || system.descriptionEn || ""
      : system.descriptionEn || system.description || "";
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/#helper-systems"
              className={`inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              {isRtl ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Link>
            <h1
              className={`text-4xl font-bold text-foreground mb-4 ${
                isRtl ? "text-right" : "text-left"
              }`}
            >
              {language === "ar" ? "الأنظمة المساعدة" : "Helper Systems"}
            </h1>
            <p
              className={`text-muted-foreground text-lg ${
                isRtl ? "text-right" : "text-left"
              }`}
            >
              {language === "ar"
                ? "تصفح وتحميل جميع الأنظمة المساعدة المتاحة"
                : "Browse and download all available helper systems"}
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search
                className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 ${
                  isRtl ? "right-3" : "left-3"
                }`}
              />
              <Input
                type="text"
                placeholder={
                  language === "ar"
                    ? "البحث في الأنظمة المساعدة..."
                    : "Search helper systems..."
                }
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className={`${isRtl ? "pr-10 text-right" : "pl-10"}`}
              />
            </div>
          </div>

          {/* Helper Systems Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : helperSystems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {helperSystems.map((system) => {
                if (!system || !system.id) return null;

                return (
                  <Card
                    key={system.id}
                    className="hover:shadow-lg transition-all duration-300 group"
                  >
                    <CardContent className="p-6">
                      {system.iconUrl && (
                        <div className="relative h-32 mb-4 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={system.iconUrl || "/placeholder.svg"}
                            alt={getDisplayName(system)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "/placeholder.svg?height=128&width=128";
                            }}
                          />
                        </div>
                      )}
                      <h3
                        className={`text-xl font-semibold text-foreground mb-2 ${
                          isRtl ? "text-right" : "text-left"
                        }`}
                      >
                        {getDisplayName(system)}
                      </h3>
                      <p
                        className={`text-muted-foreground mb-4 line-clamp-2 ${
                          isRtl ? "text-right" : "text-left"
                        }`}
                      >
                        {getDisplayDescription(system)}
                      </p>
                      <Button
                        onClick={() =>
                          handleDownload(
                            system.downloadUrl,
                            getDisplayName(system)
                          )
                        }
                        disabled={!system.downloadUrl}
                        className={`w-full ${isRtl ? "flex-row-reverse" : ""}`}
                        variant="default"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {language === "ar" ? "تحميل" : "Download"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchTerm
                  ? language === "ar"
                    ? "لا توجد نتائج للبحث"
                    : "No search results found"
                  : language === "ar"
                  ? "لا توجد أنظمة مساعدة متاحة"
                  : "No helper systems available"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pagesCount > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                onClick={() => loadHelperSystems(currentPage - 1, searchTerm)}
                disabled={currentPage === 1 || loading}
                variant="outline"
              >
                {isRtl ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
                {language === "ar" ? "السابق" : "Previous"}
              </Button>

              <span className="text-foreground">
                {language === "ar"
                  ? `صفحة ${currentPage} من ${pagination.pagesCount}`
                  : `Page ${currentPage} of ${pagination.pagesCount}`}
              </span>

              <Button
                onClick={() => loadHelperSystems(currentPage + 1, searchTerm)}
                disabled={currentPage === pagination.pagesCount || loading}
                variant="outline"
              >
                {language === "ar" ? "التالي" : "Next"}
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
