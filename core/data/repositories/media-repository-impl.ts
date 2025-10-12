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
  ApiArticle,
  ArticlesPaginatedResponse,
  VideoCategory,
  VideoCategoriesResponse,
  LectureCategory,
  LectureCategoriesResponse,
  PresentationCategory,
  PresentationCategoriesResponse,
} from "@/core/domain/models/media"
import type { ApiDataSource } from "@/core/data/sources/api-data-source"
import { slugify } from "@/lib/utils"

export class MediaRepositoryImpl implements MediaRepository {
  constructor(private dataSource: ApiDataSource) {}

  async getAllMedia(): Promise<MediaItem[]> {
    // Combine all media types
    const allMedia = [
      ...mediaLibraryData.videos.map((video) => ({ ...video, id: video.id.toString(), type: "videos" as const })),
      ...mediaLibraryData.lectures.map((lecture) => ({ ...lecture, id: lecture.id.toString(), type: "lectures" as const })),
      ...mediaLibraryData.presentations.map((presentation) => ({ ...presentation, id: presentation.id.toString(), type: "presentations" as const })),
    ]

    return allMedia
  }

  async getVideoById(id: string): Promise<Video | null> {
    const video = mediaLibraryData.videos.find((video) => video.id.toString() === id)
    return video ? { ...video, id: video.id.toString(), type: "videos" as const } : null
  }

  async getLectureById(id: string): Promise<Lecture | null> {
    const lecture = mediaLibraryData.lectures.find((lecture) => lecture.id.toString() === id)
    return lecture ? { ...lecture, id: lecture.id.toString(), type: "lectures" as const, documentUrl: lecture.url } : null
  }

  async getPresentationById(id: string): Promise<Presentation | null> {
    const presentation = mediaLibraryData.presentations.find((presentation) => presentation.id.toString() === id)
    return presentation ? { ...presentation, id: presentation.id.toString(), type: "presentations" as const, slides: [] } : null
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

      const response = await this.dataSource.get<VideosPaginatedResponse>(`/videos?${params.toString()}`)

      // Transform video URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((video) => ({
        ...video,
        videoUrl: video.videoUrl ? `${baseImageUrl}${video.videoUrl}` : video.videoUrl,
        imageUrl: video.imageUrl ? `${baseImageUrl}${video.imageUrl}` : video.imageUrl,
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

  async getVideosByCategory(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<VideosPaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<VideosPaginatedResponse>(`/Videos/beginners/${categoryId}?${params.toString()}`)

      // Transform video and image URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((video) => ({
        ...video,
        videoUrl: video.videoUrl ? `${baseImageUrl}${video.videoUrl}` : video.videoUrl,
        imageUrl: video.imageUrl ? `${baseImageUrl}${video.imageUrl}` : video.imageUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching videos by category:", error)
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

  async getVideosByCategoryForProfessionals(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<VideosPaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<VideosPaginatedResponse>(`/Videos/professionals/${categoryId}?${params.toString()}`)

      // Transform video and image URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((video) => ({
        ...video,
        videoUrl: video.videoUrl ? `${baseImageUrl}${video.videoUrl}` : video.videoUrl,
        imageUrl: video.imageUrl ? `${baseImageUrl}${video.imageUrl}` : video.imageUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching videos by category for professionals:", error)
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
      const video = await this.dataSource.get<ApiVideo>(`/videos/${id}`)

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

      const response = await this.dataSource.get<LecturesPaginatedResponse>(`/lectures?${params.toString()}`)

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

  async getLecturesByCategory(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<LecturesPaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<LecturesPaginatedResponse>(`/Lectures/beginners/${categoryId}?${params.toString()}`)

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
      console.error("MediaRepository: Error fetching lectures by category:", error)
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

  async getLecturesByCategoryForProfessionals(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<LecturesPaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<LecturesPaginatedResponse>(`/Lectures/professionals/${categoryId}?${params.toString()}`)

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
      console.error("MediaRepository: Error fetching lectures by category for professionals:", error)
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
      const response = await this.dataSource.get<LecturesPaginatedResponse>(`/lectures?page=1&pageSize=1000`)

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

      const response = await this.dataSource.get<PresentationsPaginatedResponse>(`/presentations?${params.toString()}`)

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


  async getPresentationBySlug(slug: string): Promise<ApiPresentation | null> {
    try {
      // Get all presentations and find by slug
      const response = await this.dataSource.get<PresentationsPaginatedResponse>(`/presentations?page=1&pageSize=1000`)

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

  async getVideoCategories(page = 1, pageSize = 10, search?: string): Promise<VideoCategoriesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<VideoCategoriesResponse>(`/VideoCategories/beginners?${params.toString()}`)

      // Transform image URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((category) => ({
        ...category,
        imageUrl: category.imageUrl ? `${baseImageUrl}${category.imageUrl}` : category.imageUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching video categories:", error)
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

  async getLectureCategories(page = 1, pageSize = 10, search?: string): Promise<LectureCategoriesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<LectureCategoriesResponse>(`/LectureCategories/beginners?${params.toString()}`)

      // Transform image URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((category) => ({
        ...category,
        imageUrl: category.imageUrl ? `${baseImageUrl}${category.imageUrl}` : category.imageUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching lecture categories:", error)
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

  async getPresentationCategories(page = 1, pageSize = 10, search?: string): Promise<PresentationCategoriesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<PresentationCategoriesResponse>(`/PresentationCategories/beginners?${params.toString()}`)

      // Transform image URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((category) => ({
        ...category,
        imageUrl: category.imageUrl ? `${baseImageUrl}${category.imageUrl}` : category.imageUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching presentation categories:", error)
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

  async getPresentationsByCategory(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<PresentationsPaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<PresentationsPaginatedResponse>(`/Presentations/beginners/${categoryId}?${params.toString()}`)

      // Transform presentation URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((presentation) => ({
        ...presentation,
        presentationUrl: presentation.presentationUrl ? `${baseImageUrl}${presentation.presentationUrl}` : presentation.presentationUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching presentations by category:", error)
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
        presentationUrl: presentation.presentationUrl ? `${baseImageUrl}${presentation.presentationUrl}` : presentation.presentationUrl,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching presentation by ID:", error)
      return null
    }
  }

  async getArticles(page = 1, pageSize = 10, search?: string): Promise<ArticlesPaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<ArticlesPaginatedResponse>(`/Articles/professionals?${params.toString()}`)

      // Transform image URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((article) => ({
        ...article,
        imageUrl: article.imageUrl ? `${baseImageUrl}${article.imageUrl}` : article.imageUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching articles:", error)
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

  async getApiArticleById(id: string): Promise<ApiArticle | null> {
    try {
      const article = await this.dataSource.get<ApiArticle>(`/Articles/${id}`)
      // Transform image URL to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      return {
        ...article,
        imageUrl: article.imageUrl ? `${baseImageUrl}${article.imageUrl}` : article.imageUrl,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching article by ID:", error)
      return null
    }
  }

  // Professional category methods for /advanced
  async getVideoCategoriesForProfessionals(page = 1, pageSize = 10, search?: string): Promise<VideoCategoriesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<VideoCategoriesResponse>(`/VideoCategories/professionals?${params.toString()}`)

      // Transform image URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((category) => ({
        ...category,
        imageUrl: category.imageUrl ? `${baseImageUrl}${category.imageUrl}` : category.imageUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching video categories for professionals:", error)
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

  async getLectureCategoriesForProfessionals(page = 1, pageSize = 10, search?: string): Promise<LectureCategoriesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<LectureCategoriesResponse>(`/LectureCategories/professionals?${params.toString()}`)

      // Transform image URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((category) => ({
        ...category,
        imageUrl: category.imageUrl ? `${baseImageUrl}${category.imageUrl}` : category.imageUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching lecture categories for professionals:", error)
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

  async getPresentationCategoriesForProfessionals(page = 1, pageSize = 10, search?: string): Promise<PresentationCategoriesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<PresentationCategoriesResponse>(`/PresentationCategories/professionals?${params.toString()}`)

      // Transform image URLs to include base URL
      const baseImageUrl = this.dataSource.getBaseImageUrl()
      const transformedData = response.data.map((category) => ({
        ...category,
        imageUrl: category.imageUrl ? `${baseImageUrl}${category.imageUrl}` : category.imageUrl,
      }))

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("MediaRepository: Error fetching presentation categories for professionals:", error)
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
}
