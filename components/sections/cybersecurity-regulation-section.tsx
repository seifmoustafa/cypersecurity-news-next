"use client"

import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRegulationCategories } from "@/core/hooks/use-regulation-categories"
import { useRegulationsByCategory } from "@/core/hooks/use-regulations"
import type { Regulation } from "@/core/domain/models/regulation"
import SectionContainer from "@/components/ui/section-container"
import SectionHeader from "@/components/ui/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { slugify, getLocalizedText } from "@/lib/utils"
import { cn } from "@/lib/utils"

export default function CybersecurityRegulationSection() {
  const { language, t, isRtl } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [tabsKey, setTabsKey] = useState<number>(0) // Used to force re-render of Tabs component

  // Fetch categories
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useRegulationCategories()

  // Fetch regulations by category
  const {
    regulations,
    loading: regulationsLoading,
    error: regulationsError,
    refetch: refetchRegulations,
  } = useRegulationsByCategory(activeCategory || "", 1, 6)

  // Set the first category as active when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id)
      // Increment tabsKey to force re-render of Tabs with the correct default value
      setTabsKey((prev) => prev + 1)
    }
  }, [categories, activeCategory])

  const handleTabChange = (value: string) => {
    setActiveCategory(value)
  }

  const loading = categoriesLoading || regulationsLoading
  const error = categoriesError || regulationsError

  // Get the current active category name for the "View More" link
  const getActiveCategorySlug = () => {
    if (!activeCategory) return "all"
    const activeItem = categories.find((c) => c.id === activeCategory)
    return activeItem ? slugify(activeItem.name_En, activeItem.id) : "all"
  }

  if (loading && !activeCategory) {
    return (
      <SectionContainer id="regulation">
        <SectionHeader title={t("section.regulation")} subtitle={t("regulation.subtitle")} />
        <div className="w-full flex justify-center mb-8">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 max-w-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[300px] animate-pulse">
              <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>
    )
  }

  if (error) {
    return (
      <SectionContainer id="regulation">
        <SectionHeader title={t("section.regulation")} subtitle={t("regulation.subtitle")} />
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              refetchCategories()
              if (activeCategory) refetchRegulations()
            }}
          >
            {t("common.retry") || "Retry"}
          </Button>
        </div>
      </SectionContainer>
    )
  }

  // Don't render until we have an active category
  if (!activeCategory) {
    return null
  }

  return (
    <SectionContainer id="regulation">
      <SectionHeader title={t("section.regulation")} subtitle={t("regulation.subtitle")} />

      <Tabs key={tabsKey} value={activeCategory} className="w-full mb-8" onValueChange={handleTabChange}>
        <div className="flex justify-center w-full">
          <TabsList className={cn("h-auto flex-wrap gap-1 p-1 w-auto inline-flex", isRtl ? "flex-row-reverse" : "")}>
            {categories.map((category, index) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={cn("px-4 py-2 h-auto whitespace-nowrap", index === 0 && isRtl ? "font-arabic" : "")}
                dir={index === 0 && isRtl ? "rtl" : undefined}
              >
                {getLocalizedText(language, category.name, category.name_En)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {regulationsLoading
          ? // Show loading skeletons when switching categories
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="h-[300px] animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))
          : regulations.map((item, index) => <RegulationCard key={item.id} item={item} index={index} />)}
      </div>

      {regulations.length > 0 && !regulationsLoading && (
        <div className="mt-8 text-center">
          <Link href={`/regulation/category/${getActiveCategorySlug()}`}>
            <Button variant="outline">{language === "ar" ? "عرض المزيد" : "View More"}</Button>
          </Link>
        </div>
      )}

      {regulations.length === 0 && !regulationsLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            {language === "ar"
              ? "لا توجد لوائح متاحة في هذه الفئة حالياً"
              : "No regulations available in this category at the moment"}
          </p>
        </div>
      )}
    </SectionContainer>
  )
}

interface RegulationCardProps {
  item: Regulation
  index: number
}

function RegulationCard({ item, index }: RegulationCardProps) {
  const { language } = useLanguage()

  // Get title based on language
  const title = getLocalizedText(language, item.title, item.titleEn)

  // Get summary based on language
  const summary = getLocalizedText(language, item.summary, item.summaryEn)

  // Create slug from English title for URL
  const slug = slugify(item.titleEn, item.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/regulation/${slug}`}>
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer border border-blue-200/30 dark:border-blue-800/30">
          <div className="relative h-48">
            <Image
              src={item.imageUrl || "/placeholder.svg?height=200&width=400"}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white drop-shadow-md">{title}</h3>
            </div>
          </div>
          <CardContent className="p-6 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/30">
            <p className="text-muted-foreground line-clamp-2">{summary}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
