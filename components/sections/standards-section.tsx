"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Home, Building, BookOpen, FileCode, Shield, Scale } from "lucide-react"
import Link from "next/link"
import { container } from "@/core/di/container"
import type { Definition, DefinitionCategory } from "@/core/domain/models/definition"
import type { Domain } from "@/core/domain/models/framework"
import type { StandardCategory, Standard } from "@/core/domain/models/standard"
import type { Law } from "@/core/domain/models/law"
import type { LawCategory } from "@/core/domain/models/law-category"
import Image from "next/image"
import { slugify } from "@/lib/utils"

export default function CybersecurityConceptsSection() {
  const { t, language, isRtl } = useLanguage()
  const [definitionCategories, setDefinitionCategories] = useState<DefinitionCategory[]>([])
  const [definitions, setDefinitions] = useState<Record<string, Definition[]>>({})
  const [domains, setDomains] = useState<Domain[]>([])
  const [standardCategories, setStandardCategories] = useState<StandardCategory[]>([])
  const [standardsByCategory, setStandardsByCategory] = useState<Record<string, Standard[]>>({})
  const [lawCategories, setLawCategories] = useState<LawCategory[]>([])
  const [laws, setLaws] = useState<Record<string, Law[]>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("definitions")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch definition categories and definitions from API
        try {
          const definitionCategoriesResponse = await container.services.definitions.getAllCategories(1, 100)
          setDefinitionCategories(definitionCategoriesResponse.data)

          // Fetch definitions for each category (first 6 + count remaining)
          const definitionsData: Record<string, Definition[]> = {}
          for (const category of definitionCategoriesResponse.data) {
            try {
              const categoryDefinitions = await container.services.definitions.getDefinitionsByCategory(
                category.id,
                1,
                100,
              )
              definitionsData[category.id] = categoryDefinitions.data
            } catch (error) {
              console.error(`Error fetching definitions for category ${category.id}:`, error)
              definitionsData[category.id] = []
            }
          }
          setDefinitions(definitionsData)
        } catch (error) {
          console.error("Error fetching definitions data:", error)
          // Set empty data if definitions API fails
          setDefinitionCategories([])
          setDefinitions({})
        }

        // Fetch framework domains
        const frameworkDomains = await container.services.framework.getDomains()
        setDomains(frameworkDomains)

        // Fetch standard categories from backend
        const standardCategoriesResponse = await container.services.standards.getAllStandardCategories(1, 100)
        setStandardCategories(standardCategoriesResponse.data)

        // Fetch standards for each category (first 2 + count remaining)
        const standardsData: Record<string, Standard[]> = {}
        for (const category of standardCategoriesResponse.data) {
          try {
            const categoryStandards = await container.services.standards.getStandardsByCategory(category.id, 1, 100)
            standardsData[category.id] = categoryStandards.data
          } catch (error) {
            console.error(`Error fetching standards for category ${category.id}:`, error)
            standardsData[category.id] = []
          }
        }
        setStandardsByCategory(standardsData)

        // Fetch law categories and laws from backend
        try {
          const lawCategoriesResponse = await container.services.laws.getAllCategories(1, 100)
          setLawCategories(lawCategoriesResponse.data)

          // Fetch laws for each category (first 2 + count remaining)
          const lawsData: Record<string, Law[]> = {}
          for (const category of lawCategoriesResponse.data) {
            try {
              const categoryLaws = await container.services.laws.getLawsByCategory(category.id, 1, 100)
              lawsData[category.id] = categoryLaws.data
            } catch (error) {
              console.error(`Error fetching laws for category ${category.id}:`, error)
              lawsData[category.id] = []
            }
          }
          setLaws(lawsData)
        } catch (error) {
          console.error("Error fetching laws data:", error)
          // Set empty data if laws API fails
          setLawCategories([])
          setLaws({})
        }
      } catch (error) {
        console.error("Error fetching cybersecurity concepts data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Listen for tab change events
  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent
      const { sectionId, tab } = customEvent.detail

      if (sectionId === "standards" && tab) {
        setActiveTab(tab)
      }
    }

    window.addEventListener("tabchange", handleTabChange)
    return () => {
      window.removeEventListener("tabchange", handleTabChange)
    }
  }, [])

  const icons = {
    international: <Globe className="h-6 w-6 text-primary" />,
    national: <Home className="h-6 w-6 text-primary" />,
    local: <Home className="h-6 w-6 text-primary" />,
    internal: <Building className="h-6 w-6 text-primary" />,
  }

  const tabIcons = {
    definitions: <BookOpen className="h-5 w-5" />,
    laws: <Scale className="h-5 w-5" />,
    framework: <FileCode className="h-5 w-5" />,
    standards: <Shield className="h-5 w-5" />,
  }

  if (loading) {
    return (
      <SectionContainer id="standards" className="bg-muted/30">
        <SectionHeader title={t("section.cybersecurityConcepts")} subtitle={t("cybersecurityConcepts.subtitle")} />
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
    <div className={isRtl ? "rtl" : "ltr"} dir={isRtl ? "rtl" : "ltr"}>
      <SectionContainer id="standards" className="bg-muted/30">
        <SectionHeader title={t("section.cybersecurityConcepts")} subtitle={t("cybersecurityConcepts.subtitle")} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`mx-auto mb-8 ${isRtl ? "flex-row-reverse" : ""}`}>
            <TabsTrigger value="definitions" className="flex-1">
              <span className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tabIcons.definitions}
                <span>{t("section.definitions")}</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="laws" className="flex-1">
              <span className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tabIcons.laws}
                <span>{t("section.laws")}</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="framework" className="flex-1">
              <span className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tabIcons.framework}
                <span>{t("section.framework")}</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="standards" className="flex-1">
              <span className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tabIcons.standards}
                <span>{t("section.standards")}</span>
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Definitions Tab Content */}
          <TabsContent value="definitions" className="mt-0">
            {definitionCategories.length > 0 ? (
              <Tabs defaultValue={definitionCategories[0]?.id || ""} className="w-full">
                <TabsList
                  className={`w-full max-w-2xl mx-auto mb-8 flex flex-wrap justify-center ${
                    isRtl ? "flex-row-reverse" : ""
                  }`}
                >
                  {definitionCategories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="flex-grow">
                      {language === "ar" ? category.name : category.nameEn}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {definitionCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(isRtl ? [...(definitions[category.id] || [])].reverse() : definitions[category.id] || [])
                        .slice(0, 6)
                        .map((item, index) => {
                          const definitionSlug = slugify(item.termEn || item.term, item.id)
                          return (
                            <Link href={`/definitions/${definitionSlug}`} key={item.id}>
                              <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                              >
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                                  <CardHeader className="pb-2">
                                    <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                                      {language === "ar" ? item.term || item.termEn : item.termEn || item.term}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className={isRtl ? "text-right" : "text-left"}>
                                    <p className="text-muted-foreground line-clamp-4">
                                      {language === "ar"
                                        ? item.definitionText || item.definitionEn
                                        : item.definitionEn || item.definitionText}
                                    </p>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </Link>
                          )
                        })}
                    </div>
                    <div className="mt-8 text-center">
                      <Link
                        href={`/definitions/category/${slugify(category.nameEn || category.name, category.id)}`}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        {t("common.viewAll")} {language === "ar" ? category.name : category.nameEn}
                      </Link>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {language === "ar" ? "لا توجد تعريفات متاحة" : "No Definitions Available"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar"
                    ? "لم يتم العثور على أي تعريفات في الوقت الحالي"
                    : "No definitions found at the moment"}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Laws Tab Content */}
          <TabsContent value="laws" className="mt-0">
            {lawCategories.length > 0 ? (
              <Tabs defaultValue={lawCategories[0]?.id || ""} className="w-full">
                <TabsList
                  className={`w-full max-w-2xl mx-auto mb-8 flex flex-wrap justify-center ${
                    isRtl ? "flex-row-reverse" : ""
                  }`}
                >
                  {lawCategories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="flex-grow">
                      {language === "ar" ? category.name : category.nameEn}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {lawCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(isRtl ? [...(laws[category.id] || [])].reverse() : laws[category.id] || [])
                        .slice(0, 6)
                        .map((item, index) => {
                          const lawSlug = slugify(item.titleEn || item.title, item.id)
                          return (
                            <Link href={`/laws/${lawSlug}`} key={item.id}>
                              <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                              >
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                                  <CardHeader className="pb-2">
                                    <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                                      {language === "ar" ? item.title || item.titleEn : item.titleEn || item.title}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className={isRtl ? "text-right" : "text-left"}>
                                    <p className="text-muted-foreground line-clamp-4">
                                      {language === "ar"
                                        ? item.summary || item.summaryEn
                                        : item.summaryEn || item.summary}
                                    </p>
                                    <p className="text-sm text-primary mt-2">
                                      {new Date(item.issueDate).toLocaleDateString(
                                        "en-US",
                                      )}
                                    </p>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </Link>
                          )
                        })}
                    </div>
                    <div className="mt-8 text-center">
                      <Link
                        href={`/laws/category/${slugify(category.nameEn || category.name, category.id)}`}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        {t("common.viewAll")} {language === "ar" ? category.name : category.nameEn}
                      </Link>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {language === "ar" ? "لا توجد قوانين متاحة" : "No Laws Available"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar" ? "لم يتم العثور على أي قوانين في الوقت الحالي" : "No laws found at the moment"}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Framework Tab Content */}
          <TabsContent value="framework" className="mt-0">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md mx-auto mb-6">
                <Image
                  src="/images/cybersecurity-framework-circle.png"
                  alt="Cybersecurity Framework"
                  width={500}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
              <div className={`prose dark:prose-invert max-w-3xl mx-auto ${isRtl ? "text-right" : "text-left"}`}>
                <p className="text-lg mb-6">
                  {language === "ar"
                    ? "يوفر إطار عمل الأمن السيبراني نهجًا منظمًا لفهم وإدارة وتقليل مخاطر الأمن السيبراني."
                    : "The Cybersecurity Framework provides a structured approach to understanding, managing, and reducing cybersecurity risks."}
                </p>
                <div className="flex justify-center">
                  <Link
                    href="/framework"
                    className="
      inline-flex items-center justify-center
      rounded-md bg-blue-500 px-6 py-3
      text-base font-medium text-white
      no-underline
      hover:bg-blue-600 hover:no-underline
    "
                  >
                    {language === "ar" ? "استكشف" : "Explore"}
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Standards Tab Content */}
          <TabsContent value="standards" className="mt-0">
            <div
              className={`flex flex-wrap gap-8 ${isRtl ? "flex-row-reverse justify-end" : "justify-start"} md:justify-center`}
            >
              {(isRtl ? [...standardCategories].reverse() : standardCategories).map((category, index) => {
                const categoryStandards = standardsByCategory[category.id] || []
                const displayStandards = categoryStandards.slice(0, 2)
                const remainingCount = Math.max(0, categoryStandards.length - 2)
                const categorySlug = slugify(category.nameEn, category.id)

                // Get appropriate icon
                const iconKey = category.nameEn.toLowerCase() as keyof typeof icons
                const icon = icons[iconKey] || icons.international

                return (
                  <Link href={`/standards/${categorySlug}`} key={category.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="w-full md:w-80 lg:w-96"
                    >
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <div
                            className={`flex items-center gap-2 ${
                              isRtl ? "justify-end flex-row-reverse" : "justify-start"
                            }`}
                          >
                            {icon}
                            <CardTitle className={isRtl ? "text-right" : "text-left"}>
                              {language === "ar" ? category.nameAr : category.nameEn}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className={isRtl ? "text-right" : "text-left"}>
                          <div className="space-y-2">
                            {displayStandards.length > 0 ? (
                              <>
                                {displayStandards.map((standard, standardIndex) => (
                                  <div
                                    key={standardIndex}
                                    className={`p-3 bg-muted rounded-md ${isRtl ? "text-right" : "text-left"}`}
                                  >
                                    <h4 className={`font-medium ${isRtl ? "text-right" : "text-left"}`}>
                                      {language === "ar" ? standard.nameAr : standard.nameEn}
                                    </h4>
                                    <p
                                      className={`text-sm text-muted-foreground mt-1 line-clamp-2 ${
                                        isRtl ? "text-right" : "text-left"
                                      }`}
                                    >
                                      {language === "ar" ? standard.descriptionAr : standard.descriptionEn}
                                    </p>
                                  </div>
                                ))}
                                {remainingCount > 0 && (
                                  <div
                                    className={`text-primary text-sm font-medium ${
                                      isRtl ? "text-right" : "text-center"
                                    }`}
                                  >
                                    +{remainingCount} {t("common.more")}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className={`p-3 bg-muted rounded-md ${isRtl ? "text-right" : "text-center"}`}>
                                <p className={`text-muted-foreground ${isRtl ? "text-right" : "text-left"}`}>
                                  {language === "ar" ? "لا توجد معايير" : "No Standards"}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </SectionContainer>
    </div>
  )
}
