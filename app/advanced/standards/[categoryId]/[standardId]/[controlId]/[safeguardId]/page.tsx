import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import StandardsSafeguardPageClient from "./StandardsSafeguardPageClient"

interface PageProps {
  params: {
    categoryId: string
    standardId: string
    controlId: string
    safeguardId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const safeguard = await container.standardsService.getSafeguardById(params.safeguardId)

    if (!safeguard) {
      return {
        title: "Safeguard Not Found | Cybersecurity Portal",
        description: "The requested safeguard could not be found.",
      }
    }

    const title = safeguard.nameEn || safeguard.nameAr || ""
    const description = safeguard.descriptionEn || safeguard.descriptionAr || ""

    return {
      title: `${title} | Standards | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Safeguard | Cybersecurity Portal",
      description: "Safeguard details",
    }
  }
}

export default async function StandardsSafeguardPage({ params }: PageProps) {
  try {
    const safeguard = await container.standardsService.getSafeguardById(params.safeguardId)

    if (!safeguard) {
      notFound()
    }

    return <StandardsSafeguardPageClient safeguard={safeguard} categoryId={params.categoryId} standardId={params.standardId} controlId={params.controlId} />
  } catch (error) {
    console.error("❌ Error in StandardsSafeguardPage:", error)
    notFound()
  }
}
