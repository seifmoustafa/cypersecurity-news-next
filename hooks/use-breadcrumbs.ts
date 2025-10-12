"use client"

import { useLanguage } from "@/components/language-provider"
import { useDefinition } from "@/core/hooks/use-definition"
import { useDefinitionCategories } from "@/core/hooks/use-definition-categories"
import { useNewsItem } from "@/core/hooks/use-news-item"
import { useNewsCategories } from "@/core/hooks/use-news-categories"
import { useAwarenessById } from "@/core/hooks/use-awareness"
import { useReference } from "@/core/hooks/use-reference"
import { usePersonalProtectControlStep } from "@/core/hooks/use-personal-protect-control-step"
import { usePersonalProtectControlSteps } from "@/core/hooks/use-personal-protect-control-steps"
import { usePersonalProtectControls } from "@/core/hooks/use-personal-protect-controls"
import { usePersonalProtectSubCategories } from "@/core/hooks/use-personal-protect-subcategories"
import { usePersonalProtectCategories } from "@/core/hooks/use-personal-protect-categories"
import { useLectureCategories } from "@/core/hooks/use-lecture-categories"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbConfig {
  items: BreadcrumbItem[]
  isLoading: boolean
}

// Utility function to get localized name with fallback
function getLocalizedName(item: any, language: string): string {
  if (!item) return ""
  
  // Handle different data structures
  if (item.name && item.nameEn) {
    // For categories with name/nameEn structure
    return language === "ar" ? item.name : (item.nameEn || item.name)
  }
  
  if (item.title && item.titleEn) {
    // For items with title/titleEn structure
    return language === "ar" ? item.title : (item.titleEn || item.title)
  }
  
  if (item.term && item.termEn) {
    // For definitions with term/termEn structure
    return language === "ar" ? item.term : (item.termEn || item.term)
  }
  
  // Fallback to any available name field
  return item.name || item.title || item.term || item.label || "Unknown"
}

// Category name mappings for static categories
const categoryNameMappings: Record<string, { ar: string; en: string }> = {
  general: { ar: "عام", en: "General" },
  technical: { ar: "تقني", en: "Technical" },
  legal: { ar: "قانوني", en: "Legal" },
  management: { ar: "إدارة", en: "Management" },
  awareness: { ar: "توعية", en: "Awareness" },
  news: { ar: "أخبار", en: "News" },
  articles: { ar: "مقالات", en: "Articles" },
  lectures: { ar: "محاضرات", en: "Lectures" },
  presentations: { ar: "عروض تقديمية", en: "Presentations" },
  references: { ar: "مراجع", en: "References" },
  videos: { ar: "فيديوهات", en: "Videos" },
  personalProtect: { ar: "الحماية الشخصية", en: "Personal Protection" }
}

function getCategoryName(categoryId: string, language: string): string {
  const mapping = categoryNameMappings[categoryId]
  if (mapping) {
    return language === "ar" ? mapping.ar : mapping.en
  }
  return categoryId // Fallback to ID if no mapping found
}

// Hook for definition breadcrumbs
export function useDefinitionBreadcrumbs(categoryId: string, definitionId: string): BreadcrumbConfig {
  const { language } = useLanguage()
  const { definition, loading: definitionLoading } = useDefinition(definitionId)
  const { categories, loading: categoriesLoading } = useDefinitionCategories(1, 100)
  
  const isLoading = definitionLoading || categoriesLoading
  
  // Find the category by ID
  const category = categories.find(cat => cat.id === categoryId)
  
  const items: BreadcrumbItem[] = [
    { label: language === "ar" ? "دليل المصطلحات" : "Definitions", href: "/simple/definitions-categories" },
    { 
      label: category ? getLocalizedName(category, language) : getCategoryName(categoryId, language),
      href: `/simple/definitions-categories/${categoryId}`
    },
    { 
      label: definition ? getLocalizedName(definition, language) : (language === "ar" ? "المفهوم" : "Definition")
    }
  ]
  
  return { items, isLoading }
}

// Hook for news breadcrumbs
export function useNewsBreadcrumbs(newsId: string, categoryId?: string): BreadcrumbConfig {
  const { language } = useLanguage()
  const { news, loading: newsLoading } = useNewsItem(newsId)
  const { categories, loading: categoriesLoading } = useNewsCategories(1, 100)
  
  const isLoading = newsLoading || categoriesLoading
  
  // Find the category by ID (use provided categoryId or news.category)
  const category = categoryId ? categories.find(cat => cat.id === categoryId) : 
                   (news?.category ? categories.find(cat => cat.id === news.category) : null)
  
  const items: BreadcrumbItem[] = [
    { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
    { label: language === "ar" ? "فئات الأخبار" : "News Categories", href: "/simple/news-categories" },
    ...(category ? [{
      label: getLocalizedName(category, language),
      href: `/simple/news-categories/${category.id}`
    }] : []),
    { 
      label: news ? getLocalizedName(news, language) : (language === "ar" ? "الخبر" : "News")
    }
  ]
  
  return { items, isLoading }
}

// Hook for awareness breadcrumbs
export function useAwarenessBreadcrumbs(year: string, articleId: string): BreadcrumbConfig {
  const { language } = useLanguage()
  const { awareness, loading } = useAwarenessById(articleId)
  
  // Use the awareness article directly
  const article = awareness
  
  const items: BreadcrumbItem[] = [
    { label: language === "ar" ? "التوعية" : "Awareness", href: "/simple/awareness" },
    { 
      label: year,
      href: `/simple/awareness/year/${year}`
    },
    { 
      label: article ? getLocalizedName(article, language) : (language === "ar" ? "النشرة" : "Article")
    }
  ]
  
  return { items, isLoading: loading }
}

// Hook for media article breadcrumbs
export function useMediaArticleBreadcrumbs(articleId: string): BreadcrumbConfig {
  const { language } = useLanguage()
  
  // For now, we'll use a simple approach since we don't have the specific hook
  const items: BreadcrumbItem[] = [
    { label: language === "ar" ? "المكتبة الإعلامية" : "Media Library", href: "/simple/media" },
    { label: language === "ar" ? "المقالات" : "Articles", href: "/simple/media/articles" },
    { 
      label: language === "ar" ? "المقال" : "Article"
    }
  ]
  
  return { items, isLoading: false }
}

// Hook for lecture breadcrumbs
export function useLectureBreadcrumbs(categoryId: string, lectureId: string, lectureName?: string): BreadcrumbConfig {
  const { language } = useLanguage()
  
  const { categories: lectureCategories, loading: categoriesLoading } = useLectureCategories(1, 100)
  
  // Find the category by ID
  const category = lectureCategories.find(cat => cat.id === categoryId)
  
  // Use provided lecture name or fallback
  const displayLectureName = lectureName || (language === "ar" ? "المحاضرة" : "Lecture")
  
  const items: BreadcrumbItem[] = [
    { label: language === "ar" ? "المكتبة الثقافية" : "Media Library", href: "/simple/media" },
    { label: language === "ar" ? "المحاضرات" : "Lectures", href: "/simple/media/lectures" },
    { 
      label: category ? getLocalizedName(category, language) : (language === "ar" ? "فئة المحاضرات" : "Lecture Category"),
      href: `/simple/media/lectures/${categoryId}`
    },
    { 
      label: displayLectureName
    }
  ]
  
  return { items, isLoading: categoriesLoading }
}

// Hook for presentation breadcrumbs
export function usePresentationBreadcrumbs(lessonId: string, presentationId: string): BreadcrumbConfig {
  const { language } = useLanguage()
  
  const items: BreadcrumbItem[] = [
    { label: language === "ar" ? "المكتبة الإعلامية" : "Media Library", href: "/simple/media" },
    { label: language === "ar" ? "الدروس" : "Lessons", href: "/simple/media/lessons" },
    { label: language === "ar" ? "العروض التقديمية" : "Presentations", href: "/simple/media/lessons/presentations" },
    { 
      label: language === "ar" ? "العرض التقديمي" : "Presentation"
    }
  ]
  
  return { items, isLoading: false }
}

// Hook for reference breadcrumbs
export function useReferenceBreadcrumbs(referenceId: string): BreadcrumbConfig {
  const { language } = useLanguage()
  const { reference, loading } = useReference(referenceId)
  
  const items: BreadcrumbItem[] = [
    { label: language === "ar" ? "المكتبة الإعلامية" : "Media Library", href: "/simple/media" },
    { label: language === "ar" ? "المراجع" : "References", href: "/simple/media/references" },
    { 
      label: reference ? getLocalizedName(reference, language) : (language === "ar" ? "المرجع" : "Reference")
    }
  ]
  
  return { items, isLoading: loading }
}

// Hook for personal protect breadcrumbs
export function usePersonalProtectBreadcrumbs(
  categoryId: string, 
  subCategoryId: string, 
  controlId: string, 
  stepId: string
): BreadcrumbConfig {
  const { language } = useLanguage()
  const { categories, loading: categoriesLoading } = usePersonalProtectCategories(1, 100)
  const { subCategories, loading: subCategoriesLoading } = usePersonalProtectSubCategories(categoryId, 1, 100)
  const { controls, loading: controlsLoading } = usePersonalProtectControls(subCategoryId, 1, 100)
  const { step, loading: stepLoading } = usePersonalProtectControlStep(stepId)
  
  const isLoading = categoriesLoading || subCategoriesLoading || controlsLoading || stepLoading
  
  // Find the items by ID
  const category = categories.find(cat => cat.id === categoryId)
  const subCategory = subCategories.find(sub => sub.id === subCategoryId)
  const control = controls.find(ctrl => ctrl.id === controlId)
  
  const items: BreadcrumbItem[] = [
    { label: language === "ar" ? "الحماية الشخصية" : "Personal Protection", href: "/simple/personal-protect" },
    { 
      label: category ? getLocalizedName(category, language) : (language === "ar" ? "الفئة" : "Category"),
      href: `/simple/personal-protect/${categoryId}`
    },
    { 
      label: subCategory ? getLocalizedName(subCategory, language) : (language === "ar" ? "الفئة الفرعية" : "Sub Category"),
      href: `/simple/personal-protect/${categoryId}/${subCategoryId}`
    },
    { 
      label: control ? getLocalizedName(control, language) : (language === "ar" ? "التحكم" : "Control"),
      href: `/simple/personal-protect/${categoryId}/${subCategoryId}/${controlId}`
    },
    { 
      label: step ? getLocalizedName(step, language) : (language === "ar" ? "الخطوة" : "Step")
    }
  ]
  
  return { items, isLoading }
}

// Generic hook for simple breadcrumbs (when no dynamic data is needed)
export function useSimpleBreadcrumbs(items: BreadcrumbItem[]): BreadcrumbConfig {
  return { items, isLoading: false }
}