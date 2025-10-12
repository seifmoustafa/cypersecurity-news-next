"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Home, Building, BookOpen, FileCode, Shield, Scale, FileText } from "lucide-react"
import Link from "next/link"
import { container } from "@/core/di/container"
import type { Definition, DefinitionCategory } from "@/core/domain/models/definition"
import type { Domain } from "@/core/domain/models/framework"
import type { StandardCategory, Standard } from "@/core/domain/models/standard"
import type { Law } from "@/core/domain/models/law"
import type { LawCategory } from "@/core/domain/models/law-category"
import CyberSecurityRegulationSection from "@/components/sections/cybersecurity-regulation-section"
import Image from "next/image"
import { getLocalizedText } from "@/lib/utils"

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
    regulation: <FileText className="h-5 w-5" />,
    framework: <FileCode className="h-5 w-5" />,
  }

  if (loading) {
    return (
      <SectionContainer id="standards" className="bg-muted/30">
        <SectionHeader title={t("section.cybersecurityConcepts")} subtitle={t("cybersecurityConcepts.subtitle")} />
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded max-w-md mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
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
      <SectionContainer id="standards" className="bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-950/30 dark:via-slate-900 dark:to-blue-950/20">
        <SectionHeader title={t("section.cybersecurityConcepts")} subtitle={t("cybersecurityConcepts.subtitle")} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`mx-auto mb-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
            <TabsTrigger value="definitions" className="flex-1 font-semibold transition-all duration-300 hover:scale-105">
              <span className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tabIcons.definitions}
                <span>{t("section.definitions")}</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="laws" className="flex-1 font-semibold transition-all duration-300 hover:scale-105">
              <span className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tabIcons.laws}
                <span>{t("section.laws")}</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="regulation" className="flex-1 font-semibold transition-all duration-300 hover:scale-105">
              <span className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tabIcons.regulation}
                <span>{t("section.regulation")}</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="framework" className="flex-1 font-semibold transition-all duration-300 hover:scale-105">
              <span className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tabIcons.framework}
                <span>{t("section.framework")}</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
                      {(isRtl ? [...(definitions[category.id] || [])].reverse() : definitions[category.id] || [])
                        .slice(0, 6)
                        .map((item, index) => {
                          return (
                            <Link href={`/advanced/definitions/${item.id}`} key={item.id}>
                              <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                              >
                                <Card className="h-[320px] hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30">
                                  <CardHeader className="pb-4">
                                    <CardTitle className={`text-xl font-bold ${isRtl ? "text-right" : "text-left"} group-hover:text-primary transition-colors duration-300`}>
                                      {language === "ar" ? item.term || item.termEn : item.termEn || item.term}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className={`${isRtl ? "text-right" : "text-left"} flex-1 overflow-hidden p-6 pt-0`}>
                                    <p className="text-muted-foreground line-clamp-5 text-ellipsis overflow-hidden leading-relaxed">
                                      {language === "ar"
                                        ? item.definitionText || item.definitionEn
                                        : item.definitionEn || item.definitionText}
                                    </p>
                                    <div className="mt-4 inline-flex items-center text-primary font-semibold group-hover:gap-2 transition-all duration-300">
                                      {language === "ar" ? "اقرأ المزيد" : "Read More"}
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? "mr-2 rotate-180" : "ml-2"}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                                        />
                                      </svg>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </Link>
                          )
                        })}
                    </div>
                    <div className="mt-12 text-center">
                      <Link
                        href={`/advanced/definitions/category/${category.id}`}
                        className="inline-flex items-center gap-3 justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 text-base font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/40 border border-blue-500/30 dark:border-blue-400/30"
                      >
                        {t("common.viewAll")} {language === "ar" ? category.name : category.nameEn}
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
                      {(isRtl ? [...(laws[category.id] || [])].reverse() : laws[category.id] || [])
                        .slice(0, 6)
                        .map((item, index) => {
                          return (
                            <Link href={`/advanced/laws/${item.id}`} key={item.id}>
                              <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                              >
                                <Card className="h-[280px] hover:shadow-md transition-shadow cursor-pointer flex flex-col">
                                  <CardHeader className="pb-2">
                                    <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                                      {language === "ar" ? item.title || item.titleEn : item.titleEn || item.title}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className={`${isRtl ? "text-right" : "text-left"} flex-1 overflow-hidden flex flex-col`}>
                                    <p className="text-muted-foreground line-clamp-3 text-ellipsis overflow-hidden flex-1">
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
                        href={`/advanced/laws/category/${category.id}`}
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

          {/* Regulation Tab Content */}
          <TabsContent value="regulation" className="mt-0">
            <CyberSecurityRegulationSection />
          </TabsContent>

          {/* Enhanced Framework Tab Content */}
          <TabsContent value="framework" className="mt-0">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-lg mx-auto mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
                  <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/30 border border-blue-200/30 dark:border-blue-800/30">
                    <Image
                      src="/images/cybersecurity-framework-circle.png"
                      alt="Cybersecurity Framework"
                      width={500}
                      height={500}
                      className="w-full h-auto rounded-2xl"
                    />
                  </div>
                </div>
              </div>
              <div className={`prose dark:prose-invert max-w-4xl mx-auto ${isRtl ? "text-right" : "text-left"}`}>
                <p className="text-xl mb-8 leading-relaxed font-medium">
                  {language === "ar"
                    ? "يوفر إطار عمل الأمن السيبراني نهجًا منظمًا لفهم وإدارة وتقليل مخاطر الأمن السيبراني."
                    : "The Cybersecurity Framework provides a structured approach to understanding, managing, and reducing cybersecurity risks."}
                </p>
                <div className="flex justify-center">
                  <Link
                    href="/advanced/framework"
                    className="inline-flex items-center gap-3 justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-10 py-4 text-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/40 border border-blue-500/30 dark:border-blue-400/30"
                  >
                    {language === "ar" ? "استكشف" : "Explore"}
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>


        </Tabs>
      </SectionContainer>
    </div>
  )
}
