import { container } from "@/core/di/container"
import { notFound } from "next/navigation"
import DefinitionCategoryPageClient from "./DefinitionCategoryPageClient"
import type { Metadata } from "next"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await container.services.definitions.getCategoryById(params.id)

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
    const category = await container.services.definitions.getCategoryById(params.id)

    if (!category) {
      notFound()
    }

    const definitionsResponse = await container.services.definitions.getDefinitionsByCategory(category.id, 1, 50)

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
