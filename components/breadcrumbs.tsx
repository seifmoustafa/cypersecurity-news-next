"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Home, ChevronRight, ChevronLeft } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  isLoading?: boolean
}

export default function Breadcrumbs({ items, isLoading = false }: BreadcrumbsProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"

  if (isLoading) {
    return (
      <nav className="flex items-center space-x-2 rtl:space-x-reverse mb-8">
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
    <nav className="flex items-center space-x-2 rtl:space-x-reverse mb-8">
      {/* Home Link */}
      <Link 
        href="/simple" 
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
      >
        <Home className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
        <span className="text-sm font-medium">{language === "ar" ? "الرئيسية" : "Home"}</span>
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-gray-400 dark:text-gray-500">
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
          {item.href ? (
            <Link 
              href={item.href}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}