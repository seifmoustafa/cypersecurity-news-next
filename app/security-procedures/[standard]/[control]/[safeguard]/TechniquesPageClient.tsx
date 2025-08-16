"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { useLanguage } from "@/components/language-provider"
import { useSecurityProcedures, useSecurityProcedureTechniques } from "@/core/hooks/use-security-procedures"
import { useDebouncedSearch } from "@/core/hooks/use-debounced-search"
import {
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Settings,
  Search,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import {
  findEntityBySlugOrId,
  generateSecurityProcedureUrls,
} from "@/lib/security-procedures-utils"

interface TechniquesPageClientProps {
  standardSlug: string
  controlSlug: string
  safeguardSlug: string
}

export default function TechniquesPageClient({
  standardSlug,
  controlSlug,
  safeguardSlug,
}: TechniquesPageClientProps) {
  const { language, t } = useLanguage()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [standard, setStandard] = useState<any>(null)
  const [control, setControl] = useState<any>(null)
  const [safeguard, setSafeguard] = useState<any>(null)
  const [safeguardId, setSafeguardId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pageSize = 12

  const { searchTerm, debouncedSearchTerm, handleSearchChange, clearSearch } = useDebouncedSearch("", 300)
  const { getStandards, getControlsByStandardId, getSafeguardsByControlId } = useSecurityProcedures()
  const { techniques, pagination, loading: techniquesLoading, error: techniquesError } = useSecurityProcedureTechniques(
    safeguardId || "",
    currentPage,
    pageSize,
    debouncedSearchTerm
  )

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const allStandards = await getStandards()
        const foundStandard = findEntityBySlugOrId(
          allStandards,
          standardSlug
        )
        if (!foundStandard) {
          setError(t("securityProcedures.errorNotFound"))
          return
        }
        setStandard(foundStandard)

        const controls = await getControlsByStandardId(foundStandard.id)
        const foundControl = findEntityBySlugOrId(
          controls.map((c: any) => ({
            id: c.control.id,
            nameEn: c.control.nameEn,
          })),
          controlSlug
        )
        if (!foundControl) {
          setError(t("securityProcedures.errorControlNotFound"))
          return
        }
        const fullControl = controls.find(
          (c: any) => c.control.id === foundControl.id
        )?.control
        setControl(fullControl)

        const safeguards = await getSafeguardsByControlId(foundControl.id)
        const foundSafeguard = findEntityBySlugOrId(
          safeguards,
          safeguardSlug
        )
        if (!foundSafeguard) {
          setError(t("securityProcedures.errorSafeguardNotFound"))
          return
        }
        setSafeguard(foundSafeguard)
        setSafeguardId(foundSafeguard.id)
      } catch {
        setError(t("securityProcedures.errorLoadTechniques"))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [standardSlug, controlSlug, safeguardSlug, getStandards, getControlsByStandardId, getSafeguardsByControlId, t])

  const handleSearch = (value: string) => {
    handleSearchChange(value)
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    clearSearch()
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const finalError = error || techniquesError
  const finalLoading = loading || techniquesLoading

  const handleBack = () => {
    if (standard && control) {
      const urls = generateSecurityProcedureUrls(standard, control)
      router.push(urls.controlUrl!)
    } else {
      router.back()
    }
  }

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
    )
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
            <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                {t("securityProcedures.techniques")}
              </h1>
              {safeguard && (
                <p className="text-lg text-muted-foreground mt-2">
                  {language === "ar"
                    ? safeguard.safeGuardTitle
                    : safeguard.nameEn}
                </p>
              )}
            </div>
          </div>
          {safeguard && (
            <div className="flex items-center gap-2">
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
              <Badge variant="outline" className="text-xs">
                {safeguard.online
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

        {/* Techniques Grid */}
        {finalLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <TechniqueCardSkeleton key={i} />
            ))}
          </div>
        ) : techniques.length === 0 && !finalLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("common.noResults")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("securityProcedures.noTechniques")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {techniques.map((technique, index) => (
              <TechniqueCard
                key={technique.id}
                technique={technique}
                standard={standard}
                control={control}
                safeguard={safeguard}
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
  )
}

function TechniqueCard({
  technique,
  standard,
  control,
  safeguard,
  index,
}: {
  technique: any
  standard: any
  control: any
  safeguard: any
  index: number
}) {
  const { language, t } = useLanguage()

  const title =
    language === "ar"
      ? technique.technique.techniqueName
      : technique.technique.nameEn
  const description =
    language === "ar"
      ? technique.technique.techniqueDescription
      : technique.technique.descriptionEn

  const urls = generateSecurityProcedureUrls(
    standard,
    control,
    safeguard,
    {
      id: technique.technique.id,
      nameEn: technique.technique.nameEn,
    }
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={urls.techniqueUrl!}>
        <Card className="h-full bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg group cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                  {title}
                </CardTitle>
                <div className="flex flex-wrap gap-1 mt-2">
                  {technique.technique.approval && (
                    <Badge variant="secondary" className="text-xs">
                      {t("securityProcedures.badgeApproved")}
                    </Badge>
                  )}
                  {technique.technique.online && (
                    <Badge variant="outline" className="text-xs">
                      {t("securityProcedures.badgeOnline")}
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
                  {t("securityProcedures.labelOrder")}{" "}
                  {technique.technique.order || 0}
                </Badge>
                {technique.technique.approvalDate && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(
                      technique.technique.approvalDate
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

function TechniqueCardSkeleton() {
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
  )
}
