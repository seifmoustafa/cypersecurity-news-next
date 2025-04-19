import type { MediaRepository } from "../../domain/repositories/media-repository"
import type { Video, Lecture, Presentation } from "../../domain/models/media"
import type { MockDataSource } from "../sources/mock-data-source"

export class MediaRepositoryImpl implements MediaRepository {
  private dataSource: MockDataSource

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  async getAllVideos(): Promise<Video[]> {
    return this.dataSource.getAllVideos()
  }

  async getVideoById(id: string): Promise<Video | null> {
    return this.dataSource.getVideoById(id)
  }

  async getAllLectures(): Promise<Lecture[]> {
    return this.dataSource.getAllLectures()
  }

  async getLectureById(id: string): Promise<Lecture | null> {
    return this.dataSource.getLectureById(id)
  }

  async getAllPresentations(): Promise<Presentation[]> {
    return this.dataSource.getAllPresentations()
  }

  async getPresentationById(id: string): Promise<Presentation | null> {
    return this.dataSource.getPresentationById(id)
  }
}
