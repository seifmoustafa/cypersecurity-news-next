import type { Metadata } from "next"
import { container } from "@/core/di/container"
import { notFound } from "next/navigation"
import RegulationCategoryPageClient from "./RegulationCategoryPageClient"
import MainLayout from "@/components/layouts/main-layout"

interface RegulationCategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: RegulationCategoryPageProps): Promise<Metadata> {
  const { slug } = params

  if (slug === "all") {
    return {
      title: "All Regulations | Cybersecurity Center",
      description: "Browse all cybersecurity regulations.",
    }
  }

  // Try to find the category by slug
  const category = await container.services.regulationCategories.getCategoryBySlug(slug)

  if (!category) {
    return {
      title: "Category Not Found | Cybersecurity Center",
      description: "The requested regulation category could not be found.",
    }
  }

  return {
    title: `${category.name_En} Regulations | Cybersecurity Center`,
    description: `Browse cybersecurity regulations in the ${category.name_En} category.`,
  }
}

export default async function RegulationCategoryPage({ params }: RegulationCategoryPageProps) {
  const { slug } = params

  if (slug === "all") {
    return (
      <MainLayout>
        <RegulationCategoryPageClient categorySlug="all" />
      </MainLayout>
    )
  }

  // Try to find the category by slug
  const category = await container.services.regulationCategories.getCategoryBySlug(slug)

  if (!category) {
    console.error(`Category not found for slug: ${slug}`)
    notFound()
  }

  console.log(`Found category for slug ${slug}:`, category)

  return (
    <MainLayout>
      <RegulationCategoryPageClient categorySlug={slug} categoryId={category.id} />
    </MainLayout>
  )
}
