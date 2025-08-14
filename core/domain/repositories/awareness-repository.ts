import type { AwarenessResponse, AwarenessYearResponse, Awareness, AwarenessYear } from "../models/awareness"

export interface AwarenessRepository {
  getCurrentYearAwareness(search?: string, page?: number, pageSize?: number): Promise<AwarenessResponse>
  getAllAwarenessYears(search?: string, page?: number, pageSize?: number): Promise<AwarenessYearResponse>
  getAwarenessYearById(id: string): Promise<AwarenessYear>
  getAwarenessByYearId(yearId: string, search?: string, page?: number, pageSize?: number): Promise<AwarenessResponse>
  getAwarenessById(id: string): Promise<Awareness>
  getAwarenessByYearAndSlug(year: string, slug: string): Promise<Awareness | null>
}
