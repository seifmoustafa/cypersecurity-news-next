"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { container } from "@/core/di/container"

interface RegulationCategoryPageClientProps {
  categoryId: string
}

export default function RegulationCategoryPageClient({ categoryId }: RegulationCategoryPageClientProps) {
  const { language, isRtl } = useLanguage()
  const [category, setCategory] = useState<any>(null)
  const [regulations, setRegulations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch category details
        const categoryData = await container.services.regulationCategories.getCategoryById(categoryId)
        console.log("Category data:", categoryData)
        
        if (!categoryData) {
          setError("Category not found")
          return
        }

        setCategory(categoryData)

        // Fetch regulations for this category
        const regulationsResponse = await container.services.regulations.getRegulationsByCategory(categoryData.id, 1, 100)
        console.log("Regulations response:", regulationsResponse)
        setRegulations(regulationsResponse?.data || [])
      } catch (error) {
        console.error("Error fetching category data:", error)
        setError("Failed to load category data")
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategoryData()
    }
  }, [categoryId])

  if (loading) {
    return (
      <div className="pt-36 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-300 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="pt-36 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="py-12">
            <h1 className="text-2xl font-bold mb-4 text-foreground">
              {language === "ar" ? "الفئة غير موجودة" : "Category Not Found"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || (language === "ar" ? "لم يتم العثور على الفئة المطلوبة" : "The requested category could not be found")}
            </p>
            <Link href="/advanced/regulation">
              <Button>
                {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                {language === "ar" ? "العودة إلى اللوائح" : "Back to Regulations"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const displayCategoryName = language === "ar" ? category.name : category.name_En

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">{displayCategoryName}</h1>
          <h2 className="text-xl text-foreground/80">
            {language === "ar" ? category.name_En : category.name}
          </h2>
          <div className="mt-4 text-sm text-muted-foreground">
            {language === "ar" ? `${regulations.length} لائحة متاحة` : `${regulations.length} regulations available`}
          </div>
        </div>

        {regulations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regulations.map((regulation) => (
              <RegulationCard key={regulation.id} regulation={regulation} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {language === "ar" ? `لا توجد لوائح متاحة حالياً` : `No regulations available at the moment`}
            </p>
            <Link
              href="/advanced/regulation"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
            >
              {language === "ar" ? "عرض جميع اللوائح" : "View All Regulations"}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function RegulationCard({ regulation }: { regulation: any }) {
  const { language, isRtl } = useLanguage()

  const displayTitle = language === "ar" ? regulation.title || regulation.titleEn : regulation.titleEn || regulation.title
  const displaySummary = language === "ar" ? regulation.summary || regulation.summaryEn : regulation.summaryEn || regulation.summary
  const date = regulation.issueDate ? new Date(regulation.issueDate) : regulation.createdAt ? new Date(regulation.createdAt) : new Date()

  // Don't render if no title
  if (!displayTitle) {
    return null
  }

  // Clean HTML tags from summary
  const cleanSummary = displaySummary.replace(/<\/?[^>]+(>|$)/g, "").trim()
  const hasValidSummary = cleanSummary && cleanSummary !== "string" && cleanSummary.length > 0

  return (
    <Link href={`/advanced/regulation/${regulation.id}`} className="group">
      <div className="bg-card border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <Badge variant="secondary" className="text-xs">
              {language === "ar" ? "لائحة" : "Regulation"}
            </Badge>
          </div>
          
          <h3 className="text-lg font-bold mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {displayTitle}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
            {hasValidSummary ? cleanSummary : ""}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{date.toLocaleDateString("en-US")}</span>
            </div>
            <span className="text-primary font-medium inline-flex items-center text-sm">
              {language === "ar" ? "اقرأ المزيد" : "Read More"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${isRtl ? "mr-1 rotate-180" : "ml-1"}`}
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
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
