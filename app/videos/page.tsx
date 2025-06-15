import type { Metadata } from "next"
import { container } from "@/core/di/container"
import VideosPageClient from "./VideosPageClient"

export const metadata: Metadata = {
  title: "Videos | Cybersecurity Portal",
  description: "Browse our collection of cybersecurity videos and educational content.",
}

export default async function VideosPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string }
}) {
  const search = searchParams.search || ""
  const page = Number.parseInt(searchParams.page || "1", 10)
  const pageSize = 12

  try {
    const videosResponse = await container.services.media.getVideos(page, pageSize, search)

    return (
      <VideosPageClient
        initialVideos={videosResponse.data}
        initialPagination={videosResponse.pagination}
        initialSearch={search}
        initialPage={page}
      />
    )
  } catch (error) {
    console.error("❌ Error in VideosPage:", error)
    return (
      <VideosPageClient
        initialVideos={[]}
        initialPagination={{
          itemsCount: 0,
          pagesCount: 0,
          pageSize: pageSize,
          currentPage: 1,
        }}
        initialSearch={search}
        initialPage={page}
      />
    )
  }
}
