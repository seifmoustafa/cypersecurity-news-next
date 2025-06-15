import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import PresentationPageClient from "./PresentationPageClient"

interface PresentationPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PresentationPageProps): Promise<Metadata> {
  try {
    const presentation = await container.services.media.getPresentationBySlug(params.slug)

    return {
      title: `${presentation.nameEn} | Cybersecurity Presentations`,
      description: presentation.summaryEn,
      openGraph: {
        title: presentation.nameEn,
        description: presentation.summaryEn,
        type: "article",
      },
    }
  } catch (error) {
    return {
      title: "Presentation Not Found | Cybersecurity Platform",
      description: "The requested presentation could not be found.",
    }
  }
}

export default async function PresentationPage({ params }: PresentationPageProps) {
  try {
    const presentation = await container.services.media.getPresentationBySlug(params.slug)
    return <PresentationPageClient presentation={presentation} />
  } catch (error) {
    notFound()
  }
}
