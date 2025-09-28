import type { Reference, ReferenceResponse } from '@/entities'

export interface ReferenceRepository {
  getReferences(page?: number, pageSize?: number, search?: string): Promise<ReferenceResponse>
  getReferenceById(id: string): Promise<Reference>
}
