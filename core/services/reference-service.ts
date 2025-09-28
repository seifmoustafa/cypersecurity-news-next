import type { ReferenceRepository } from '@/core/domain/repositories/reference-repository'
import type { Reference, ReferenceResponse } from '@/entities'

export class ReferenceService {
  constructor(private referenceRepository: ReferenceRepository) {}

  async getReferences(page = 1, pageSize = 10, search?: string): Promise<ReferenceResponse> {
    return this.referenceRepository.getReferences(page, pageSize, search)
  }

  async getReferenceById(id: string): Promise<Reference> {
    return this.referenceRepository.getReferenceById(id)
  }
}
