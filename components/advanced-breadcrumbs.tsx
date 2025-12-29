"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Home, ChevronRight, ChevronLeft } from "lucide-react"

export interface AdvancedBreadcrumbItem {
      label: string
      labelAr?: string
      href?: string
}

interface AdvancedBreadcrumbsProps {
      items: AdvancedBreadcrumbItem[]
      isLoading?: boolean
}

export default function AdvancedBreadcrumbs({ items, isLoading = false }: AdvancedBreadcrumbsProps) {
      const { language } = useLanguage()
      const isRtl = language === "ar"

      // Get the display label based on language
      const getLabel = (item: AdvancedBreadcrumbItem) => {
            if (language === "ar" && item.labelAr) {
                  return item.labelAr
            }
            return item.label
      }

      if (isLoading) {
            return (
                  <nav className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
                        {/* Home Link Skeleton */}
                        <div className="flex items-center text-gray-400 dark:text-gray-600">
                              <Home className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                              <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>

                        {/* Breadcrumb Items Skeleton */}
                        {items.map((_, index) => (
                              <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span className="text-gray-400 dark:text-gray-500">
                                          {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </span>
                                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                              </div>
                        ))}
                  </nav>
            )
      }

      return (
            <nav className="flex items-center flex-wrap gap-2 mb-6 text-sm">
                  {/* Home Link */}
                  <Link
                        href="/advanced"
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                        <Home className="h-4 w-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                        <span className="font-medium">{language === "ar" ? "الرئيسية" : "Home"}</span>
                  </Link>

                  {/* Breadcrumb Items */}
                  {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                              <span className="text-muted-foreground/50">
                                    {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </span>
                              {item.href ? (
                                    <Link
                                          href={item.href}
                                          className="font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 line-clamp-1"
                                    >
                                          {getLabel(item)}
                                    </Link>
                              ) : (
                                    <span className="font-medium text-foreground line-clamp-1">
                                          {getLabel(item)}
                                    </span>
                              )}
                        </div>
                  ))}
            </nav>
      )
}
