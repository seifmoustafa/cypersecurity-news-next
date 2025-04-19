"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"
import { container } from "@/core/di/container"
import type { Regulation } from "@/core/domain/models/regulation"

export default function CyberSecurityRegulationSection() {
  const { t } = useLanguage()
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
  const { language, isRtl, t } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card
          className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer border border-blue-200/30 dark:border-blue-800/30"
          onClick={() => setDialogOpen(true)}
        >
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
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[85vh] border border-blue-200/50 dark:border-blue-800/30 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {item.title[language]}
            </DialogTitle>
            <DialogDescription>{item.shortDescription[language]}</DialogDescription>
          </DialogHeader>

          <div className="relative w-full h-48 my-4 rounded-md overflow-hidden">
            <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title[language]} fill className="object-cover" />
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: item.fullDescription[language] }} />
          </div>

          {item.documentUrl && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => window.open(item.documentUrl, "_blank")}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {t("common.download")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
