
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  Users, 
  ChevronLeft, 
  Laptop, 
  Smartphone, 
  Monitor,
  Database,
  Lock,
  Eye,
  Download,
  Play,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { getLocalizedText } from "@/lib/utils"
import { usePersonalProtectCategories } from "@/core/hooks/use-personal-protect-categories"
import { usePersonalProtectSubCategories } from "@/core/hooks/use-personal-protect-sub-categories"
import { PersonalProtectCategory } from "@/core/domain/models/personal-protect"

// Tab icons mapping
const tabIcons: Record<string, React.ReactNode> = {
  laptop: <Laptop className="h-5 w-5" />,
  smartphone: <Smartphone className="h-5 w-5" />,
  monitor: <Monitor className="h-5 w-5" />,
  database: <Database className="h-5 w-5" />,
  lock: <Lock className="h-5 w-5" />,
  default: <Shield className="h-5 w-5" />
}

export default function PersonalProtectProceduresContent() {
  const { language, isRtl } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  // Fetch categories
  const { categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = usePersonalProtectCategories("", 1, 10)

  // Fetch sub-categories for active category
  const { 
    subCategories, 
    loading: subCategoriesLoading, 
    error: subCategoriesError,
    refetch: refetchSubCategories
  } = usePersonalProtectSubCategories(activeCategory || "", 1, 3) // Only fetch first 3

  // Set first category as active when data loads
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id)
    }
  }, [categories, activeCategory])

  const getCategoryIcon = (category: PersonalProtectCategory) => {
    const name = category.nameEn?.toLowerCase() || category.name?.toLowerCase() || ""
    if (name.includes("laptop")) return tabIcons.laptop
    if (name.includes("phone") || name.includes("mobile")) return tabIcons.smartphone
    if (name.includes("monitor") || name.includes("screen")) return tabIcons.monitor
    if (name.includes("database") || name.includes("data")) return tabIcons.database
    if (name.includes("lock") || name.includes("security")) return tabIcons.lock
    return tabIcons.default
  }

  // Loading state for categories
  if (categoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {language === "ar" ? "الحماية الشخصية" : "Personal Protect Procedures"}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "ar"
              ? "الحماية الشخصية للأفراد والمستخدمين لحماية بياناتهم ومعلوماتهم"
              : "Personal protection procedures for individuals and users to protect their data and information"}
          </p>
        </div>
        
        {/* Loading skeleton for tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-10 w-32" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="h-48">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-5 bg-muted rounded w-2/3"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error state for categories
  if (categoriesError) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {language === "ar" ? "الحماية الشخصية" : "Personal Protect Procedures"}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "ar"
              ? "الحماية الشخصية للأفراد والمستخدمين لحماية بياناتهم ومعلوماتهم"
              : "Personal protection procedures for individuals and users to protect their data and information"}
          </p>
        </div>
        
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-center">
            {language === "ar" ? "حدث خطأ في تحميل الإجراءات" : "Error loading procedures"}
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <Button onClick={refetchCategories} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {language === "ar" ? "إعادة المحاولة" : "Try Again"}
          </Button>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {language === "ar" ? "الحماية الشخصية" : "Personal Protect Procedures"}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "ar"
              ? "الحماية الشخصية للأفراد والمستخدمين لحماية بياناتهم ومعلوماتهم"
              : "Personal protection procedures for individuals and users to protect their data and information"}
          </p>
        </div>
        
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {language === "ar" ? "لا توجد إجراءات متاحة" : "No procedures available"}
          </h3>
          <p className="text-muted-foreground">
            {language === "ar" ? "لم يتم العثور على أي إجراءات في الوقت الحالي" : "No procedures found at the moment"}
          </p>
        </div>
      </div>
    )
  }

  const activeCategoryData = categories.find(c => c.id === activeCategory)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold mb-2">
          {language === "ar" ? "الحماية الشخصية" : "Personal Protect Procedures"}
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === "ar"
            ? "الحماية الشخصية للأفراد والمستخدمين لحماية بياناتهم ومعلوماتهم"
            : "Personal protection procedures for individuals and users to protect their data and information"}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => {
            const title = getLocalizedText(language, category.name, category.nameEn)
            const isActive = activeCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
              >
                {getCategoryIcon(category)}
                <span className="truncate max-w-[120px]">{title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Category Content */}
      {activeCategory && activeCategoryData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-2">
              {getLocalizedText(language, activeCategoryData.name, activeCategoryData.nameEn)}
            </h4>
            <p className="text-muted-foreground">
              {getLocalizedText(language, activeCategoryData.description, activeCategoryData.descriptionEn)}
            </p>
          </div>
          
          {/* Sub Categories Grid */}
          {subCategoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="h-48">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-5 bg-muted rounded w-2/3"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : subCategoriesError ? (
            <div className="text-center py-8">
              <Alert variant="destructive" className="max-w-md mx-auto mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {language === "ar" ? "حدث خطأ في تحميل الفئات الفرعية" : "Error loading sub categories"}
                </AlertDescription>
              </Alert>
              <Button onClick={refetchSubCategories} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {language === "ar" ? "إعادة المحاولة" : "Try Again"}
              </Button>
            </div>
          ) : subCategories.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {language === "ar" ? "لا توجد فئات فرعية متاحة" : "No sub categories available"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ar" ? "لم يتم العثور على أي فئات فرعية لهذه الفئة" : "No sub categories found for this category"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subCategories.map((subCategory) => {
                  const title = getLocalizedText(language, subCategory.name, subCategory.nameEn)
                  const description = getLocalizedText(language, subCategory.description, subCategory.descriptionEn)
                  
                  return (
                    <Link key={subCategory.id} href={`/advanced/personal-protect/${activeCategoryData.id}/${subCategory.id}`}>
                      <Card className="h-full hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer group border-l-4 border-l-green-500/20 hover:border-l-green-500">
                        <CardHeader className="pb-2">
                          <CardTitle className={`text-lg ${isRtl ? "text-right" : "text-left"}`}>
                            {title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className={isRtl ? "text-right" : "text-left"}>
                          <p className="text-muted-foreground line-clamp-3">
                            {description || (language === "ar" 
                              ? "وصف الفئة الفرعية مع معلومات مفصلة حول الإجراءات المطلوبة"
                              : "Sub category description with detailed information about required procedures"
                            )}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {language === "ar" ? "عرض التفاصيل" : "View Details"}
                            </Badge>
                            <div className="w-2 h-2 bg-green-500/30 rounded-full group-hover:bg-green-500 transition-colors"></div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>

              {/* View More Button */}
              <div className="text-center">
                <Link href={`/advanced/personal-protect/${activeCategoryData.id}`}>
                  <Button variant="outline" className="gap-2">
                    <span>{language === "ar" ? "عرض جميع الفئات الفرعية" : "View All Sub Categories"}</span>
                    <ChevronLeft className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}