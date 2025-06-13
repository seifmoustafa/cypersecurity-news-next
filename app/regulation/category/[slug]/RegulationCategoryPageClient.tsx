"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { useRegulationCategory } from "@/core/hooks/use-regulation-categories"
import { useRegulationsByCategory } from "@/core/hooks/use-regulations"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { slugify } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface RegulationCategoryPageClientProps {
  categorySlug: string
  categoryId?: string
}

export default function RegulationCategoryPageClient({ categorySlug, categoryId }: RegulationCategoryPageClientProps) {
  const { language, isRtl } = useLanguage()
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(categoryId)

  // Only fetch category if we don't already have the ID
  const {
    category,
    loading: categoryLoading,
    error: categoryError,
  } = useRegulationCategory(categoryId ? undefined : categorySlug)

  // Set the category ID once we have it from the hook
  useEffect(() => {
    if (!categoryId && category) {
      setActiveCategoryId(category.id)
    }
  }, [category, categoryId])

  const {
    regulations,
    loading: regulationsLoading,
    error: regulationsError,
    pagination,
  } = useRegulationsByCategory(activeCategoryId || "", 1, 10)

  const loading = (!categoryId && categoryLoading) || regulationsLoading
  const error = categoryError || regulationsError

  const getCategoryName = () => {
    if (categorySlug === "all") {
      return language === "ar" ? "كافة اللوائح" : "All Regulations"
    }

    if (category) {
      return language === "ar" ? category.name : category.name_En
    }

    // Fallback if category is not yet loaded
    return language === "ar" ? "فئة اللوائح" : "Regulations Category"
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/#regulation">
            <Button variant="ghost" className="group flex items-center text-muted-foreground hover:text-foreground">
              {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
              {language === "ar" ? "العودة إلى اللوائح" : "Back to Regulations"}
            </Button>
          </Link>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/#regulation">
          <Button variant="ghost" className="group flex items-center text-muted-foreground hover:text-foreground">
            {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
            {language === "ar" ? "العودة إلى اللوائح" : "Back to Regulations"}
          </Button>
        </Link>
      </div>

      {loading ? (
        <>
          <div className="mb-8">
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden h-[300px] animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              {language === "ar" ? `${getCategoryName()}` : `${getCategoryName()}`}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === "ar" ? `${regulations.length} لائحة متاحة` : `${regulations.length} regulations available`}
            </p>
          </div>

          {regulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regulations.map((regulation) => (
                <RegulationCard key={regulation.id} regulation={regulation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {language === "ar"
                  ? "لا توجد لوائح متاحة في هذه الفئة حالياً"
                  : "No regulations available in this category at the moment"}
              </p>
              <Link href="/#regulation">
                <Button variant="default">{language === "ar" ? "عرض جميع اللوائح" : "View All Regulations"}</Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function RegulationCard({ regulation }: { regulation: any }) {
  const { language, isRtl } = useLanguage()

  // Get title based on language
  const title = language === "ar" ? regulation.title : regulation.titleEn

  // Get summary based on language
  const summary = language === "ar" ? regulation.summary : regulation.summaryEn

  // Create slug from English title for URL
  const slug = slugify(regulation.titleEn)

  return (
    <Link href={`/regulation/${slug}`}>
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer border border-blue-200/30 dark:border-blue-800/30">
        <div className="relative h-48">
          <Image
            src={regulation.imageUrl || "/placeholder.svg?height=200&width=400"}
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
  )
}
