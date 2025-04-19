"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Home, Building, BookOpen, FileCode, Shield } from "lucide-react"
import Link from "next/link"
import { container } from "@/core/di/container"
import type { Definition } from "@/core/domain/models/definition"
import type { Domain } from "@/core/domain/models/framework"
import type { StandardCategory } from "@/core/domain/models/standard"

export default function StandardsSection() {
  const { t, language, isRtl } = useLanguage()
  const [definitions, setDefinitions] = useState<Record<string, Definition[]>>({})
  const [domains, setDomains] = useState<Domain[]>([])
  const [standardCategories, setStandardCategories] = useState<StandardCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch definitions
        const categories = await container.services.definitions.getCategories()
        const definitionsData: Record<string, Definition[]> = {}

        for (const category of categories) {
          const categoryDefinitions = await container.services.definitions.getDefinitionsByCategory(category)
          definitionsData[category] = categoryDefinitions
        }

        setDefinitions(definitionsData)

        // Fetch framework domains
        const frameworkDomains = await container.services.framework.getDomains()
        setDomains(frameworkDomains)

        // Fetch standard categories
        const categories2 = await container.services.standards.getStandardCategories()
        setStandardCategories(categories2)
      } catch (error) {
        console.error("Error fetching standards data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const icons = {
    international: <Globe className="h-6 w-6 text-primary" />,
    local: <Home className="h-6 w-6 text-primary" />,
    internal: <Building className="h-6 w-6 text-primary" />,
  }

  const tabIcons = {
    definitions: <BookOpen className="h-5 w-5" />,
    framework: <FileCode className="h-5 w-5" />,
    standards: <Shield className="h-5 w-5" />,
  }

  if (loading) {
    return (
      <SectionContainer id="standards" className="bg-muted/30">
        <SectionHeader title={t("section.standards")} subtitle={t("standards.subtitle")} />
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded max-w-md mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-[300px]">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer id="standards" className="bg-muted/30">
      <SectionHeader title={t("section.standards")} subtitle={t("standards.subtitle")} />

      <Tabs defaultValue="standards" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="definitions" className="flex-1">
            <span className="flex items-center gap-2">
              {tabIcons.definitions}
              <span>{t("section.definitions")}</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="framework" className="flex-1">
            <span className="flex items-center gap-2">
              {tabIcons.framework}
              <span>{t("section.framework")}</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="standards" className="flex-1">
            <span className="flex items-center gap-2">
              {tabIcons.standards}
              <span>{t("section.standards")}</span>
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Definitions Tab Content */}
        <TabsContent value="definitions" className="mt-0">
          <Tabs defaultValue="general" className="w-full">
            <TabsList
              className={`w-full max-w-2xl mx-auto mb-8 flex flex-wrap justify-center ${isRtl ? "flex-row-reverse" : ""}`}
            >
              {Object.keys(definitions).map((category) => (
                <TabsTrigger key={category} value={category} className="flex-grow">
                  {t(`definitions.categories.${category}`)}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(definitions).map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {definitions[category].slice(0, 6).map((item, index) => (
                    <Link href={`/definitions/${item.id}`} key={item.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                          <CardHeader className="pb-2">
                            <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                              {item.term[language]}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className={isRtl ? "text-right" : "text-left"}>
                            <p className="text-muted-foreground line-clamp-4">{item.definition[language]}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href={`/definitions/category/${category}`}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {t("common.viewAll")} {t(`definitions.categories.${category}`)}
                  </Link>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* Framework Tab Content */}
        <TabsContent value="framework" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain, index) => (
              <Link href={`/framework/${domain.id}`} key={domain.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                        {domain.title[language]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={isRtl ? "text-right" : "text-left"}>
                      <p className="text-muted-foreground mb-4">{domain.description[language]}</p>
                      <div className="space-y-2">
                        {domain.components.slice(0, 2).map((component) => (
                          <div key={component.id} className="p-2 bg-muted rounded-md">
                            <p className="font-medium">{component.title[language]}</p>
                          </div>
                        ))}
                        {domain.components.length > 2 && (
                          <div className="text-primary text-sm font-medium">
                            +{domain.components.length - 2} {t("common.more")}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/framework"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("common.viewAll")} {t("section.framework")}
            </Link>
          </div>
        </TabsContent>

        {/* Standards Tab Content */}
        <TabsContent value="standards" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {standardCategories.map((category, index) => (
              <Link href={`/standards/${category.id}`} key={category.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className={`flex items-center gap-2 ${isRtl ? "justify-end" : "justify-start"}`}>
                        {icons[category.id as keyof typeof icons]}
                        <CardTitle>{category.name[language]}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className={`prose dark:prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}>
                        <p>{category.description[language]}</p>
                      </div>

                      <div className="mt-4 space-y-2">
                        {category.items.slice(0, 2).map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className={`p-3 bg-muted rounded-md ${isRtl ? "text-right" : "text-left"}`}
                          >
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                          </div>
                        ))}
                        {category.items.length > 2 && (
                          <div className="text-primary text-sm font-medium text-center">
                            +{category.items.length - 2} {t("common.more")}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  )
}
