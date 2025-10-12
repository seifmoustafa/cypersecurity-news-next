import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import type { VideosPaginatedResponse, VideoCategory } from "@/core/domain/models/media"
import VideoCategoryPageClient from "./video-category-page-client"

interface VideoCategoryPageProps {
  params: {
    categoryId: string
  }
  searchParams: { search?: string; page?: string }
}

// Server-side function to fetch initial data
async function getInitialData(categoryId: string, search = "", page = 1) {
  try {
    // Fetch videos for the category
    const videosResponse: VideosPaginatedResponse = await container.services.media.getVideosByCategoryForProfessionals(
      categoryId,
      page,
      12,
      search
    )
    
    // Fetch category info
    const categoriesResponse = await container.services.media.getVideoCategoriesForProfessionals(1, 100)
    const category = categoriesResponse.data.find((cat: VideoCategory) => cat.id === categoryId)
    
    return {
      videos: videosResponse,
      category: category || null
    }
  } catch (error) {
    console.error("Error fetching initial data:", error)
    return {
      videos: {
        data: [],
        pagination: {
          itemsCount: 0,
          pagesCount: 0,
          pageSize: 12,
          currentPage: 1,
        },
      },
      category: null
    }
  }
}

// Server component
export default async function VideoCategoryPage({ params, searchParams }: VideoCategoryPageProps) {
  const search = searchParams.search || ""
  const page = parseInt(searchParams.page || "1", 10)
  
  const initialData = await getInitialData(params.categoryId, search, page)
  
  // If category not found, return 404
  if (!initialData.category) {
    notFound()
  }
  
  return (
    <VideoCategoryPageClient
      initialVideos={initialData.videos.data}
      initialPagination={initialData.videos.pagination}
      initialSearch={search}
      initialPage={page}
      category={initialData.category}
    />
  )
}