"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { System, SystemsPaginatedResponse } from "@/core/domain/models/system"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Search, ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/layouts/main-layout"

interface SystemsPageClientProps {
  initialSystems: SystemsPaginatedResponse
}

export default function SystemsPageClient({ initialSystems }: SystemsPageClientProps) {
  const { language, isRtl, t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [systems, setSystems] = useState<System[]>(initialSystems.data || [])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page") || "1"))
  const [pagination, setPagination] = useState(initialSystems.pagination)

  const loadSystems = async (page: number, search?: string) => {
    try {
      setLoading(true)
      const response = await container.services.systems.getAllSystems(page, 12, search)
      setSystems(response.data)
      setPagination(response.pagination)
      setCurrentPage(page)

      // Update URL with search params
      const params = new URLSearchParams()
      if (search && search.trim()) {
        params.set("search", search.trim())
      }
      params.set("page", page.toString())

      const newUrl = `/systems${params.toString() ? `?${params.toString()}` : ""}`
      router.replace(newUrl, { scroll: false })
    } catch (error) {
      console.error("Error loading systems:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // Debounce search
    const timeoutId = setTimeout(() => {
      loadSystems(1, value)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleVisitSystem = (navigationUrl: string) => {
    if (!navigationUrl) return

    // Ensure URL has protocol
    const url = navigationUrl.startsWith("http") ? navigationUrl : `https://${navigationUrl}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/#systems"
              className={`inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 ${isRtl ? "flex-row-reverse" : ""}`}
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t("systemsPage.backToHome")}
            </Link>
            <h1 className={`text-4xl font-bold text-foreground mb-4 ${isRtl ? "text-right" : "text-left"}`}>
              {t("systemsPage.title")}
            </h1>
            <p className={`text-muted-foreground text-lg ${isRtl ? "text-right" : "text-left"}`}>
              {t("systemsPage.subtitle")}
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search
                className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 ${isRtl ? "right-3" : "left-3"}`}
              />
              <Input
                type="text"
                placeholder={t("systemsPage.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className={`${isRtl ? "pr-10 text-right" : "pl-10"}`}
              />
            </div>
          </div>

          {/* Systems Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : systems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {systems.map((system) => (
                <Card
                  key={system.id}
                  className="hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => handleVisitSystem(system.navigationUrl)}
                >
                  <CardContent className="p-6">
                    {system.imageUrl && (
                      <div className="relative h-32 mb-4 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={system.imageUrl || "/placeholder.svg"}
                          alt={system.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=128&width=128"
                          }}
                        />
                      </div>
                    )}
                    <h3 className={`text-xl font-semibold text-foreground mb-2 ${isRtl ? "text-right" : "text-left"}`}>
                      {system.name}
                    </h3>
                    <p className={`text-muted-foreground mb-4 line-clamp-2 ${isRtl ? "text-right" : "text-left"}`}>
                      {system.summary}
                    </p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVisitSystem(system.navigationUrl)
                      }}
                      disabled={!system.navigationUrl}
                      className={`w-full ${isRtl ? "flex-row-reverse" : ""}`}
                      variant="default"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t("systems.visitSystem")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchTerm ? t("systemsPage.noSearchResults") : t("systemsPage.noSystems")}
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pagesCount > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                onClick={() => loadSystems(currentPage - 1, searchTerm)}
                disabled={currentPage === 1 || loading}
                variant="outline"
              >
                {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {t("common.previous")}
              </Button>

              <span className="text-foreground">
                {t("common.pageOf", { current: currentPage, total: pagination.pagesCount })}
              </span>

              <Button
                onClick={() => loadSystems(currentPage + 1, searchTerm)}
                disabled={currentPage === pagination.pagesCount || loading}
                variant="outline"
              >
                {t("common.next")}
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
