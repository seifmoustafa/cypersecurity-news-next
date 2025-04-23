"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { instructionsData } from "@/data/instructions-data"

export default function SecurityInstructionsContent() {
  const { t, language } = useLanguage()
  const router = useRouter()

  // Define the instruction types
  const instructionTypes = [
    {
      id: "group",
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: { ar: "المجموعة ٩٩", en: "Group 99" },
      description: {
        ar: "تعليمات الأمن السيبراني للمجموعة ٩٩",
        en: "Group 99 cybersecurity instructions",
      },
      years: Object.keys(instructionsData.group).sort((a, b) => Number(b) - Number(a)),
    },
    {
      id: "branch",
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: { ar: "فرع حرب المعلومات", en: "Information Warfare Branch" },
      description: {
        ar: "تعليمات الأمن السيبراني للفرع",
        en: "Branch cybersecurity instructions",
      },
      years: Object.keys(instructionsData.branch).sort((a, b) => Number(b) - Number(a)),
    },
  ]

  const handleTypeClick = (typeId: string) => {
    // Navigate directly to the type page instead of showing a dialog
    router.push(`/instructions/${typeId}`)
  }

  // Add prefetching for faster navigation
  useEffect(() => {
    // Prefetch instruction type pages
    instructionTypes.forEach((type) => {
      router.prefetch(`/instructions/${type.id}`)
    })
  }, [router])

  return (
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
                <div className="text-primary group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
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
  )
}
