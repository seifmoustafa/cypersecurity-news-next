"use client"

import { useMemo } from "react"
import { useLanguage } from "@/components/language-provider"
import type { AdvancedBreadcrumbItem } from "@/components/advanced-breadcrumbs"

// ============================================
// PROCEDURES MODULE
// ============================================

export function useProcedureBreadcrumbs(
      procedureName?: string,
      procedureNameAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const { language } = useLanguage()

      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  {
                        label: "Procedures",
                        labelAr: "الإجراءات",
                        href: "/advanced/procedures",
                  },
            ]

            if (procedureName || procedureNameAr) {
                  breadcrumbs.push({
                        label: procedureName || procedureNameAr || "",
                        labelAr: procedureNameAr || procedureName || "",
                  })
            }

            return breadcrumbs
      }, [procedureName, procedureNameAr])

      return { items, isLoading: false }
}

export function useProcedureControlBreadcrumbs(
      procedureId: string,
      procedureName?: string,
      procedureNameAr?: string,
      controlName?: string,
      controlNameAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Procedures", labelAr: "الإجراءات", href: "/advanced/procedures" },
                  {
                        label: procedureName || "Procedure",
                        labelAr: procedureNameAr || "الإجراء",
                        href: `/advanced/procedures/${procedureId}`
                  },
            ]

            if (controlName || controlNameAr) {
                  breadcrumbs.push({
                        label: controlName || controlNameAr || "",
                        labelAr: controlNameAr || controlName || "",
                  })
            }

            return breadcrumbs
      }, [procedureId, procedureName, procedureNameAr, controlName, controlNameAr])

      return { items, isLoading: false }
}

// ============================================
// STANDARDS MODULE
// ============================================

export function useStandardsBreadcrumbs(
      categoryId?: string,
      categoryName?: string,
      categoryNameAr?: string,
      standardName?: string,
      standardNameAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Standards", labelAr: "المعايير", href: "/advanced#security-requirements" },
            ]

            if (categoryId && (categoryName || categoryNameAr)) {
                  breadcrumbs.push({
                        label: categoryName || categoryNameAr || "",
                        labelAr: categoryNameAr || categoryName || "",
                        href: `/advanced/standards/${categoryId}`,
                  })
            }

            if (standardName || standardNameAr) {
                  breadcrumbs.push({
                        label: standardName || standardNameAr || "",
                        labelAr: standardNameAr || standardName || "",
                  })
            }

            return breadcrumbs
      }, [categoryId, categoryName, categoryNameAr, standardName, standardNameAr])

      return { items, isLoading: false }
}

// ============================================
// AWARENESS MODULE
// ============================================

export function useAwarenessBreadcrumbs(
      year?: string,
      articleName?: string,
      articleNameAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Awareness", labelAr: "التوعية", href: "/advanced/awareness" },
            ]

            if (year) {
                  breadcrumbs.push({
                        label: year,
                        labelAr: year,
                        href: `/advanced/awareness/${year}`,
                  })
            }

            if (articleName || articleNameAr) {
                  breadcrumbs.push({
                        label: articleName || articleNameAr || "",
                        labelAr: articleNameAr || articleName || "",
                  })
            }

            return breadcrumbs
      }, [year, articleName, articleNameAr])

      return { items, isLoading: false }
}

// ============================================
// NEWS MODULE
// ============================================

export function useNewsBreadcrumbs(
      categoryId?: string,
      categoryName?: string,
      categoryNameAr?: string,
      newsTitle?: string,
      newsTitleAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "News", labelAr: "الأخبار", href: "/advanced/news" },
            ]

            if (categoryId && (categoryName || categoryNameAr)) {
                  breadcrumbs.push({
                        label: categoryName || categoryNameAr || "",
                        labelAr: categoryNameAr || categoryName || "",
                        href: `/advanced/news/category/${categoryId}`,
                  })
            }

            if (newsTitle || newsTitleAr) {
                  breadcrumbs.push({
                        label: newsTitle || newsTitleAr || "",
                        labelAr: newsTitleAr || newsTitle || "",
                  })
            }

            return breadcrumbs
      }, [categoryId, categoryName, categoryNameAr, newsTitle, newsTitleAr])

      return { items, isLoading: false }
}

// ============================================
// LAWS MODULE
// ============================================

export function useLawsBreadcrumbs(
      categoryId?: string,
      categoryName?: string,
      categoryNameAr?: string,
      lawTitle?: string,
      lawTitleAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Laws", labelAr: "القوانين", href: "/advanced/laws" },
            ]

            if (categoryId && (categoryName || categoryNameAr)) {
                  breadcrumbs.push({
                        label: categoryName || categoryNameAr || "",
                        labelAr: categoryNameAr || categoryName || "",
                        href: `/advanced/laws/category/${categoryId}`,
                  })
            }

            if (lawTitle || lawTitleAr) {
                  breadcrumbs.push({
                        label: lawTitle || lawTitleAr || "",
                        labelAr: lawTitleAr || lawTitle || "",
                  })
            }

            return breadcrumbs
      }, [categoryId, categoryName, categoryNameAr, lawTitle, lawTitleAr])

      return { items, isLoading: false }
}

// ============================================
// REGULATION MODULE
// ============================================

export function useRegulationBreadcrumbs(
      categoryId?: string,
      categoryName?: string,
      categoryNameAr?: string,
      regulationTitle?: string,
      regulationTitleAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Regulations", labelAr: "اللوائح", href: "/advanced/regulations" },
            ]

            if (categoryId && (categoryName || categoryNameAr)) {
                  breadcrumbs.push({
                        label: categoryName || categoryNameAr || "",
                        labelAr: categoryNameAr || categoryName || "",
                        href: `/advanced/regulations/category/${categoryId}`,
                  })
            }

            if (regulationTitle || regulationTitleAr) {
                  breadcrumbs.push({
                        label: regulationTitle || regulationTitleAr || "",
                        labelAr: regulationTitleAr || regulationTitle || "",
                  })
            }

            return breadcrumbs
      }, [categoryId, categoryName, categoryNameAr, regulationTitle, regulationTitleAr])

      return { items, isLoading: false }
}

// ============================================
// DEFINITIONS MODULE
// ============================================

export function useDefinitionsBreadcrumbs(
      categoryId?: string,
      categoryName?: string,
      categoryNameAr?: string,
      term?: string,
      termAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Definitions", labelAr: "المصطلحات", href: "/advanced#definitions" },
            ]

            if (categoryId && (categoryName || categoryNameAr)) {
                  breadcrumbs.push({
                        label: categoryName || categoryNameAr || "",
                        labelAr: categoryNameAr || categoryName || "",
                        href: `/advanced/definitions/category/${categoryId}`,
                  })
            }

            if (term || termAr) {
                  breadcrumbs.push({
                        label: term || termAr || "",
                        labelAr: termAr || term || "",
                  })
            }

            return breadcrumbs
      }, [categoryId, categoryName, categoryNameAr, term, termAr])

      return { items, isLoading: false }
}

// ============================================
// PERSONAL PROTECT MODULE
// ============================================

export function usePersonalProtectBreadcrumbs(
      categoryId?: string,
      categoryName?: string,
      categoryNameAr?: string,
      subcategoryId?: string,
      subcategoryName?: string,
      subcategoryNameAr?: string,
      controlId?: string,
      controlName?: string,
      controlNameAr?: string,
      stepName?: string,
      stepNameAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Personal Protection", labelAr: "الحماية الشخصية", href: "/advanced/personal-protect" },
            ]

            if (categoryId && (categoryName || categoryNameAr)) {
                  breadcrumbs.push({
                        label: categoryName || categoryNameAr || "",
                        labelAr: categoryNameAr || categoryName || "",
                        href: `/advanced/personal-protect/${categoryId}`,
                  })
            }

            if (subcategoryId && (subcategoryName || subcategoryNameAr)) {
                  breadcrumbs.push({
                        label: subcategoryName || subcategoryNameAr || "",
                        labelAr: subcategoryNameAr || subcategoryName || "",
                        href: `/advanced/personal-protect/${categoryId}/${subcategoryId}`,
                  })
            }

            if (controlId && (controlName || controlNameAr)) {
                  breadcrumbs.push({
                        label: controlName || controlNameAr || "",
                        labelAr: controlNameAr || controlName || "",
                        href: `/advanced/personal-protect/${categoryId}/${subcategoryId}/${controlId}`,
                  })
            }

            if (stepName || stepNameAr) {
                  breadcrumbs.push({
                        label: stepName || stepNameAr || "",
                        labelAr: stepNameAr || stepName || "",
                  })
            }

            return breadcrumbs
      }, [categoryId, categoryName, categoryNameAr, subcategoryId, subcategoryName, subcategoryNameAr, controlId, controlName, controlNameAr, stepName, stepNameAr])

      return { items, isLoading: false }
}

// ============================================
// INSTRUCTIONS MODULE
// ============================================

export function useInstructionsBreadcrumbs(
      categoryId?: string,
      categoryName?: string,
      categoryNameAr?: string,
      yearId?: string,
      year?: string,
      instructionTitle?: string,
      instructionTitleAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Instructions", labelAr: "التعليمات", href: "/advanced/instructions/category" },
            ]

            if (categoryId && (categoryName || categoryNameAr)) {
                  breadcrumbs.push({
                        label: categoryName || categoryNameAr || "",
                        labelAr: categoryNameAr || categoryName || "",
                        href: `/advanced/instructions/category/${categoryId}`,
                  })
            }

            if (yearId && year) {
                  breadcrumbs.push({
                        label: year,
                        labelAr: year,
                        href: `/advanced/instructions/category/${categoryId}/${yearId}`,
                  })
            }

            if (instructionTitle || instructionTitleAr) {
                  breadcrumbs.push({
                        label: instructionTitle || instructionTitleAr || "",
                        labelAr: instructionTitleAr || instructionTitle || "",
                  })
            }

            return breadcrumbs
      }, [categoryId, categoryName, categoryNameAr, yearId, year, instructionTitle, instructionTitleAr])

      return { items, isLoading: false }
}

// ============================================
// PRESENTATIONS MODULE
// ============================================

export function usePresentationsBreadcrumbs(
      presentationName?: string,
      presentationNameAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Presentations", labelAr: "العروض التقديمية", href: "/advanced/presentations" },
            ]

            if (presentationName || presentationNameAr) {
                  breadcrumbs.push({
                        label: presentationName || presentationNameAr || "",
                        labelAr: presentationNameAr || presentationName || "",
                  })
            }

            return breadcrumbs
      }, [presentationName, presentationNameAr])

      return { items, isLoading: false }
}

// ============================================
// ARTICLES MODULE
// ============================================

export function useArticlesBreadcrumbs(
      articleTitle?: string,
      articleTitleAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Articles", labelAr: "المقالات", href: "/advanced/articles" },
            ]

            if (articleTitle || articleTitleAr) {
                  breadcrumbs.push({
                        label: articleTitle || articleTitleAr || "",
                        labelAr: articleTitleAr || articleTitle || "",
                  })
            }

            return breadcrumbs
      }, [articleTitle, articleTitleAr])

      return { items, isLoading: false }
}

// ============================================
// LECTURES MODULE
// ============================================

export function useLecturesBreadcrumbs(
      categoryId?: string,
      categoryName?: string,
      categoryNameAr?: string,
      lectureName?: string,
      lectureNameAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Lectures", labelAr: "المحاضرات", href: "/advanced/lectures" },
            ]

            if (categoryId && (categoryName || categoryNameAr)) {
                  breadcrumbs.push({
                        label: categoryName || categoryNameAr || "",
                        labelAr: categoryNameAr || categoryName || "",
                        href: `/advanced/lectures/${categoryId}`,
                  })
            }

            if (lectureName || lectureNameAr) {
                  breadcrumbs.push({
                        label: lectureName || lectureNameAr || "",
                        labelAr: lectureNameAr || lectureName || "",
                  })
            }

            return breadcrumbs
      }, [categoryId, categoryName, categoryNameAr, lectureName, lectureNameAr])

      return { items, isLoading: false }
}

// ============================================
// MEDIA MODULE
// ============================================

export function useMediaBreadcrumbs(
      mediaType: "video" | "lecture" | "presentation",
      mediaName?: string,
      mediaNameAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const mediaTypeLabels = {
            video: { en: "Videos", ar: "الفيديوهات" },
            lecture: { en: "Lectures", ar: "المحاضرات" },
            presentation: { en: "Presentations", ar: "العروض التقديمية" },
      }

      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  {
                        label: mediaTypeLabels[mediaType].en,
                        labelAr: mediaTypeLabels[mediaType].ar,
                        href: `/advanced/media/${mediaType}`
                  },
            ]

            if (mediaName || mediaNameAr) {
                  breadcrumbs.push({
                        label: mediaName || mediaNameAr || "",
                        labelAr: mediaNameAr || mediaName || "",
                  })
            }

            return breadcrumbs
      }, [mediaType, mediaName, mediaNameAr])

      return { items, isLoading: false }
}

// ============================================
// FRAMEWORK MODULE
// ============================================

export function useFrameworkBreadcrumbs(
      domainName?: string,
      domainNameAr?: string
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      const items = useMemo(() => {
            const breadcrumbs: AdvancedBreadcrumbItem[] = [
                  { label: "Framework", labelAr: "الإطار", href: "/advanced/framework" },
            ]

            if (domainName || domainNameAr) {
                  breadcrumbs.push({
                        label: domainName || domainNameAr || "",
                        labelAr: domainNameAr || domainName || "",
                  })
            }

            return breadcrumbs
      }, [domainName, domainNameAr])

      return { items, isLoading: false }
}

// ============================================
// GENERIC SIMPLE BREADCRUMBS
// ============================================

export function useSimpleAdvancedBreadcrumbs(
      items: AdvancedBreadcrumbItem[]
): { items: AdvancedBreadcrumbItem[]; isLoading: boolean } {
      return { items, isLoading: false }
}
