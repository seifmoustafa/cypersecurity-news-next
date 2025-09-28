import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import PersonalProtectControlStepDetailPageClient from "./PersonalProtectControlStepDetailPageClient"

interface PageProps {
  params: {
    categoryId: string
    subcategoryId: string
    controlId: string
    stepId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const step = await container.services.personalProtectControlStep.getPersonalProtectControlStepById(params.stepId)

    if (!step) {
      return {
        title: "Personal Protection Step Not Found | Cybersecurity Portal",
        description: "The requested personal protection step could not be found.",
      }
    }

    const title = step.nameEn || step.name || ""
    const summary = step.summaryEn || step.summary || ""

    return {
      title: `${title} | Personal Protection | Cybersecurity Portal`,
      description: summary,
    }
  } catch (error) {
    return {
      title: "Personal Protection Step | Cybersecurity Portal",
      description: "Personal protection step details",
    }
  }
}

export default async function PersonalProtectControlStepDetailPage({ params }: PageProps) {
  try {
    const step = await container.services.personalProtectControlStep.getPersonalProtectControlStepById(params.stepId)

    if (!step) {
      notFound()
    }

    return (
      <PersonalProtectControlStepDetailPageClient
        categoryId={params.categoryId}
        subcategoryId={params.subcategoryId}
        controlId={params.controlId}
        stepId={params.stepId}
        step={step}
      />
    )
  } catch (error) {
    console.error("❌ Error in PersonalProtectControlStepDetailPage:", error)
    notFound()
  }
}
