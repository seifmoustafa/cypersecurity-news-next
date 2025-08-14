import type { MediaRepository } from "@/core/domain/repositories/media-repository"
import { mediaLibraryData } from "@/data/media-library-data"
import type {
  MediaItem,
  Video,
  Lecture,
  Presentation,
  ApiVideo,
  VideosPaginatedResponse,
  ApiLecture,
  LecturesPaginatedResponse,
  ApiPresentation,
  PresentationsPaginatedResponse,
} from "@/core/domain/models/media"
import type { ApiDataSource } from "@/core/data/sources/api-data-source"
import { slugify } from "@/lib/utils"

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

  async getLectures(page = 1, pageSize = 10, search?: string): Promise<LecturesPaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<LecturesPaginatedResponse>(`/Lectures?${params.toString()}`)

      // Transform document URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((lecture) => ({
        ...lecture,
        documentUrl: lecture.documentUrl ? `${baseImageUrl}${lecture.documentUrl}` : lecture.documentUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching lectures:", error)
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

  async getApiLectureById(id: string): Promise<ApiLecture | null> {
    try {
      const lecture = await this.dataSource.get<ApiLecture>(`/Lectures/${id}`)

      // Transform document URL to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      return {
        ...lecture,
        documentUrl: lecture.documentUrl ? `${baseImageUrl}${lecture.documentUrl}` : lecture.documentUrl,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching lecture by ID:", error)
      return null
    }
  }

  async getLectureBySlug(slug: string): Promise<ApiLecture | null> {
    try {
      // Get all lectures and find by slug
      const response = await this.dataSource.get<LecturesPaginatedResponse>(`/Lectures?page=1&pageSize=1000`)

      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((lecture) => ({
        ...lecture,
        documentUrl: lecture.documentUrl ? `${baseImageUrl}${lecture.documentUrl}` : lecture.documentUrl,
      }))

      // Find lecture by slug
      const foundLecture = transformedData.find((lecture) => {
        const englishTitle = lecture.nameEn || ""
        const lectureSlug = slugify(englishTitle, lecture.id)
        return lectureSlug === slug
      })

      return foundLecture || null
    } catch (error) {
      console.error("MediaRepository: Error fetching lecture by slug:", error)
      return null
    }
  }

  async getPresentations(page = 1, pageSize = 10, search?: string): Promise<PresentationsPaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<PresentationsPaginatedResponse>(`/Presentations?${params.toString()}`)

      // Transform presentation URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((presentation) => ({
        ...presentation,
        presentationUrl: presentation.presentationUrl
          ? `${baseImageUrl}${presentation.presentationUrl}`
          : presentation.presentationUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching presentations:", error)
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

  async getApiPresentationById(id: string): Promise<ApiPresentation | null> {
    try {
      const presentation = await this.dataSource.get<ApiPresentation>(`/Presentations/${id}`)

      // Transform presentation URL to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      return {
        ...presentation,
        presentationUrl: presentation.presentationUrl
          ? `${baseImageUrl}${presentation.presentationUrl}`
          : presentation.presentationUrl,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching presentation by ID:", error)
      return null
    }
  }

  async getPresentationBySlug(slug: string): Promise<ApiPresentation | null> {
    try {
      // Get all presentations and find by slug
      const response = await this.dataSource.get<PresentationsPaginatedResponse>(`/Presentations?page=1&pageSize=1000`)

      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((presentation) => ({
        ...presentation,
        presentationUrl: presentation.presentationUrl
          ? `${baseImageUrl}${presentation.presentationUrl}`
          : presentation.presentationUrl,
      }))

      // Find presentation by slug
      const foundPresentation = transformedData.find((presentation) => {
        const englishTitle = presentation.nameEn || ""
        const presentationSlug = slugify(englishTitle, presentation.id)
        return presentationSlug === slug
      })

      return foundPresentation || null
    } catch (error) {
      console.error("MediaRepository: Error fetching presentation by slug:", error)
      return null
    }
  }
}
