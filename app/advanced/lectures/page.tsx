import type { Metadata } from "next"
import { container } from "@/core/di/container"
import LecturesPageClient from "./LecturesPageClient"

export const metadata: Metadata = {
  title: "Lectures | Cybersecurity Portal",
  description: "Browse cybersecurity lectures and educational content",
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function LecturesPage({ searchParams }: PageProps) {
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  try {
    const lecturesResponse = await container.services.media.getLectures(page, 12, search)

    return <LecturesPageClient initialLectures={lecturesResponse} initialSearch={search} initialPage={page} />
  } catch (error) {
    console.error("❌ Error in LecturesPage:", error)
    return (
      <LecturesPageClient
        initialLectures={{ data: [], pagination: { itemsCount: 0, pagesCount: 0, pageSize: 12, currentPage: 1 } }}
        initialSearch={search}
        initialPage={page}
      />
    )
  }
}
