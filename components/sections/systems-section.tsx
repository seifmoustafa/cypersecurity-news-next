"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { container } from "@/core/di/container"
import type { System } from "@/core/domain/models/system"

export default function SystemsSection() {
  const { t } = useLanguage()
  const [systems, setSystems] = useState<System[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        setLoading(true)
        const data = await container.services.systems.getAllSystems()
        setSystems(data)
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
    </SectionContainer>
  )
}

interface SystemCardProps {
  system: System
  index: number
}

function SystemCard({ system, index }: SystemCardProps) {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"

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
            src={system.imageUrl || "/placeholder.svg"}
            alt={system.title[language]}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white drop-shadow-md">{system.title[language]}</h3>
          </div>
        </div>
        <CardContent className="p-6 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/30">
          <p className="text-muted-foreground mb-6">{system.description[language]}</p>
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="group/button border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
              onClick={() => window.open(system.link, "_blank")}
            >
              <span className="mr-2 rtl:ml-2 rtl:mr-0">{t("systems.visitSystem")}</span>
              <ExternalLink className="h-4 w-4 transition-transform group-hover/button:translate-x-1 rtl:group-hover/button:-translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
