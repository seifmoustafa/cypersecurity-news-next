"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { instructionsData } from "@/data/instructions-data"

export default function SecurityInstructionsSection() {
  const { t, language, isRtl } = useLanguage()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  // Define the instruction types
  const instructionTypes = [
    {
      id: "group",
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: { ar: "المجموعة", en: "Group" },
      description: {
        ar: "تعليمات الأمن السيبراني للمجموعة",
        en: "Group cybersecurity instructions",
      },
      years: Object.keys(instructionsData.group).sort((a, b) => Number(b) - Number(a)),
    },
    {
      id: "branch",
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: { ar: "الفرع", en: "Branch" },
      description: {
        ar: "تعليمات الأمن السيبراني للفرع",
        en: "Branch cybersecurity instructions",
      },
      years: Object.keys(instructionsData.branch).sort((a, b) => Number(b) - Number(a)),
    },
  ]

  const handleTypeClick = (typeId: string) => {
    setSelectedType(typeId)
    setDialogOpen(true)
  }

  // Update the handleYearSelect function to use Link navigation instead of window.location
  const handleYearSelect = (year: string) => {
    if (selectedType) {
      // Use router.push for faster navigation
      router.push(`/instructions/${selectedType}/${year}`)
      setDialogOpen(false)
    }
  }

  // Add prefetching for faster navigation
  useEffect(() => {
    // Prefetch instruction type pages
    instructionTypes.forEach((type) => {
      router.prefetch(`/instructions/${type.id}`)

      // Prefetch year pages for each type
      type.years.forEach((year) => {
        router.prefetch(`/instructions/${type.id}/${year}`)
      })
    })
  }, [router])

  const selectedTypeData = selectedType ? instructionTypes.find((type) => type.id === selectedType) : null

  return (
    <SectionContainer id="instructions">
      <SectionHeader title={t("section.instructions")} subtitle={t("instructions.subtitle")} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {instructionTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleTypeClick(type.id)}
          >
            <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors">
                  <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                    {type.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {type.title[language]}
                </h3>
                <p className="text-muted-foreground">{type.description[language]}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Year Selection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-blue-900/30 shadow-xl">
          <DialogHeader className="relative">
            <DialogTitle
              className={`text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent ${isRtl ? "text-right" : "text-left"}`}
            >
              {selectedTypeData ? selectedTypeData.title[language] : ""}
            </DialogTitle>
            <p className={`text-gray-300 mt-1 ${isRtl ? "text-right" : "text-left"}`}>
              {language === "ar"
                ? `اختر السنة لعرض تعليمات ${selectedTypeData?.title.ar}`
                : `Select the year to view ${selectedTypeData?.title.en} instructions`}
            </p>
          </DialogHeader>
          <div className="flex flex-row justify-between gap-4 py-4">
            {selectedTypeData?.years.map((year) => (
              <Button
                key={year}
                variant="outline"
                className="flex-1 text-lg py-6 bg-gray-800/80 hover:bg-gray-700 text-white border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </SectionContainer>
  )
}
