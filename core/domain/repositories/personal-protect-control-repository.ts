import type { PersonalProtectControl, PersonalProtectControlsResponse } from '@/entities'

export interface PersonalProtectControlRepository {
  getPersonalProtectControlsBySubCategoryId(subCategoryId: string, page?: number, pageSize?: number, search?: string): Promise<PersonalProtectControlsResponse>
}
