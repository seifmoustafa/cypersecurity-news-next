"use client"

import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRegulationCategories } from "@/core/hooks/use-regulation-categories"
import { useRegulationsByCategory } from "@/core/hooks/use-regulations"
import type { Regulation } from "@/core/domain/models/regulation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { getLocalizedText } from "@/lib/utils"
import { cn } from "@/lib/utils"

export default function CybersecurityRegulationSection() {
  const { language, t, isRtl } = useLanguage()

  // Fetch categories
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useRegulationCategories()

  if (categoriesLoading) {
    return (
      <div className={isRtl ? "rtl" : "ltr"} dir={isRtl ? "rtl" : "ltr"}>
        <div className="w-full flex justify-center mb-8">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 max-w-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
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
      </div>
    )
  }

  if (categoriesError) {
    return (
      <div className={isRtl ? "rtl" : "ltr"} dir={isRtl ? "rtl" : "ltr"}>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{categoriesError}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              refetchCategories()
            }}
          >
            {t("common.retry") || "Retry"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={isRtl ? "rtl" : "ltr"} dir={isRtl ? "rtl" : "ltr"}>
      {categories.length > 0 ? (
        <Tabs defaultValue={categories[0]?.id || ""} className="w-full">
          <TabsList
            className={`w-full max-w-2xl mx-auto mb-8 flex flex-wrap justify-center ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex-grow">
                {getLocalizedText(language, category.name, category.name_En)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <RegulationCategoryContent categoryId={category.id} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {language === "ar" ? "لا توجد لوائح متاحة" : "No Regulations Available"}
          </h3>
          <p className="text-muted-foreground">
            {language === "ar" ? "لم يتم العثور على أي لوائح في الوقت الحالي" : "No regulations found at the moment"}
          </p>
        </div>
      )}
    </div>
  )
}

interface RegulationCardProps {
  item: Regulation
  index: number
}

interface RegulationCategoryContentProps {
  categoryId: string
}

function RegulationCategoryContent({ categoryId }: RegulationCategoryContentProps) {
  const { language, isRtl } = useLanguage()
  const {
    regulations,
    loading: regulationsLoading,
    error: regulationsError,
  } = useRegulationsByCategory(categoryId, 1, 6)

  if (regulationsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="h-[300px] animate-pulse">
              <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (regulationsError) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{regulationsError}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
        {(isRtl ? [...regulations].reverse() : regulations)
          .slice(0, 6)
          .map((item, index) => (
            <RegulationCard key={item.id} item={item} index={index} />
          ))}
      </div>
      {regulations.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href={`/advanced/regulation/category/${categoryId}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            {language === "ar" ? "عرض الكل" : "View All"}
          </Link>
        </div>
      )}
      {regulations.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-muted-foreground ${isRtl ? "text-right" : "text-center"}`}>
            {language === "ar"
              ? "لا توجد لوائح متاحة في هذه الفئة حالياً"
              : "No regulations available in this category at the moment"}
          </p>
        </div>
      )}
    </>
  )
}

function RegulationCard({ item, index }: RegulationCardProps) {
  const { language, isRtl } = useLanguage()

  // Get title based on language
  const title = getLocalizedText(language, item.title, item.titleEn)

  // Get summary based on language
  const summary = getLocalizedText(language, item.summary, item.summaryEn)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/advanced/regulation/${item.id}`}>
        <Card className="overflow-hidden h-[280px] transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer border border-blue-200/30 dark:border-blue-800/30 flex flex-col">
          <div className="relative h-32 flex-shrink-0">
            <Image
              src={item.imageUrl || "/placeholder.svg?height=200&width=400"}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className={`text-lg font-bold text-white drop-shadow-md line-clamp-2 ${isRtl ? "text-right" : "text-left"}`}>{title}</h3>
            </div>
          </div>
          <CardContent className={`p-4 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/30 ${isRtl ? "text-right" : "text-left"} flex-1 overflow-hidden`}>
            <p className="text-muted-foreground line-clamp-4 text-sm text-ellipsis overflow-hidden">{summary}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
