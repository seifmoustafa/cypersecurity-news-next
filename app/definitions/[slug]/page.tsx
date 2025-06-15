import { container } from "@/core/di/container"
import { notFound } from "next/navigation"
import DefinitionPageClient from "./DefinitionPageClient"
import type { Metadata } from "next"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const definition = await container.services.definitions.getDefinitionBySlug(params.slug)

  if (!definition) {
    return {
      title: "Definition Not Found",
    }
  }

  return {
    title: `${definition.termEn || definition.term} - Definition`,
    description: definition.definitionEn || definition.definitionText,
  }
}

export default async function DefinitionPage({ params }: PageProps) {
  try {
    const definition = await container.services.definitions.getDefinitionBySlug(params.slug)

    if (!definition) {
      notFound()
    }

    // Get the category information
    const category = await container.services.definitions.getCategoryById(definition.categoryId)

    return <DefinitionPageClient definition={definition} category={category} />
  } catch (error) {
    console.error("Error in DefinitionPage:", error)
    notFound()
  }
}
