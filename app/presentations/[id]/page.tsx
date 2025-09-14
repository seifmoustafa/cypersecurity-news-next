import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import PresentationPageClient from "./PresentationPageClient"

interface PresentationPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PresentationPageProps): Promise<Metadata> {
  try {
    const presentation = await container.services.media.getPresentationById(params.id)

    if (!presentation) {
      return {
        title: "Presentation Not Found | Cybersecurity Portal",
        description: "The requested presentation could not be found.",
      }
    }

    const title = presentation.nameEn || presentation.nameAr || ""
    const summary = presentation.summaryEn || presentation.summaryAr || ""

    return {
      title: `${title} | Cybersecurity Presentations`,
      description: summary,
      openGraph: {
        title: title,
        description: summary,
        type: "article",
      },
    }
  } catch (error) {
    return {
      title: "Presentation Not Found | Cybersecurity Portal",
      description: "The requested presentation could not be found.",
    }
  }
}

export default async function PresentationPage({ params }: PresentationPageProps) {
  try {
    const presentation = await container.services.media.getPresentationById(params.id)

    if (!presentation) {
      notFound()
    }

    return <PresentationPageClient presentation={presentation} />
  } catch (error) {
    console.error("❌ Error in PresentationPage:", error)
    notFound()
  }
}
