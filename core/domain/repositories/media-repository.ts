import type { Video, Lecture, Presentation } from "../models/media"

export interface MediaRepository {
  getAllVideos(): Promise<Video[]>
  getVideoById(id: string): Promise<Video | null>

  getAllLectures(): Promise<Lecture[]>
  getLectureById(id: string): Promise<Lecture | null>

  getAllPresentations(): Promise<Presentation[]>
  getPresentationById(id: string): Promise<Presentation | null>
}
