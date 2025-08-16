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
import { useSecurityProcedures, useSecurityProcedureImplementationSteps } from "@/core/hooks/use-security-procedures";
import { useDebouncedSearch } from "@/core/hooks/use-debounced-search";
import {
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  CheckCircle,
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

interface ImplementationStepsPageClientProps {
  standardSlug: string;
  controlSlug: string;
  safeguardSlug: string;
  techniqueSlug: string;
}

export default function ImplementationStepsPageClient({
  standardSlug,
  controlSlug,
  safeguardSlug,
  techniqueSlug,
}: ImplementationStepsPageClientProps) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [standard, setStandard] = useState<any>(null);
  const [control, setControl] = useState<any>(null);
  const [safeguard, setSafeguard] = useState<any>(null);
  const [technique, setTechnique] = useState<any>(null);
  const [techniqueId, setTechniqueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 12;

  const { searchTerm, debouncedSearchTerm, handleSearchChange, clearSearch } = useDebouncedSearch("", 300);
  const {
    getStandards,
    getControlsByStandardId,
    getSafeguardsByControlId,
    getTechniquesBySafeguardId,
  } = useSecurityProcedures();
  const { implementationSteps: allImplementationSteps, loading: stepsLoading, error: stepsError } = useSecurityProcedureImplementationSteps(
    techniqueId || ""
  );

  // Client-side filtering and pagination
  const [filteredSteps, setFilteredSteps] = useState<any[]>([]);
  const [paginatedSteps, setPaginatedSteps] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Apply search filter and pagination
  useEffect(() => {
    if (!allImplementationSteps) {
      setFilteredSteps([]);
      setPaginatedSteps([]);
      setTotalPages(1);
      setTotalItems(0);
      return;
    }

    let filtered = allImplementationSteps;
    
    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = allImplementationSteps.filter((step: any) => {
        const nameEn = step.implementationStep?.nameEn?.toLowerCase() || "";
        const nameAr = step.implementationStep?.implementationStepName?.toLowerCase() || "";
        const descEn = step.implementationStep?.descriptionEn?.toLowerCase() || "";
        const descAr = step.implementationStep?.implementationStepDescription?.toLowerCase() || "";
        
        return nameEn.includes(searchLower) || nameAr.includes(searchLower) ||
               descEn.includes(searchLower) || descAr.includes(searchLower);
      });
    }

    setFilteredSteps(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / pageSize));

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedSteps(filtered.slice(startIndex, endIndex));
  }, [allImplementationSteps, debouncedSearchTerm, currentPage, pageSize]);

  const pagination = {
    totalPages,
    itemsCount: totalItems,
    currentPage,
  };

  const implementationSteps = paginatedSteps;

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get standards
        const standards = await getStandards();
        const foundStandard = findEntityBySlugOrId(standards, standardSlug);

        if (!foundStandard) {
          setError("Standard not found");
          return;
        }

        setStandard(foundStandard);

        // Get controls for this standard
        const controls = await getControlsByStandardId(foundStandard.id);
        const foundControl = findEntityBySlugOrId(
          controls.map((c: any) => ({ id: c.control.id, nameEn: c.control.nameEn })),
          controlSlug
        );

        if (!foundControl) {
          setError("Control not found");
          return;
        }

        // Find the full control object
        const fullControl = controls.find(
          (c: any) => c.control.id === foundControl.id
        )?.control;
        setControl(fullControl);

        // Get safeguards for this control
        const safeguards = await getSafeguardsByControlId(foundControl.id);
        const foundSafeguard = findEntityBySlugOrId(safeguards, safeguardSlug);

        if (!foundSafeguard) {
          setError("Safeguard not found");
          return;
        }

        setSafeguard(foundSafeguard);

        // Get techniques for this safeguard
        const techniques = await getTechniquesBySafeguardId(foundSafeguard.id);
        const foundTechnique = findEntityBySlugOrId(
          techniques.map((t: any) => ({
            id: t.technique.id,
            nameEn: t.technique.nameEn,
          })),
          techniqueSlug
        );

        if (!foundTechnique) {
          setError("Technique not found");
          return;
        }

        // Find the full technique object
        const fullTechnique = techniques.find(
          (t: any) => t.technique.id === foundTechnique.id
        )?.technique;
        setTechnique(fullTechnique);
        setTechniqueId(foundTechnique.id);
      } catch (err) {
        console.error("Error loading implementation steps:", err);
        setError("Failed to load implementation steps");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    standardSlug,
    controlSlug,
    safeguardSlug,
    techniqueSlug,
    getStandards,
    getControlsByStandardId,
    getSafeguardsByControlId,
    getTechniquesBySafeguardId,
  ]);

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

  const finalError = error || stepsError;
  const finalLoading = loading || stepsLoading;

  const handleBack = () => {
    if (standard && control && safeguard) {
      const urls = generateSecurityProcedureUrls(standard, control, safeguard);
      router.push(urls.safeguardUrl!);
    } else {
      router.back();
    }
  };

  if (finalError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("common.error")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
              {finalError}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("common.retry")}
            </Button>
          </div>
        </div>
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
            <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                {t("securityProcedures.implementationSteps")}
              </h1>
              {technique && (
                <p className="text-lg text-muted-foreground mt-2">
                  {language === "ar"
                    ? technique.techniqueName
                    : technique.nameEn}
                </p>
              )}
            </div>
          </div>
          {technique && (
            <div className="flex items-center gap-2">
              {technique.approval && (
                <Badge variant="secondary" className="text-xs">
                  Approved
                </Badge>
              )}
              <Badge variant="outline">
                {technique.online ? "Online" : "Offline"}
              </Badge>
              <Badge variant="outline">{`Order: ${
                technique.order || 0
              }`}</Badge>
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
              {finalLoading ? "Searching..." : `Found ${totalItems} results for "${debouncedSearchTerm}"`}
            </div>
          )}
        </motion.div>

        {/* Implementation Steps Grid */}
        {finalLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ImplementationStepCardSkeleton key={i} />
            ))}
          </div>
        ) : implementationSteps.length === 0 && !finalLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("common.noResults")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("securityProcedures.noImplementationSteps")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {implementationSteps.map((step, index) => (
              <ImplementationStepCard
                key={step.id}
                step={step}
                standard={standard}
                control={control}
                safeguard={safeguard}
                technique={technique}
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

function ImplementationStepCard({
  step,
  standard,
  control,
  safeguard,
  technique,
  index,
}: {
  step: any;
  standard: any;
  control: any;
  safeguard: any;
  technique: any;
  index: number;
}) {
  const { language, t } = useLanguage();

  const title =
    language === "ar"
      ? step.implementationStep.implementationStepName
      : step.implementationStep.nameEn;
  const description =
    language === "ar"
      ? step.implementationStep.implementationStepDescription
      : step.implementationStep.descriptionEn;

  // Generate URL with slugs
  const urls = generateSecurityProcedureUrls(
    standard,
    control,
    safeguard,
    technique,
    {
      id: step.id,
      nameEn: step.nameEn,
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={urls.implementationUrl!}>
        <Card className="h-full bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg group cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                  {title}
                </CardTitle>
                <div className="flex flex-wrap gap-1 mt-2">
                  {step.implementationStep.approval && (
                    <Badge variant="secondary" className="text-xs">
                      {t("securityProcedures.badgeApproved")}
                    </Badge>
                  )}
                  {step.implementationStep.online && (
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
              <div dangerouslySetInnerHTML={{ __html: description || "" }} />
            </CardDescription>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {`Order: ${step.implementationStep.order || 0}`}
                </Badge>
                {step.implementationStep.approvalDate && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(
                      step.implementationStep.approvalDate
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function ImplementationStepCardSkeleton() {
  return (
    <Card className="h-full bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex gap-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
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
