import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import StandardsCategoryPageClient from "./StandardsCategoryPageClient"

interface PageProps {
  params: {
    categoryId: string
  }
  searchParams: {
    page?: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const category = await container.standardsService.getStandardCategoryById(params.categoryId)

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
  const page = Number.parseInt(searchParams.page || "1", 10)

  try {
    const category = await container.standardsService.getStandardCategoryById(params.categoryId)

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
