import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import StandardsTechniquePageClient from "./StandardsTechniquePageClient"

interface PageProps {
  params: {
    categoryId: string
    standardId: string
    controlId: string
    safeguardId: string
    techniqueId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const technique = await container.standardsService.getTechniqueById(params.techniqueId)

    if (!technique) {
      return {
        title: "Technique Not Found | Cybersecurity Portal",
        description: "The requested technique could not be found.",
      }
    }

    const title = technique.nameEn || technique.nameAr || ""
    const description = technique.descriptionEn || technique.descriptionAr || ""

    return {
      title: `${title} | Standards | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Technique | Cybersecurity Portal",
      description: "Technique details",
    }
  }
}

export default async function StandardsTechniquePage({ params }: PageProps) {
  try {
    const technique = await container.standardsService.getTechniqueById(params.techniqueId)

    if (!technique) {
      notFound()
    }

    return <StandardsTechniquePageClient technique={technique} categoryId={params.categoryId} standardId={params.standardId} controlId={params.controlId} safeguardId={params.safeguardId} />
  } catch (error) {
    console.error("❌ Error in StandardsTechniquePage:", error)
    notFound()
  }
}
