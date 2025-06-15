import type { MediaRepository } from "@/core/domain/repositories/media-repository"
import type {
  MediaItem,
  Video,
  Lecture,
  Presentation,
  ApiVideo,
  VideosPaginatedResponse,
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

  async getApiVideoById(id: string): Promise<ApiVideo> {
    const video = await this.mediaRepository.getApiVideoById(id)
    if (!video) {
      throw new Error(`Video with id ${id} not found`)
    }
    return video
  }
}
