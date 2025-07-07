"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import { useHelperSystems } from "@/core/hooks/use-helper-systems"
import type { HelperSystem } from "@/core/domain/models/helper-system"

export default function HelperSystemsSection() {
  const { t, isRtl } = useLanguage()
  const { helperSystems, loading, error, refetch } = useHelperSystems(1, 6) // Show first 6 helper systems

  if (error) {
    return (
      <SectionContainer id="helpers" className="bg-muted/50">
        <SectionHeader title={t("section.helperSystems")} subtitle={t("helperSystems.subtitle")} />
        <Alert className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" onClick={refetch} className="ml-4">
              {t("common.retry") || "Retry"}
            </Button>
          </AlertDescription>
        </Alert>
      </SectionContainer>
    )
  }

  if (loading) {
    return (
      <SectionContainer id="helpers" className="bg-muted/50">
        <SectionHeader title={t("section.helperSystems")} subtitle={t("helperSystems.subtitle")} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[280px] animate-pulse">
              <div className="p-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer id="helpers" className="bg-muted/50">
      <SectionHeader title={t("section.helperSystems")} subtitle={t("helperSystems.subtitle")} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {helperSystems.map((system, index) => (
          <HelperSystemCard key={system.id} system={system} index={index} />
        ))}
      </div>

      {helperSystems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("common.noResults")}</p>
        </div>
      )}

      {/* View All Helper Systems Button */}
      <div className="flex justify-center mt-12">
        <Link href="/helper-systems">
          <Button
            variant="outline"
            size="lg"
            className="group border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
          >
            <span className={`${isRtl ? "ml-2" : "mr-2"}`}>{t("helperSystems.viewAll")}</span>
            {isRtl ? (
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </Button>
        </Link>
      </div>
    </SectionContainer>
  )
}

interface HelperSystemCardProps {
  system: HelperSystem
  index: number
}

function HelperSystemCard({ system, index }: HelperSystemCardProps) {
  const { t, isRtl } = useLanguage()

  const handleDownload = () => {
    if (system.downloadUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement("a")
      link.href = system.downloadUrl
      link.download = system.name
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group border border-blue-200/30 dark:border-blue-800/30 h-full">
        <CardContent className="p-6 flex flex-col items-center h-full">
          <div className="w-16 h-16 mb-4 relative flex-shrink-0">
            {system.iconUrl ? (
              <Image
                src={system.iconUrl || "/placeholder.svg"}
                alt={system.name}
                fill
                className="object-contain rounded-md"
                onError={(e) => {
                  console.error("Error loading helper system icon:", e)
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=64&width=64"
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-md flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 text-xs font-medium">
                  {system.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-grow text-center">
            <h3 className="text-lg font-semibold mb-2 text-foreground">{system.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{system.summary}</p>
          </div>

          <div className="w-full mt-auto">
            <Button
              onClick={handleDownload}
              disabled={!system.downloadUrl || !system.isActive}
              className="w-full group/button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300"
            >
              <Download
                className={`h-4 w-4 transition-transform group-hover/button:scale-110 ${isRtl ? "ml-2" : "mr-2"}`}
              />
              {t("helperSystems.download")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
