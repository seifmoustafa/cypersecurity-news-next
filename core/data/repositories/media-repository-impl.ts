import type { MediaRepository } from "@/core/domain/repositories/media-repository"
import { mediaLibraryData } from "@/data/media-library-data"
import type {
  MediaItem,
  Video,
  Lecture,
  Presentation,
  ApiVideo,
  VideosPaginatedResponse,
} from "@/core/domain/models/media"
import type { ApiDataSource } from "@/core/data/sources/api-data-source"

export class MediaRepositoryImpl implements MediaRepository {
  constructor(private dataSource: ApiDataSource) {}

  async getAllMedia(): Promise<MediaItem[]> {
    // Combine all media types
    const allMedia = [
      ...mediaLibraryData.videos.map((video) => ({ ...video, type: "videos" as const })),
      ...mediaLibraryData.lectures.map((lecture) => ({ ...lecture, type: "lectures" as const })),
      ...mediaLibraryData.presentations.map((presentation) => ({ ...presentation, type: "presentations" as const })),
    ]

    return allMedia
  }

  async getVideoById(id: string): Promise<Video | null> {
    const video = mediaLibraryData.videos.find((video) => video.id === id)
    return video || null
  }

  async getLectureById(id: string): Promise<Lecture | null> {
    const lecture = mediaLibraryData.lectures.find((lecture) => lecture.id === id)
    return lecture || null
  }

  async getPresentationById(id: string): Promise<Presentation | null> {
    const presentation = mediaLibraryData.presentations.find((presentation) => presentation.id === id)
    return presentation || null
  }

  async getVideos(page = 1, pageSize = 10, search?: string): Promise<VideosPaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<VideosPaginatedResponse>(`/Videos?${params.toString()}`)

      // Transform video URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((video) => ({
        ...video,
        videoUrl: video.videoUrl ? `${baseImageUrl}${video.videoUrl}` : video.videoUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching videos:", error)
      return {
        data: [],
        pagination: {
          itemsCount: 0,
          pagesCount: 0,
          pageSize: pageSize,
          currentPage: page,
        },
      }
    }
  }

  async getApiVideoById(id: string): Promise<ApiVideo | null> {
    try {
      const video = await this.dataSource.get<ApiVideo>(`/Videos/${id}`)

      // Transform video URL to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      return {
        ...video,
        videoUrl: video.videoUrl ? `${baseImageUrl}${video.videoUrl}` : video.videoUrl,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching video by ID:", error)
      return null
    }
  }
}
