import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import { slugify } from "@/lib/utils"
import StandardCategoryPageClient from "./StandardCategoryPageClient"

interface StandardCategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    page?: string
  }
}

async function findCategoryBySlug(slug: string) {
  try {
    console.log(`🔍 Finding standard category by slug: ${slug}`)

    const categoriesResponse = await container.services.standards.getAllStandardCategories(1, 100)
    const category = categoriesResponse.data.find(
      (cat) => slugify(cat.nameEn || "", cat.id) === slug,
    )

    if (!category) {
      console.log(`❌ Category not found for slug: ${slug}`)
      return null
    }

    console.log(`✅ Found category: ${category.nameEn} (${category.id})`)
    return category
  } catch (error) {
    console.error("❌ Error finding category by slug:", error)
    throw error
  }
}

export async function generateMetadata({ params }: StandardCategoryPageProps): Promise<Metadata> {
  try {
    const category = await findCategoryBySlug(params.category)

    if (!category) {
      return {
        title: "Category Not Found",
        description: "The requested standards category could not be found.",
      }
    }

    return {
      title: `${category.nameEn} Standards | Cybersecurity Portal`,
      description: `Browse all ${category.nameEn.toLowerCase()} cybersecurity standards and frameworks.`,
      keywords: `${category.nameEn}, cybersecurity standards, security frameworks`,
    }
  } catch (error) {
    return {
      title: "Standards Category",
      description: "Browse cybersecurity standards by category.",
    }
  }
}

export default async function StandardCategoryPage({ params, searchParams }: StandardCategoryPageProps) {
  const page = Number.parseInt(searchParams.page || "1", 10)

  try {
    const category = await findCategoryBySlug(params.category)

    if (!category) {
      notFound()
    }

    const standardsResponse = await container.services.standards.getStandardsByCategory(category.id, page, 12)

    return <StandardCategoryPageClient category={category} initialStandards={standardsResponse} initialPage={page} />
  } catch (error) {
    console.error("❌ Error in StandardCategoryPage:", error)
    notFound()
  }
}
