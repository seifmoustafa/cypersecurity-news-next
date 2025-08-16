"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { useLanguage } from "@/components/language-provider";
import { useSecurityProcedures, useSecurityProcedureSafeguards } from "@/core/hooks/use-security-procedures";
import { useDebouncedSearch } from "@/core/hooks/use-debounced-search";
import {
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  findEntityBySlugOrId,
  generateSecurityProcedureUrls,
} from "@/lib/security-procedures-utils";

interface SafeguardsPageClientProps {
  standardSlug: string;
  controlSlug: string;
}

export default function SafeguardsPageClient({
  standardSlug,
  controlSlug,
}: SafeguardsPageClientProps) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [standard, setStandard] = useState<any>(null);
  const [control, setControl] = useState<any>(null);
  const [controlId, setControlId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 12;

  const { searchTerm, debouncedSearchTerm, handleSearchChange, clearSearch } = useDebouncedSearch("", 300);
  const { getStandards, getControlsByStandardId } = useSecurityProcedures();
  const { safeguards, pagination, loading: safeguardsLoading, error: safeguardsError } = useSecurityProcedureSafeguards(
    controlId || "",
    currentPage,
    pageSize,
    debouncedSearchTerm
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const allStandards = await getStandards();
        const foundStandard = findEntityBySlugOrId(allStandards, standardSlug);
        if (!foundStandard) {
          setError(t("securityProcedures.errorNotFound"));
          return;
        }
        setStandard(foundStandard);

        const controls = await getControlsByStandardId(foundStandard.id);
        const foundControl = findEntityBySlugOrId(
          controls.map((c: any) => ({
            id: c.control.id,
            nameEn: c.control.nameEn,
          })),
          controlSlug
        );
        if (!foundControl) {
          setError(t("securityProcedures.errorControlNotFound"));
          return;
        }

        const fullControl = controls.find(
          (c: any) => c.control.id === foundControl.id
        )?.control;
        setControl(fullControl);
        setControlId(foundControl.id);
      } catch {
        setError(t("securityProcedures.errorLoadSafeguards"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [standardSlug, controlSlug, getStandards, getControlsByStandardId, t]);

  const handleSearch = (value: string) => {
    handleSearchChange(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    clearSearch();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const finalError = error || safeguardsError;
  const finalLoading = loading || safeguardsLoading;

  const handleBack = () => {
    if (standard) {
      const urls = generateSecurityProcedureUrls(standard);
      router.push(urls.standardUrl!);
    } else {
      router.back();
    }
  };

  if (finalError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t("common.error")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{finalError}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("common.retry")}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 max-w-full 2xl:max-w-[1600px]">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center mb-4">
            <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                {t("securityProcedures.safeguards")}
              </h1>
              {control && (
                <p className="text-lg text-muted-foreground mt-2">
                  {language === "ar" ? control.controlTitle : control.nameEn}
                </p>
              )}
            </div>
          </div>
          {control && (
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              >
                {t("securityProcedures.labelWeight")} {control.weight}
              </Badge>
              <Badge variant="outline">
                {control.online
                  ? t("securityProcedures.online")
                  : t("securityProcedures.offline")}
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {debouncedSearchTerm && (
            <div className="text-center mt-2 text-sm text-muted-foreground">
              {finalLoading ? "Searching..." : `Found ${pagination?.itemsCount || 0} results for "${debouncedSearchTerm}"`}
            </div>
          )}
        </motion.div>

        {/* Safeguards Grid */}
        {finalLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: pageSize }).map((_, i) => (
              <SafeguardCardSkeleton key={i} />
            ))}
          </div>
        ) : safeguards.length === 0 && !finalLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ShieldCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("common.noResults")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("securityProcedures.noSafeguards")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {safeguards.map((safeguard, index) => (
              <SafeguardCard
                key={safeguard.id}
                safeguard={safeguard}
                standard={standard}
                control={control}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <Pagination
              currentPage={currentPage}
              totalPages={pagination?.totalPages || 1}
              onPageChange={handlePageChange}
              showFirstLast={true}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SafeguardCard({
  safeguard,
  standard,
  control,
  index,
}: {
  safeguard: any;
  standard: any;
  control: any;
  index: number;
}) {
  const { language, t } = useLanguage();

  const title = language === "ar" ? safeguard.safeGuardTitle : safeguard.nameEn;
  const description =
    language === "ar"
      ? safeguard.safeGuardDescription
      : safeguard.descriptionEn;

  const urls = generateSecurityProcedureUrls(standard, control, {
    id: safeguard.id,
    nameEn: safeguard.nameEn,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={urls.safeguardUrl!}>
        <Card className="h-full bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg group cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                  {title}
                </CardTitle>
                <div className="flex flex-wrap gap-1 mt-2">
                  {safeguard.mandatory && (
                    <Badge variant="destructive" className="text-xs">
                      {t("securityProcedures.badgeMandatory")}
                    </Badge>
                  )}
                  {safeguard.configurable && (
                    <Badge variant="secondary" className="text-xs">
                      {t("securityProcedures.badgeConfigurable")}
                    </Badge>
                  )}
                  {safeguard.online && (
                    <Badge variant="outline" className="text-xs">
                      {t("securityProcedures.online")}
                    </Badge>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0 ml-2" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: description || "",
                }}
              />
            </CardDescription>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {t("securityProcedures.labelScore")}{" "}
                  {safeguard.configurationScore}
                </Badge>
                <span className="text-gray-500 dark:text-gray-400">
                  {safeguard.mandatoryEvidence
                    ? t("securityProcedures.evidenceRequired")
                    : t("securityProcedures.noEvidence")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function SafeguardCardSkeleton() {
  return (
    <Card className="h-full bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex gap-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
