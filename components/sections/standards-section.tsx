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
import type { Definition } from "@/core/domain/models/definition"
import type { Domain } from "@/core/domain/models/framework"
import type { StandardCategory } from "@/core/domain/models/standard"
import type { Law, LawCategory } from "@/core/domain/models/law"
import Image from "next/image"

export default function CybersecurityConceptsSection() {
  const { t, language, isRtl } = useLanguage()
  const [definitions, setDefinitions] = useState<Record<string, Definition[]>>({})
  const [domains, setDomains] = useState<Domain[]>([])
  const [standardCategories, setStandardCategories] = useState<StandardCategory[]>([])
  const [lawCategories, setLawCategories] = useState<LawCategory[]>([])
  const [laws, setLaws] = useState<Record<string, Law[]>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("definitions")

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

        // Fetch law categories and laws
        // This is a placeholder until the actual service is implemented
        const lawCategoriesData = [
          {
            id: "presidential-decrees",
            name: {
              ar: "القرارات الجمهورية",
              en: "Presidential Decrees",
            },
            description: {
              ar: "القرارات الجمهورية المتعلقة بالأمن السيبراني",
              en: "Presidential decrees related to cybersecurity",
            },
          },
          {
            id: "executive-regulations",
            name: {
              ar: "اللوائح التنفيذية",
              en: "Executive Regulations",
            },
            description: {
              ar: "اللوائح التنفيذية للأمن السيبراني",
              en: "Cybersecurity executive regulations",
            },
          },
          {
            id: "policies",
            name: {
              ar: "السياسات",
              en: "Policies",
            },
            description: {
              ar: "سياسات الأمن السيبراني",
              en: "Cybersecurity policies",
            },
          },
        ]

        setLawCategories(lawCategoriesData)

        // Mock laws data by category
        const lawsData: Record<string, Law[]> = {
          "presidential-decrees": [
            {
              id: "1",
              title: {
                ar: "المرسوم الملكي رقم (م/6) بتاريخ 1442/1/8هـ",
                en: "Royal Decree No. (M/6) dated 8/1/1442 AH",
              },
              category: "presidential-decrees",
              description: {
                ar: "مرسوم ملكي بشأن تنظيم الهيئة الوطنية للأمن السيبراني",
                en: "Royal decree regarding the organization of the National Cybersecurity Authority",
              },
              content: {
                ar: "محتوى المرسوم الملكي",
                en: "Content of the royal decree",
              },
              publishDate: "2020-08-28",
              documentUrl: "https://example.com/royal-decree-m6.pdf",
            },
          ],
          "executive-regulations": [
            {
              id: "2",
              title: {
                ar: "اللائحة التنفيذية للأمن السيبراني",
                en: "Cybersecurity Executive Regulation",
              },
              category: "executive-regulations",
              description: {
                ar: "اللائحة التنفيذية للأمن السيبراني الصادرة عن الهيئة الوطنية للأمن السيبراني",
                en: "Cybersecurity Executive Regulation issued by the National Cybersecurity Authority",
              },
              content: {
                ar: "محتوى اللائحة التنفيذية",
                en: "Content of the executive regulation",
              },
              publishDate: "2022-03-15",
              documentUrl: "https://example.com/cybersecurity-executive-regulation.pdf",
            },
            {
              id: "4",
              title: {
                ar: "الضوابط الأساسية للأمن السيبراني",
                en: "Essential Cybersecurity Controls",
              },
              category: "executive-regulations",
              description: {
                ar: "الضوابط الأساسية للأمن السيبراني الصادرة عن الهيئة الوطنية للأمن السيبراني",
                en: "Essential Cybersecurity Controls issued by the National Cybersecurity Authority",
              },
              content: {
                ar: "محتوى الضوابط الأساسية",
                en: "Content of the essential controls",
              },
              publishDate: "2022-01-10",
              documentUrl: "https://example.com/essential-cybersecurity-controls.pdf",
            },
          ],
          policies: [
            {
              id: "3",
              title: {
                ar: "السياسة الوطنية للأمن السيبراني",
                en: "National Cybersecurity Policy",
              },
              category: "policies",
              description: {
                ar: "السياسة الوطنية للأمن السيبراني في المملكة العربية السعودية",
                en: "National Cybersecurity Policy in the Kingdom of Saudi Arabia",
              },
              content: {
                ar: "محتوى السياسة الوطنية",
                en: "Content of the national policy",
              },
              publishDate: "2021-06-20",
              documentUrl: "https://example.com/national-cybersecurity-policy.pdf",
            },
            {
              id: "5",
              title: {
                ar: "الإطار التنظيمي للأمن السيبراني للأنظمة الحساسة",
                en: "Regulatory Framework for Cybersecurity of Critical Systems",
              },
              category: "policies",
              description: {
                ar: "الإطار التنظيمي للأمن السيبراني للأنظمة الحساسة في القطاعات الحيوية",
                en: "Regulatory Framework for Cybersecurity of Critical Systems in Vital Sectors",
              },
              content: {
                ar: "محتوى الإطار التنظيمي",
                en: "Content of the regulatory framework",
              },
              publishDate: "2021-09-05",
              documentUrl: "https://example.com/regulatory-framework-critical-systems.pdf",
            },
          ],
        }

        setLaws(lawsData)
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
    <SectionContainer id="standards" className="bg-muted/30">
      <SectionHeader title={t("section.cybersecurityConcepts")} subtitle={t("cybersecurityConcepts.subtitle")} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`mx-auto mb-8 ${isRtl ? "flex-row-reverse" : ""}`}>
          <TabsTrigger value="definitions" className="flex-1">
            <span className="flex items-center gap-2">
              {tabIcons.definitions}
              <span>{t("section.definitions")}</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="laws" className="flex-1">
            <span className="flex items-center gap-2">
              {tabIcons.laws}
              <span>{t("section.laws")}</span>
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

        {/* Laws Tab Content */}
        <TabsContent value="laws" className="mt-0">
          <Tabs defaultValue="presidential-decrees" className="w-full">
            <TabsList
              className={`w-full max-w-2xl mx-auto mb-8 flex flex-wrap justify-center ${isRtl ? "flex-row-reverse" : ""}`}
            >
              {lawCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex-grow">
                  {category.name[language]}
                </TabsTrigger>
              ))}
            </TabsList>

            {lawCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {laws[category.id]?.map((item, index) => (
                    <Link href={`/laws/${item.id}`} key={item.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                          <CardHeader className="pb-2">
                            <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                              {item.title[language]}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className={isRtl ? "text-right" : "text-left"}>
                            <p className="text-muted-foreground line-clamp-4">{item.description[language]}</p>
                            <p className="text-sm text-primary mt-2">
                              {new Date(item.publishDate).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href={`/laws/category/${category.id}`}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {t("common.viewAll")} {category.name[language]}
                  </Link>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* Framework Tab Content */}
        <TabsContent value="framework" className="mt-0">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md mx-auto mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dI27cBudyF5803ufbRQIQ74OVrIoKr.png"
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
