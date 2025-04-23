import type { MediaItem, Video, Lecture, Presentation } from "@/core/domain/models/media"

export interface MediaRepository {
  getAllMedia(): Promise<MediaItem[]>
  getVideoById(id: string): Promise<Video | null>
  getLectureById(id: string): Promise<Lecture | null>
  getPresentationById(id: string): Promise<Presentation | null>
}
