"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { useRegulations } from "@/core/hooks/use-regulations"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { slugify, getLocalizedText } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"

export default function AllRegulationsPageClient() {
  const { language, isRtl } = useLanguage()
  const [page, setPage] = useState(1)
  const pageSize = 12

  const { regulations, loading, error, pagination, refetch } = useRegulations(page, pageSize)

  // Reset to page 1 when language changes
  useEffect(() => {
    setPage(1)
  }, [language])

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/#regulation">
              <Button variant="ghost" className="group flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {language === "ar" ? "العودة إلى اللوائح" : "Back to Regulations"}
              </Button>
            </Link>
          </div>

          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="flex justify-center mt-8">
            <Button onClick={() => refetch()}>{language === "ar" ? "إعادة المحاولة" : "Try Again"}</Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/#regulation">
            <Button variant="ghost" className="group flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {language === "ar" ? "العودة إلى اللوائح" : "Back to Regulations"}
            </Button>
          </Link>
        </div>

        {loading ? (
          <>
            <div className="mb-8 text-center">
              <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
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
                {language === "ar" ? "جميع اللوائح" : "All Regulations"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {language === "ar"
                  ? `${pagination?.itemsCount || 0} لائحة متاحة`
                  : `${pagination?.itemsCount || 0} regulations available`}
              </p>
            </div>

            {regulations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regulations.map((regulation) => (
                    <RegulationCard key={regulation.id} regulation={regulation} />
                  ))}
                </div>

                {pagination && pagination.pagesCount > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination currentPage={page} totalPages={pagination.pagesCount} onPageChange={setPage} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  {language === "ar" ? "لا توجد لوائح متاحة حالياً" : "No regulations available at the moment"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}

function RegulationCard({ regulation }: { regulation: any }) {
  const { language, isRtl } = useLanguage()

  // Get title based on language
  const title = getLocalizedText(language, regulation.title, regulation.titleEn)

  // Get summary based on language
  const summary = getLocalizedText(language, regulation.summary, regulation.summaryEn)

  // Create slug from English title for URL
  const slug = slugify(regulation.titleEn, regulation.id)

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
