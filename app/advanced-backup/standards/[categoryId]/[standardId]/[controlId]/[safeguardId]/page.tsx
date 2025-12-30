import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import StandardsSafeguardPageClient from "./StandardsSafeguardPageClient"

interface PageProps {
  params: Promise<{
    categoryId: string
    standardId: string
    controlId: string
    safeguardId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const safeguard = await container.standardsService.getSafeguardById(resolvedParams.safeguardId)

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
    const resolvedParams = await params
    const safeguard = await container.standardsService.getSafeguardById(resolvedParams.safeguardId)

    if (!safeguard) {
      notFound()
    }

    return <StandardsSafeguardPageClient safeguard={safeguard} categoryId={resolvedParams.categoryId} standardId={resolvedParams.standardId} controlId={resolvedParams.controlId} />
  } catch (error) {
    console.error("❌ Error in StandardsSafeguardPage:", error)
    notFound()
  }
}
