"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { regulationData } from "@/data/regulation-data"
import Image from "next/image"

export default function CyberSecurityRegulationSection() {
  const { t } = useLanguage()

  return (
    <SectionContainer id="regulation">
      <SectionHeader title={t("section.regulation")} subtitle={t("regulation.subtitle")} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {regulationData.map((item, index) => (
          <RegulationCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </SectionContainer>
  )
}

interface RegulationCardProps {
  item: (typeof regulationData)[0]
  index: number
}

function RegulationCard({ item, index }: RegulationCardProps) {
  const { language, t } = useLanguage()
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
          className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer"
          onClick={() => setDialogOpen(true)}
        >
          <div className="relative h-48">
            <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title[language]} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">{item.title[language]}</h3>
            <p className="text-muted-foreground">{item.shortDescription[language]}</p>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>{item.title[language]}</DialogTitle>
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
              <Button onClick={() => window.open(item.documentUrl, "_blank")}>{t("common.download")}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
