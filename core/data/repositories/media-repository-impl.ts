import type { MediaRepository } from "@/core/domain/repositories/media-repository"
import { mediaLibraryData } from "@/data/media-library-data"
import type { MediaItem, Video, Lecture, Presentation } from "@/core/domain/models/media"

export class MediaRepositoryImpl implements MediaRepository {
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
}
