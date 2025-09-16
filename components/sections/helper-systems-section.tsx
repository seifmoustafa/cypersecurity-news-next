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
    <SectionContainer id="helpers" className="bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30 dark:from-orange-950/30 dark:via-slate-900 dark:to-amber-950/20">
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

      {/* Enhanced View All Helper Systems Button */}
      <div className="flex justify-center mt-12">
        <Link href="/helper-systems">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-orange-500/30 dark:shadow-orange-500/40 border border-orange-500/30 dark:border-orange-400/30"
          >
            <span className={`${isRtl ? "ml-2" : "mr-2"}`}>{t("helperSystems.viewAll")}</span>
            {isRtl ? (
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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
      link.download = decodeURIComponent((new URL(system.downloadUrl).pathname.split("/").pop() || "download"));
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
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 dark:hover:shadow-orange-500/30 group border border-orange-200/30 dark:border-orange-800/30 h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardContent className="p-8 flex flex-col items-center h-full">
          <div className="w-20 h-20 mb-6 relative flex-shrink-0">
            {system.iconUrl ? (
              <Image
                src={system.iconUrl || "/placeholder.svg"}
                alt={system.name}
                fill
                className="object-contain rounded-xl"
                onError={(e) => {
                  console.error("Error loading helper system icon:", e)
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=64&width=64"
                }}
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-800/50 rounded-xl flex items-center justify-center border border-orange-200/50 dark:border-orange-800/50 shadow-lg">
                <span className="text-orange-600 dark:text-orange-300 text-sm font-bold">
                  {system.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-grow text-center">
            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">{system.name}</h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">{system.summary}</p>
          </div>

          <div className="w-full mt-auto">
            <Button
              onClick={handleDownload}
              disabled={!system.downloadUrl || !system.isActive}
              className="w-full group/button bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/30 dark:shadow-orange-500/40 border border-orange-500/30 dark:border-orange-400/30"
            >
              <Download
                className={`h-5 w-5 transition-transform group-hover/button:scale-110 ${isRtl ? "ml-2" : "mr-2"}`}
              />
              {t("helperSystems.download")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
