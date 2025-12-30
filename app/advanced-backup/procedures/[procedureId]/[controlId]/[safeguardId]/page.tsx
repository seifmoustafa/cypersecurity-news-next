import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import SafeguardPageClient from "./SafeguardPageClient"

interface PageProps {
  params: Promise<{
    procedureId: string
    controlId: string
    safeguardId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const safeguard = await container.services.procedures.getSafeguardById(resolvedParams.safeguardId)

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
    const resolvedParams = await params
    const safeguard = await container.services.procedures.getSafeguardById(resolvedParams.safeguardId)

    if (!safeguard) {
      notFound()
    }

    return <SafeguardPageClient safeguard={safeguard} procedureId={resolvedParams.procedureId} controlId={resolvedParams.controlId} />
  } catch (error) {
    console.error("❌ Error in SafeguardPage:", error)
    notFound()
  }
}
