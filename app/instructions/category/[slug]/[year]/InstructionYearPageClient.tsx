"use client"

import type { InstructionYear } from "@/core/domain/models/instruction-year"
import type { InstructionCategory } from "@/core/domain/models/instruction-category"
import type { Instruction } from "@/core/domain/models/instruction"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, FileText, Download, Calendar, Eye, Clock } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInstructionsByYearId } from "@/core/hooks/use-instructions"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { slugify } from "@/lib/utils"

interface InstructionYearPageClientProps {
  categorySlug: string
  yearNumber: number
  initialCategory: InstructionCategory
  initialYear: InstructionYear
}

function InstructionCard({
  instruction,
  language,
  categorySlug,
  yearNumber,
}: {
  instruction: Instruction
  language: string
  categorySlug: string
  yearNumber: number
}) {
  const title = language === "ar" ? instruction.title : instruction.titleEn
  const summary = language === "ar" ? instruction.summary : instruction.summaryEn
  const slug = slugify(instruction.titleEn || instruction.title, instruction.id)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(instruction.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          {instruction.imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={instruction.imageUrl || "/placeholder.svg"}
                alt={title}
                className="w-20 h-20 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {summary && <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{summary}</p>}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              {language === "ar" ? "تعليمات" : "Instructions"}
            </Badge>
            {instruction.isActive && (
              <Badge variant="default" className="text-xs">
                {language === "ar" ? "نشط" : "Active"}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {instruction.documentUrl && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={(e) => {
                  e.preventDefault()
                  window.open(instruction.documentUrl, "_blank")
                }}
              >
                <Download className="h-3 w-3" />
                {language === "ar" ? "تحميل" : "Download"}
              </Button>
            )}
            <Link href={`/instructions/category/${categorySlug}/${yearNumber}/${slug}`}>
              <Button size="sm" className="gap-1">
                <Eye className="h-3 w-3" />
                {language === "ar" ? "عرض" : "View"}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InstructionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="w-20 h-20 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function InstructionYearPageClient({
  categorySlug,
  yearNumber,
  initialCategory,
  initialYear,
}: InstructionYearPageClientProps) {
  const { language } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Debug: Log the year ID being passed
  console.log("Year ID being passed to hook:", initialYear.id)
  console.log("Full initialYear object:", initialYear)

  const { data, loading, error } = useInstructionsByYearId(initialYear.id, currentPage, pageSize)

  // Debug: Log the hook response
  console.log("Hook response - data:", data, "loading:", loading, "error:", error)

  const categoryTitle = language === "ar" ? initialCategory.name : initialCategory.nameEn

  if (error) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertDescription>
              {language === "ar"
                ? "حدث خطأ في تحميل التعليمات. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading instructions. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Link href={`/instructions/category/${categorySlug}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>{language === "ar" ? "رجوع" : "Back"}</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">
            {language === "ar"
              ? `تعليمات ${categoryTitle} - ${yearNumber}`
              : `${categoryTitle} Instructions - ${yearNumber}`}
          </h1>
        </div>

        {/* Year Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {language === "ar"
                ? `تعليمات الأمن السيبراني لعام ${yearNumber}`
                : `Cybersecurity Instructions for ${yearNumber}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {language === "ar"
                ? `جميع التعليمات الخاصة بـ${categoryTitle} لعام ${yearNumber}`
                : `All instructions for ${categoryTitle} for the year ${yearNumber}`}
            </p>
            {data && (
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {language === "ar" ? "إجمالي التعليمات:" : "Total Instructions:"} {data.pagination.itemsCount}
                </span>
                <span>
                  {language === "ar" ? "الصفحة:" : "Page:"} {data.pagination.currentPage}{" "}
                  {language === "ar" ? "من" : "of"} {data.pagination.pagesCount}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions List */}
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <InstructionSkeleton key={index} />
            ))}
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="space-y-6">
              {data.data.map((instruction) => (
                <InstructionCard
                  key={instruction.id}
                  instruction={instruction}
                  language={language}
                  categorySlug={categorySlug}
                  yearNumber={yearNumber}
                />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.pagesCount > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  {language === "ar" ? "السابق" : "Previous"}
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, data.pagination.pagesCount) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === data.pagination.pagesCount}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  {language === "ar" ? "التالي" : "Next"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === "ar" ? "لا توجد تعليمات" : "No Instructions Found"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? `لا توجد تعليمات متاحة لـ${categoryTitle} في عام ${yearNumber}`
                  : `No instructions available for ${categoryTitle} in ${yearNumber}`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
