import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import ImplementationStepDetailPageClient from "./ImplementationStepDetailPageClient"

interface PageProps {
  params: Promise<{
    procedureId: string
    controlId: string
    safeguardId: string
    techniqueId: string
    implementationId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const implementationStep = await container.services.procedures.getImplementationStepById(resolvedParams.implementationId)

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

export default async function ImplementationStepDetailPage({ params }: PageProps) {
  try {
    const resolvedParams = await params
    const implementationStep = await container.services.procedures.getImplementationStepById(resolvedParams.implementationId)

    if (!implementationStep) {
      notFound()
    }

    return (
      <ImplementationStepDetailPageClient
        procedureId={resolvedParams.procedureId}
        controlId={resolvedParams.controlId}
        safeguardId={resolvedParams.safeguardId}
        techniqueId={resolvedParams.techniqueId}
        implementationId={resolvedParams.implementationId}
        implementationStep={implementationStep}
      />
    )
  } catch (error) {
    console.error("❌ Error in ImplementationStepDetailPage:", error)
    notFound()
  }
}
