"use client"

import { useLanguage } from "@/components/language-provider"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react"
import type { Definition, DefinitionCategory } from "@/core/domain/models/definition"

interface DefinitionCategoryPageClientProps {
  category: DefinitionCategory
  definitions: Definition[]
  pagination?: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export default function DefinitionCategoryPageClient({
  category,
  definitions = [],
  pagination,
}: DefinitionCategoryPageClientProps) {
  const { language, isRtl } = useLanguage()

  const categoryName = language === "ar" ? category.name : category.nameEn
  const definitionsCount = pagination?.itemsCount || definitions.length

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button to Standards */}
          <div className={`mb-6 ${isRtl ? "text-right" : "text-left"}`}>
            <Link href="/#standards">
              <Button variant="ghost" size="sm" className={`gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                <span>{language === "ar" ? "العودة للمعايير" : "Back to Standards"}</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className={`flex items-center justify-center gap-3 mb-4 ${isRtl ? "flex-row-reverse" : ""}`}>
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">{categoryName}</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {definitionsCount} {language === "ar" ? "تعريف في هذه الفئة" : "definitions in this category"}
            </p>
          </div>

          {/* Definitions Grid */}
          {definitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {definitions.map((definition) => {
                const displayTerm =
                  language === "ar" ? definition.term || definition.termEn : definition.termEn || definition.term
                const displayDefinition =
                  language === "ar"
                    ? definition.definitionText || definition.definitionEn
                    : definition.definitionEn || definition.definitionText

                return (
                  <Link href={`/definitions/${definition.id}`} key={definition.id}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <CardHeader className="pb-3">
                        <CardTitle
                          className={`text-xl group-hover:text-primary transition-colors ${isRtl ? "text-right" : "text-left"}`}
                        >
                          {displayTerm}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className={isRtl ? "text-right" : "text-left"}>
                        <p className="text-muted-foreground line-clamp-4 mb-4">{displayDefinition}</p>
                        {definition.source && (
                          <div
                            className={`flex items-center gap-2 text-sm text-primary ${isRtl ? "flex-row-reverse" : ""}`}
                          >
                            <BookOpen className="h-4 w-4" />
                            <span>
                              {language === "ar" ? "المصدر:" : "Source:"} {definition.source}
                            </span>
                          </div>
                        )}
                        <div className={`mt-4 ${isRtl ? "text-right" : "text-left"}`}>
                          <span className="text-primary font-medium hover:underline">
                            {language === "ar" ? "اقرأ المزيد" : "Read More"} →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">
                {language === "ar" ? "لا توجد تعريفات" : "No Definitions Found"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "لم يتم العثور على أي تعريفات في هذه الفئة"
                  : "No definitions found in this category"}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
