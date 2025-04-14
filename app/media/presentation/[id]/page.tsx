import { mediaLibraryData } from "@/data/media-library-data"
import type { Metadata } from "next"
import PresentationPageClient from "./PresentationPageClient"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const presentation = mediaLibraryData.presentations.find(
    (item) => item.id.toString() === params.id
  )

  if (!presentation) {
    return {
      title: "Presentation Not Found",
    }
  }

  return {
    title: `${presentation.title.ar} | ${presentation.title.en}`,
    description: presentation.description.ar,
  }
}

export async function generateStaticParams() {
  return mediaLibraryData.presentations.map((item) => ({
    id: item.id.toString(),
  }))
}

export default function PresentationPage({
  params,
}: {
  params: { id: string }
}) {
  return <PresentationPageClient id={params.id} />
}
