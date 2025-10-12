import type { MediaRepository } from "@/core/domain/repositories/media-repository"
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

export class MediaService {
  constructor(private mediaRepository: MediaRepository) {}

  async getAllMedia(): Promise<MediaItem[]> {
    return this.mediaRepository.getAllMedia()
  }

  async getVideoById(id: string): Promise<Video> {
    const video = await this.mediaRepository.getVideoById(id)
    if (!video) {
      throw new Error(`Video with id ${id} not found`)
    }
    return video
  }

  async getLectureById(id: string): Promise<Lecture> {
    const lecture = await this.mediaRepository.getLectureById(id)
    if (!lecture) {
      throw new Error(`Lecture with id ${id} not found`)
    }
    return lecture
  }

  async getPresentationById(id: string): Promise<Presentation> {
    const presentation = await this.mediaRepository.getPresentationById(id)
    if (!presentation) {
      throw new Error(`Presentation with id ${id} not found`)
    }
    return presentation
  }

  async getVideos(page = 1, pageSize = 10, search?: string): Promise<VideosPaginatedResponse> {
    return this.mediaRepository.getVideos(page, pageSize, search)
  }

  async getVideosByCategory(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<VideosPaginatedResponse> {
    return this.mediaRepository.getVideosByCategory(categoryId, page, pageSize, search)
  }

  async getVideosByCategoryForProfessionals(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<VideosPaginatedResponse> {
    return this.mediaRepository.getVideosByCategoryForProfessionals(categoryId, page, pageSize, search)
  }

  async getApiVideoById(id: string): Promise<ApiVideo> {
    const video = await this.mediaRepository.getApiVideoById(id)
    if (!video) {
      throw new Error(`Video with id ${id} not found`)
    }
    return video
  }

  async getLectures(page = 1, pageSize = 10, search?: string): Promise<LecturesPaginatedResponse> {
    return this.mediaRepository.getLectures(page, pageSize, search)
  }

  async getLecturesByCategory(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<LecturesPaginatedResponse> {
    return this.mediaRepository.getLecturesByCategory(categoryId, page, pageSize, search)
  }

  async getLecturesByCategoryForProfessionals(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<LecturesPaginatedResponse> {
    return this.mediaRepository.getLecturesByCategoryForProfessionals(categoryId, page, pageSize, search)
  }

  async getApiLectureById(id: string): Promise<ApiLecture> {
    const lecture = await this.mediaRepository.getApiLectureById(id)
    if (!lecture) {
      throw new Error(`Lecture with id ${id} not found`)
    }
    return lecture
  }

  async getLectureBySlug(slug: string): Promise<ApiLecture> {
    const lecture = await this.mediaRepository.getLectureBySlug(slug)
    if (!lecture) {
      throw new Error(`Lecture with slug ${slug} not found`)
    }
    return lecture
  }

  async getPresentations(page = 1, pageSize = 10, search?: string): Promise<PresentationsPaginatedResponse> {
    return this.mediaRepository.getPresentations(page, pageSize, search)
  }

  async getApiPresentationById(id: string): Promise<ApiPresentation> {
    const presentation = await this.mediaRepository.getApiPresentationById(id)
    if (!presentation) {
      throw new Error(`Presentation with id ${id} not found`)
    }
    return presentation
  }

  async getPresentationBySlug(slug: string): Promise<ApiPresentation> {
    const presentation = await this.mediaRepository.getPresentationBySlug(slug)
    if (!presentation) {
      throw new Error(`Presentation with slug ${slug} not found`)
    }
    return presentation
  }

  async getVideoCategories(page = 1, pageSize = 10, search?: string): Promise<VideoCategoriesResponse> {
    return this.mediaRepository.getVideoCategories(page, pageSize, search)
  }

  async getVideoCategoriesForProfessionals(page = 1, pageSize = 10, search?: string): Promise<VideoCategoriesResponse> {
    return this.mediaRepository.getVideoCategoriesForProfessionals(page, pageSize, search)
  }

  async getLectureCategories(page = 1, pageSize = 10, search?: string): Promise<LectureCategoriesResponse> {
    return this.mediaRepository.getLectureCategories(page, pageSize, search)
  }

  async getLectureCategoriesForProfessionals(page = 1, pageSize = 10, search?: string): Promise<LectureCategoriesResponse> {
    return this.mediaRepository.getLectureCategoriesForProfessionals(page, pageSize, search)
  }

  async getPresentationCategories(page = 1, pageSize = 10, search?: string): Promise<PresentationCategoriesResponse> {
    return this.mediaRepository.getPresentationCategories(page, pageSize, search)
  }

  async getPresentationCategoriesForProfessionals(page = 1, pageSize = 10, search?: string): Promise<PresentationCategoriesResponse> {
    return this.mediaRepository.getPresentationCategoriesForProfessionals(page, pageSize, search)
  }

  async getPresentationsByCategory(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<PresentationsPaginatedResponse> {
    return this.mediaRepository.getPresentationsByCategory(categoryId, page, pageSize, search)
  }

  async getArticles(page = 1, pageSize = 10, search?: string): Promise<ArticlesPaginatedResponse> {
    return this.mediaRepository.getArticles(page, pageSize, search)
  }

  async getApiArticleById(id: string): Promise<ApiArticle | null> {
    return this.mediaRepository.getApiArticleById(id)
  }
}
