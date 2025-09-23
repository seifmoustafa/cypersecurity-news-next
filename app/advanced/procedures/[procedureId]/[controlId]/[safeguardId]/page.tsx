import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import SafeguardPageClient from "./SafeguardPageClient"

interface PageProps {
  params: {
    procedureId: string
    controlId: string
    safeguardId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const safeguard = await container.services.procedures.getSafeguardById(params.safeguardId)

    if (!safeguard) {
      return {
        title: "Safeguard Not Found | Cybersecurity Portal",
        description: "The requested safeguard could not be found.",
      }
    }

    const title = safeguard.nameEn || safeguard.nameAr || ""
    const description = safeguard.descriptionEn || safeguard.descriptionAr || ""

    return {
      title: `${title} | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Safeguard | Cybersecurity Portal",
      description: "Safeguard details",
    }
  }
}

export default async function SafeguardPage({ params }: PageProps) {
  try {
    const safeguard = await container.services.procedures.getSafeguardById(params.safeguardId)

    if (!safeguard) {
      notFound()
    }

    return <SafeguardPageClient safeguard={safeguard} procedureId={params.procedureId} controlId={params.controlId} />
  } catch (error) {
    console.error("❌ Error in SafeguardPage:", error)
    notFound()
  }
}
