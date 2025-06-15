"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { container } from "@/core/di/container"
import type { System } from "@/core/domain/models/system"

export default function SystemsSection() {
  const { t, language, isRtl } = useLanguage()
  const [systems, setSystems] = useState<System[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        setLoading(true)
        const response = await container.services.systems.getAllSystems(1, 6) // Show first 6 systems
        setSystems(response.data)
      } catch (error) {
        console.error("Error fetching systems:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSystems()
  }, [])

  if (loading) {
    return (
      <SectionContainer id="systems" className="bg-muted/30">
        <SectionHeader title={t("section.systems")} subtitle={t("systems.subtitle")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[300px] animate-pulse">
              <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer id="systems" className="bg-muted/30">
      <SectionHeader title={t("section.systems")} subtitle={t("systems.subtitle")} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {systems.map((system, index) => (
          <SystemCard key={system.id} system={system} index={index} />
        ))}
      </div>

      {/* View All Systems Button */}
      <div className="flex justify-center mt-12">
        <Link href="/systems">
          <Button
            variant="outline"
            size="lg"
            className="group border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
          >
            <span className={`${isRtl ? "ml-2" : "mr-2"}`}>{t("systems.viewAll")}</span>
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

interface SystemCardProps {
  system: System
  index: number
}

function SystemCard({ system, index }: SystemCardProps) {
  const { language, t, isRtl } = useLanguage()

  const handleVisitSystem = () => {
    let url = system.navigationUrl
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`
    }
    window.open(url, "_blank")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg group border border-blue-200/30 dark:border-blue-800/30">
        <div className="relative h-48">
          <Image
            src={system.imageUrl || "/placeholder.svg?height=300&width=400"}
            alt={system.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className={`text-xl font-bold text-white drop-shadow-md ${isRtl ? "text-right" : "text-left"}`}>
              {system.name}
            </h3>
          </div>
        </div>
        <CardContent className="p-6 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/30">
          <p className={`text-muted-foreground mb-6 ${isRtl ? "text-right" : "text-left"}`}>{system.summary}</p>
          <div className={`flex ${isRtl ? "justify-start" : "justify-end"}`}>
            <Button
              variant="outline"
              className="group/button border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
              onClick={handleVisitSystem}
            >
              <span className={`${isRtl ? "ml-2" : "mr-2"}`}>{t("systems.visitSystem")}</span>
              <ExternalLink
                className={`h-4 w-4 transition-transform ${
                  isRtl ? "group-hover/button:-translate-x-1" : "group-hover/button:translate-x-1"
                }`}
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
