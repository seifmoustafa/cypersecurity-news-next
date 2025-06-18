"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { useLanguage } from "@/components/language-provider"
import { useSecurityProcedureTechniques, useSecurityProcedureSafeguard } from "@/core/hooks/use-security-procedures"
import { ArrowLeft, Search, AlertCircle, RefreshCw, ChevronRight, Wrench } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface TechniquesPageClientProps {
  standardId: string
  controlId: string
  safeguardId: string
}

export default function TechniquesPageClient({ standardId, controlId, safeguardId }: TechniquesPageClientProps) {
  const { language, t } = useLanguage()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const pageSize = 12

  const { safeguard, loading: safeguardLoading } = useSecurityProcedureSafeguard(safeguardId)
  const {
    techniques,
    pagination,
    loading: techniquesLoading,
    error,
  } = useSecurityProcedureTechniques(safeguardId, currentPage, pageSize, searchTerm)

  const loading = safeguardLoading || techniquesLoading

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("common.error")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{error}</p>
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
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center mb-4">
            <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                {t("securityProcedures.techniques")}
              </h1>
              {safeguard && (
                <p className="text-lg text-muted-foreground mt-2">
                  {language === "ar" ? safeguard.safeGuardTitle : safeguard.nameEn}
                </p>
              )}
            </div>
          </div>
          {safeguard && (
            <div className="flex flex-wrap gap-2">
              {safeguard.mandatory && <Badge variant="destructive">Mandatory</Badge>}
              {safeguard.configurable && <Badge variant="secondary">Configurable</Badge>}
              {safeguard.online && <Badge variant="outline">Online</Badge>}
              <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                {`Score: ${safeguard.configurationScore}`}
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
        </motion.div>

        {/* Techniques Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: pageSize }).map((_, i) => (
              <TechniqueCardSkeleton key={i} />
            ))}
          </div>
        ) : techniques.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t("common.noResults")}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? t("common.noSearchResults") : t("securityProcedures.noTechniques")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {techniques.map((technique, index) => (
              <TechniqueCard
                key={technique.id}
                technique={technique}
                standardId={standardId}
                controlId={controlId}
                safeguardId={safeguardId}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.itemsCount > pageSize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(pagination.itemsCount / pageSize)}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

function TechniqueCard({
  technique,
  standardId,
  controlId,
  safeguardId,
  index,
}: { technique: any; standardId: string; controlId: string; safeguardId: string; index: number }) {
  const { language } = useLanguage()

  const title = language === "ar" ? technique.nameEn : technique.nameEn // Using nameEn from the main object
  const techniqueName = language === "ar" ? technique.technique.techniqueName : technique.technique.nameEn
  const description = language === "ar" ? technique.technique.techniqueDescription : technique.technique.descriptionEn

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Link href={`/security-procedures/${standardId}/${controlId}/${safeguardId}/${technique.technique.id}`}>
        <Card className="h-full bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg group cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                  {title}
                </CardTitle>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-medium">{techniqueName}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {technique.technique.approval && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                    >
                      Approved
                    </Badge>
                  )}
                  {technique.technique.online && (
                    <Badge variant="outline" className="text-xs">
                      Online
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
              <span className="text-gray-500 dark:text-gray-400">
                {technique.technique.approvalDate
                  ? `Approved: ${new Date(technique.technique.approvalDate).toLocaleDateString()}`
                  : "Not Approved"}
              </span>
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
            <Skeleton className="h-4 w-1/2 mb-2" />
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
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  )
}
