import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import StandardsControlPageClient from "./StandardsControlPageClient"

interface PageProps {
  params: Promise<{
    categoryId: string
    standardId: string
    controlId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const control = await container.standardsService.getControlById(resolvedParams.controlId)

    if (!control) {
      return {
        title: "Control Not Found | Cybersecurity Portal",
        description: "The requested control could not be found.",
      }
    }

    const title = control.nameEn || control.nameAr || ""
    const description = control.descriptionEn || control.descriptionAr || ""

    return {
      title: `${title} | Standards | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Control | Cybersecurity Portal",
      description: "Control details",
    }
  }
}

export default async function StandardsControlPage({ params }: PageProps) {
  try {
    const resolvedParams = await params
    const control = await container.standardsService.getControlById(resolvedParams.controlId)

    if (!control) {
      notFound()
    }

    return <StandardsControlPageClient control={control} categoryId={resolvedParams.categoryId} standardId={resolvedParams.standardId} />
  } catch (error) {
    console.error("❌ Error in StandardsControlPage:", error)
    notFound()
  }
}
