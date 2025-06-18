"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useSecurityProcedures } from "@/core/hooks/use-security-procedures"
import { ArrowLeft, AlertCircle, RefreshCw, ChevronRight, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { findEntityBySlugOrId, generateSecurityProcedureUrls } from "@/lib/security-procedures-utils"

interface SafeguardsPageClientProps {
  standardSlug: string
  controlSlug: string
}

export default function SafeguardsPageClient({ standardSlug, controlSlug }: SafeguardsPageClientProps) {
  const { language, t } = useLanguage()
  const router = useRouter()
  const [standard, setStandard] = useState<any>(null)
  const [control, setControl] = useState<any>(null)
  const [safeguards, setSafeguards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getStandards, getControlsByStandardId, getSafeguardsByControlId } = useSecurityProcedures()

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get standards
        const standards = await getStandards()
        const foundStandard = findEntityBySlugOrId(standards, standardSlug)

        if (!foundStandard) {
          setError("Standard not found")
          return
        }

        setStandard(foundStandard)

        // Get controls for this standard
        const controls = await getControlsByStandardId(foundStandard.id)
        const foundControl = findEntityBySlugOrId(
          controls.map((c) => ({ id: c.control.id, nameEn: c.control.nameEn })),
          controlSlug,
        )

        if (!foundControl) {
          setError("Control not found")
          return
        }

        // Find the full control object
        const fullControl = controls.find((c) => c.control.id === foundControl.id)?.control
        setControl(fullControl)

        // Get safeguards for this control
        const safeguardsData = await getSafeguardsByControlId(foundControl.id)
        setSafeguards(safeguardsData)
      } catch (err) {
        console.error("Error loading safeguards:", err)
        setError("Failed to load safeguards")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [standardSlug, controlSlug, getStandards, getControlsByStandardId, getSafeguardsByControlId])

  const handleBack = () => {
    if (standard) {
      const urls = generateSecurityProcedureUrls(standard)
      router.push(urls.standardUrl)
    } else {
      router.back()
    }
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
            onClick={handleBack}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
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
              <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                {`Weight: ${control.weight}`}
              </Badge>
              <Badge variant="outline">{control.online ? "Online" : "Offline"}</Badge>
            </div>
          )}
        </motion.div>

        {/* Safeguards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SafeguardCardSkeleton key={i} />
            ))}
          </div>
        ) : safeguards.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <ShieldCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t("common.noResults")}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t("securityProcedures.noSafeguards")}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
      </div>
    </div>
  )
}

function SafeguardCard({
  safeguard,
  standard,
  control,
  index,
}: { safeguard: any; standard: any; control: any; index: number }) {
  const { language } = useLanguage()

  const title = language === "ar" ? safeguard.safeGuardTitle : safeguard.nameEn
  const description = language === "ar" ? safeguard.safeGuardDescription : safeguard.descriptionEn

  // Generate URL with slugs
  const urls = generateSecurityProcedureUrls(standard, control, { id: safeguard.id, nameEn: safeguard.nameEn })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Link href={urls.safeguardUrl}>
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
                      Mandatory
                    </Badge>
                  )}
                  {safeguard.configurable && (
                    <Badge variant="secondary" className="text-xs">
                      Configurable
                    </Badge>
                  )}
                  {safeguard.online && (
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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {`Score: ${safeguard.configurationScore}`}
                </Badge>
                <span className="text-gray-500 dark:text-gray-400">
                  {safeguard.mandatoryEvidence ? "Evidence Required" : "No Evidence"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
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
  )
}
