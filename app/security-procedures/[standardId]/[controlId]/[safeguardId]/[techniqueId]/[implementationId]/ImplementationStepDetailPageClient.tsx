"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useSecurityProcedureImplementationStep } from "@/core/hooks/use-security-procedures"
import { ArrowLeft, AlertCircle, RefreshCw, CheckCircle, Settings, Calendar, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface ImplementationStepDetailPageClientProps {
  standardId: string
  controlId: string
  safeguardId: string
  techniqueId: string
  implementationId: string
}

export default function ImplementationStepDetailPageClient({
  standardId,
  controlId,
  safeguardId,
  techniqueId,
  implementationId,
}: ImplementationStepDetailPageClientProps) {
  const { language, t } = useLanguage()
  const router = useRouter()

  const { implementationStep, loading, error } = useSecurityProcedureImplementationStep(implementationId)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-12 w-96 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800 p-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const title = language === "ar" ? implementationStep?.implementationStepName : implementationStep?.nameEn
  const description =
    language === "ar" ? implementationStep?.implementationStepDescription : implementationStep?.descriptionEn

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

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center mb-4">
              <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-lg text-muted-foreground mt-2">{t("securityProcedures.implementationStepDetail")}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {implementationStep?.approval && (
                <Badge
                  variant="secondary"
                  className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
              )}
              {implementationStep?.configuration && (
                <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                  <Settings className="h-3 w-3 mr-1" />
                  Configurable
                </Badge>
              )}
              {implementationStep?.online && <Badge variant="outline">Online</Badge>}
              {implementationStep?.approvalDate && (
                <Badge
                  variant="secondary"
                  className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(implementationStep.approvalDate).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800 shadow-lg">
              <CardHeader className="border-b border-blue-100 dark:border-blue-800">
                <CardTitle className="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
                  <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  {t("securityProcedures.description")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {description ? (
                  <div
                    className="prose prose-blue dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic">{t("common.noDescription")}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("common.metadata")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">ID:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">{implementationStep?.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                    <span className="ml-2">
                      <Badge variant={implementationStep?.isActive ? "secondary" : "destructive"}>
                        {implementationStep?.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </span>
                  </div>
                  {implementationStep?.createdTimestamp && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {new Date(implementationStep.createdTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {implementationStep?.updatedTimestamp && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Updated:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {new Date(implementationStep.updatedTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Order:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{implementationStep?.order}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Configuration:</span>
                    <span className="ml-2">
                      <Badge variant={implementationStep?.configuration ? "secondary" : "outline"}>
                        {implementationStep?.configuration ? "Enabled" : "Disabled"}
                      </Badge>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
