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

export interface MediaRepository {
  getAllMedia(): Promise<MediaItem[]>
  getVideoById(id: string): Promise<Video | null>
  getLectureById(id: string): Promise<Lecture | null>
  getPresentationById(id: string): Promise<Presentation | null>
  getVideos(page?: number, pageSize?: number, search?: string): Promise<VideosPaginatedResponse>
  getApiVideoById(id: string): Promise<ApiVideo | null>
  getLectures(page?: number, pageSize?: number, search?: string): Promise<LecturesPaginatedResponse>
  getApiLectureById(id: string): Promise<ApiLecture | null>
  getLectureBySlug(slug: string): Promise<ApiLecture | null>
  getPresentations(page?: number, pageSize?: number, search?: string): Promise<PresentationsPaginatedResponse>
  getApiPresentationById(id: string): Promise<ApiPresentation | null>
  getPresentationBySlug(slug: string): Promise<ApiPresentation | null>
}
