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
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"

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
