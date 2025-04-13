"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { instructionsData } from "@/data/instructions-data"
import { Shield, FileText } from "lucide-react"

export default function SecurityInstructionsSection() {
  const { t } = useLanguage()

  return (
    <SectionContainer id="instructions">
      <SectionHeader title={t("section.instructions")} subtitle={t("instructions.subtitle")} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.keys(instructionsData).map((key, index) => (
          <InstructionCard key={key} type={key as keyof typeof instructionsData} index={index} />
        ))}
      </div>
    </SectionContainer>
  )
}

interface InstructionCardProps {
  type: keyof typeof instructionsData
  index: number
}

function InstructionCard({ type, index }: InstructionCardProps) {
  const { language, t } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [yearDialogOpen, setYearDialogOpen] = useState(false)

  const handleCardClick = () => {
    setDialogOpen(true)
  }

  const handleYearClick = (year: string) => {
    setSelectedYear(year)
    setYearDialogOpen(true)
  }

  const typeTitle = type === "group" ? t("instructions.group") : t("instructions.branch")
  const typeIcon =
    type === "group" ? <Shield className="h-10 w-10 text-primary" /> : <FileText className="h-10 w-10 text-primary" />

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
          onClick={handleCardClick}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="mb-4">{typeIcon}</div>
            <h3 className="text-xl font-bold mb-2">{typeTitle}</h3>
            <p className="text-muted-foreground">
              {language === "ar" ? `تعليمات ${typeTitle} للأمن السيبراني` : `${typeTitle} cybersecurity instructions`}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Years Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{typeTitle}</DialogTitle>
            <DialogDescription>
              {language === "ar"
                ? `اختر السنة لعرض تعليمات ${typeTitle}`
                : `Select a year to view ${typeTitle} instructions`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {Object.keys(instructionsData[type]).map((year) => (
              <Button key={year} variant="outline" className="h-16 text-lg" onClick={() => handleYearClick(year)}>
                {year}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Year Content Dialog */}
      {selectedYear && (
        <Dialog open={yearDialogOpen} onOpenChange={setYearDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {language === "ar"
                  ? `تعليمات ${typeTitle} - ${selectedYear}`
                  : `${typeTitle} Instructions - ${selectedYear}`}
              </DialogTitle>
            </DialogHeader>

            <div className="prose dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: instructionsData[type][selectedYear][language],
                }}
              />
            </div>

            {instructionsData[type][selectedYear].documentUrl && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => window.open(instructionsData[type][selectedYear].documentUrl, "_blank")}>
                  {t("common.download")}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
