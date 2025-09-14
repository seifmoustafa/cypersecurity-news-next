import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import ImplementationStepPageClient from "./ImplementationStepPageClient"

interface PageProps {
  params: {
    categoryId: string
    standardId: string
    controlId: string
    safeguardId: string
    techniqueId: string
    implementationId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const implementationStep = await container.standardsService.getImplementationStepById(params.implementationId)

    if (!implementationStep) {
      return {
        title: "Implementation Step Not Found | Cybersecurity Portal",
        description: "The requested implementation step could not be found.",
      }
    }

    const title = implementationStep.nameEn || implementationStep.nameAr || ""
    const description = implementationStep.descriptionEn || implementationStep.descriptionAr || ""

    return {
      title: `${title} | Implementation Step | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Implementation Step | Cybersecurity Portal",
      description: "Implementation step details",
    }
  }
}

export default async function ImplementationStepPage({ params }: PageProps) {
  try {
    const implementationStep = await container.standardsService.getImplementationStepById(params.implementationId)

    if (!implementationStep) {
      notFound()
    }

    return (
      <ImplementationStepPageClient
        categoryId={params.categoryId}
        standardId={params.standardId}
        controlId={params.controlId}
        safeguardId={params.safeguardId}
        techniqueId={params.techniqueId}
        implementationId={params.implementationId}
        implementationStep={implementationStep}
      />
    )
  } catch (error) {
    console.error("❌ Error in ImplementationStepPage:", error)
    notFound()
  }
}
