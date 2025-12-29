import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import StandardPageClient from "./StandardPageClient"

interface PageProps {
  params: Promise<{
    categoryId: string
    standardId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const standard = await container.standardsService.getStandardById(resolvedParams.standardId)

    if (!standard) {
      return {
        title: "Standard Not Found | Cybersecurity Portal",
        description: "The requested standard could not be found.",
      }
    }

    const title = standard.nameEn || standard.nameAr || ""
    const description = standard.descriptionEn || standard.descriptionAr || ""

    return {
      title: `${title} | Standards | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Standard | Cybersecurity Portal",
      description: "Standard details",
    }
  }
}

export default async function StandardPage({ params }: PageProps) {
  try {
    const resolvedParams = await params
    const standard = await container.standardsService.getStandardById(resolvedParams.standardId)

    if (!standard) {
      notFound()
    }

    return <StandardPageClient standard={standard} categoryId={resolvedParams.categoryId} />
  } catch (error) {
    console.error("❌ Error in StandardPage:", error)
    notFound()
  }
}
