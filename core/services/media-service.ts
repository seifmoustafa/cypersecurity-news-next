import type { MediaRepository } from "../domain/repositories/media-repository"
import type { Video, Lecture, Presentation } from "../domain/models/media"

export class MediaService {
  private repository: MediaRepository

  constructor(repository: MediaRepository) {
    this.repository = repository
  }

  async getAllVideos(): Promise<Video[]> {
    return this.repository.getAllVideos()
  }

  async getVideoById(id: string): Promise<Video | null> {
    return this.repository.getVideoById(id)
  }

  async getAllLectures(): Promise<Lecture[]> {
    return this.repository.getAllLectures()
  }

  async getLectureById(id: string): Promise<Lecture | null> {
    return this.repository.getLectureById(id)
  }

  async getAllPresentations(): Promise<Presentation[]> {
    return this.repository.getAllPresentations()
  }

  async getPresentationById(id: string): Promise<Presentation | null> {
    return this.repository.getPresentationById(id)
  }
}
