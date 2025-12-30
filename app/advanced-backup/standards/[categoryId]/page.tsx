import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import StandardsCategoryPageClient from "./StandardsCategoryPageClient"

interface PageProps {
  params: Promise<{
    categoryId: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const category = await container.standardsService.getStandardCategoryById(resolvedParams.categoryId)

    if (!category) {
      return {
        title: "Category Not Found",
        description: "The requested standards category could not be found.",
      }
    }

    return {
      title: `${category.nameEn} Standards | Cybersecurity Portal`,
      description: `Browse all ${(category.nameEn ?? "").toLowerCase()} cybersecurity standards and frameworks.`,
      keywords: `${category.nameEn}, cybersecurity standards, security frameworks`,
    }
  } catch (error) {
    return {
      title: "Standards Category",
      description: "Browse cybersecurity standards by category.",
    }
  }
}

export default async function StandardsCategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const page = Number.parseInt(resolvedSearchParams.page || "1", 10)

  try {
    const category = await container.standardsService.getStandardCategoryById(resolvedParams.categoryId)

    if (!category) {
      notFound()
    }

    const standardsResponse = await container.standardsService.getStandardsByCategory(category.id, page, 12)

    return <StandardsCategoryPageClient category={category} initialStandards={standardsResponse} initialPage={page} />
  } catch (error) {
    console.error("❌ Error in StandardsCategoryPage:", error)
    notFound()
  }
}
