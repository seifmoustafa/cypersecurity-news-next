"use client"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { systemsData } from "@/data/systems-data"
import Image from "next/image"

export default function SystemsSection() {
  const { t } = useLanguage()

  return (
    <SectionContainer id="systems" className="bg-muted/30">
      <SectionHeader title={t("section.systems")} subtitle={t("systems.subtitle")} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {systemsData.map((system, index) => (
          <SystemCard key={system.id} system={system} index={index} />
        ))}
      </div>
    </SectionContainer>
  )
}

interface SystemCardProps {
  system: (typeof systemsData)[0]
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
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg group">
        <div className="relative h-48">
          <Image
            src={system.imageUrl || "/placeholder.svg"}
            alt={system.title[language]}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white">{system.title[language]}</h3>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-6">{system.description[language]}</p>
          <div className="flex justify-end">
            <Button variant="outline" className="group/button" onClick={() => window.open(system.link, "_blank")}>
              <span className="mr-2 rtl:ml-2 rtl:mr-0">{t("systems.visitSystem")}</span>
              <ExternalLink className="h-4 w-4 transition-transform group-hover/button:translate-x-1 rtl:group-hover/button:-translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
