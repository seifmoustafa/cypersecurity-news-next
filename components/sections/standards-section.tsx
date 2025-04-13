"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { standardsData } from "@/data/standards-data"
import { Globe, Home, Building } from "lucide-react"

export default function StandardsSection() {
  const { t } = useLanguage()

  const icons = {
    international: <Globe className="h-6 w-6 text-primary" />,
    local: <Home className="h-6 w-6 text-primary" />,
    internal: <Building className="h-6 w-6 text-primary" />,
  }

  return (
    <SectionContainer id="standards" className="bg-muted/30">
      <SectionHeader title={t("section.standards")} subtitle={t("standards.subtitle")} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.keys(standardsData).map((key, index) => {
          const standardKey = key as keyof typeof standardsData
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {icons[standardKey]}
                    <CardTitle>{t(`standards.${standardKey}`)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: standardsData[standardKey].description,
                      }}
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    {standardsData[standardKey].items.map((item, itemIndex) => (
                      <div key={itemIndex} className="p-3 bg-muted rounded-md">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </SectionContainer>
  )
}
