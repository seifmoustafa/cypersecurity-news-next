"use client"

import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { container } from "@/core/di/container"
import type { Regulation } from "@/core/domain/models/regulation"
import SectionContainer from "@/components/ui/section-container"
import SectionHeader from "@/components/ui/section-header"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function CybersecurityRegulationSection() {
  const { language, t } = useLanguage()
  const [regulations, setRegulations] = useState<Regulation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRegulations = async () => {
      try {
        setLoading(true)
        const data = await container.services.regulations.getAllRegulations()
        setRegulations(data)
      } catch (error) {
        console.error("Error fetching regulations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRegulations()
  }, [])

  if (loading) {
    return (
      <SectionContainer id="regulation">
        <SectionHeader title={t("section.regulation")} subtitle={t("regulation.subtitle")} />
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
    <SectionContainer id="regulation">
      <SectionHeader title={t("section.regulation")} subtitle={t("regulation.subtitle")} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {regulations.map((item, index) => (
          <RegulationCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </SectionContainer>
  )
}

interface RegulationCardProps {
  item: Regulation
  index: number
}

function RegulationCard({ item, index }: RegulationCardProps) {
  const { language } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/regulation/${item.id}`}>
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer border border-blue-200/30 dark:border-blue-800/30">
          <div className="relative h-48">
            <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title[language]} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white drop-shadow-md">{item.title[language]}</h3>
            </div>
          </div>
          <CardContent className="p-6 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/30">
            <p className="text-muted-foreground">{item.shortDescription[language]}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
