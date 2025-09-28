import type { PersonalProtectControlStep, PersonalProtectControlStepsResponse } from '@/entities'

export interface PersonalProtectControlStepRepository {
  getPersonalProtectControlStepsByControlId(controlId: string, page?: number, pageSize?: number, search?: string): Promise<PersonalProtectControlStepsResponse>
  getPersonalProtectControlStepById(stepId: string): Promise<PersonalProtectControlStep>
}
