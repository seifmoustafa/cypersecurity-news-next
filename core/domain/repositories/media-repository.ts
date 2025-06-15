import type {
  MediaItem,
  Video,
  Lecture,
  Presentation,
  ApiVideo,
  VideosPaginatedResponse,
} from "@/core/domain/models/media"

export interface MediaRepository {
  getAllMedia(): Promise<MediaItem[]>
  getVideoById(id: string): Promise<Video | null>
  getLectureById(id: string): Promise<Lecture | null>
  getPresentationById(id: string): Promise<Presentation | null>
  getVideos(page?: number, pageSize?: number, search?: string): Promise<VideosPaginatedResponse>
  getApiVideoById(id: string): Promise<ApiVideo | null>
}
