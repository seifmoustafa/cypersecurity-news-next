import { container } from "@/core/di/container"
import { notFound } from "next/navigation"
import DefinitionCategoryPageClient from "./DefinitionCategoryPageClient"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = await container.services.definitions.getCategoryById(resolvedParams.id)

  if (!category) {
    return {
      title: "Definition Category Not Found",
    }
  }

  return {
    title: `${category.nameEn || category.name} - Definitions`,
    description: `Browse definitions in the ${category.nameEn || category.name} category`,
  }
}

export default async function DefinitionCategoryPage({ params }: PageProps) {
  try {
    const resolvedParams = await params
    const category = await container.services.definitions.getCategoryById(resolvedParams.id)

    if (!category) {
      notFound()
    }

    const definitionsResponse = await container.services.definitions.getDefinitionsByCategoryForProfessionals(category.id, 1, 50, "س")

    return (
      <DefinitionCategoryPageClient
        category={category}
        definitions={definitionsResponse?.data || []}
        pagination={definitionsResponse?.pagination}
      />
    )
  } catch (error) {
    console.error("Error in DefinitionCategoryPage:", error)
    notFound()
  }
}