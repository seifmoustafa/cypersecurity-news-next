"use client"
import { useInstructionYearsByCategory } from "@/core/hooks/use-instruction-years"
import type { InstructionCategory } from "@/core/domain/models/instruction-category"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { getLocalizedText } from "@/lib/utils"

interface InstructionCategoryPageClientProps {
  categorySlug: string
  initialCategory: InstructionCategory
}

export default function InstructionCategoryPageClient({
  categorySlug,
  initialCategory,
}: InstructionCategoryPageClientProps) {
  const { language } = useLanguage()
  const {
    years,
    loading: yearsLoading,
    error: yearsError,
    refetch: refetchYears,
  } = useInstructionYearsByCategory(initialCategory.id)

  const categoryTitle = getLocalizedText(language, initialCategory.name, initialCategory.nameEn)

  if (yearsLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (yearsError) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href="/#security-requirements">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">{categoryTitle}</h1>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between w-full">
              <span>{yearsError.message}</span>
              <Button variant="outline" size="sm" onClick={() => refetchYears()}>
                {language === "ar" ? "إعادة المحاولة" : "Retry"}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center">
          <Link href="/#security-requirements">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>{language === "ar" ? "رجوع" : "Back"}</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">{categoryTitle}</h1>
        </div>

        <div className="mb-8 text-center">
          <p className="text-muted-foreground text-lg">
            {language === "ar"
              ? `اختر السنة لعرض تعليمات ${categoryTitle}`
              : `Select a year to view ${categoryTitle} instructions`}
          </p>
        </div>

        {years.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              {language === "ar" ? "لا توجد سنوات متاحة لهذه الفئة" : "No years available for this category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {years.map((yearItem, index) => (
              <Link
                key={yearItem.id}
                href={`/instructions/category/${categorySlug}/${yearItem.year}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="mb-4 p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors">
                        <Calendar className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-primary group-hover:text-primary/80 transition-colors">
                        {yearItem.year}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === "ar" ? `تعليمات عام ${yearItem.year}` : `${yearItem.year} Instructions`}
                      </p>
                      <div className="mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {language === "ar" ? "انقر للعرض" : "Click to view"}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
