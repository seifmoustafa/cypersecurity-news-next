import type { Metadata } from "next"
import { container } from "@/core/di/container"
import PresentationsPageClient from "./PresentationsPageClient"

export const metadata: Metadata = {
  title: "Presentations | Cybersecurity Portal",
  description: "Browse cybersecurity presentations and educational content",
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function PresentationsPage({ searchParams }: PageProps) {
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  try {
    const presentationsResponse = await container.services.media.getPresentations(page, 12, search)

    return (
      <PresentationsPageClient initialPresentations={presentationsResponse} initialSearch={search} initialPage={page} />
    )
  } catch (error) {
    console.error("❌ Error in PresentationsPage:", error)
    return (
      <PresentationsPageClient
        initialPresentations={{ data: [], pagination: { itemsCount: 0, pagesCount: 0, pageSize: 12, currentPage: 1 } }}
        initialSearch={search}
        initialPage={page}
      />
    )
  }
}
