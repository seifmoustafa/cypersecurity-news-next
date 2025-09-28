import type { PersonalProtectControlRepository } from '@/core/domain/repositories/personal-protect-control-repository'
import type { PersonalProtectControl, PersonalProtectControlsResponse } from '@/entities'

export class PersonalProtectControlService {
  constructor(private personalProtectControlRepository: PersonalProtectControlRepository) {}

  async getPersonalProtectControlsBySubCategoryId(subCategoryId: string, page = 1, pageSize = 10, search?: string): Promise<PersonalProtectControlsResponse> {
    return this.personalProtectControlRepository.getPersonalProtectControlsBySubCategoryId(subCategoryId, page, pageSize, search)
  }
}
