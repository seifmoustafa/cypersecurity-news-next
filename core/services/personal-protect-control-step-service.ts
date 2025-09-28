import type { PersonalProtectControlStepRepository } from '@/core/domain/repositories/personal-protect-control-step-repository'
import type { PersonalProtectControlStep, PersonalProtectControlStepsResponse } from '@/entities'

export class PersonalProtectControlStepService {
  constructor(private personalProtectControlStepRepository: PersonalProtectControlStepRepository) {}

  async getPersonalProtectControlStepsByControlId(controlId: string, page = 1, pageSize = 10, search?: string): Promise<PersonalProtectControlStepsResponse> {
    return this.personalProtectControlStepRepository.getPersonalProtectControlStepsByControlId(controlId, page, pageSize, search)
  }

  async getPersonalProtectControlStepById(stepId: string): Promise<PersonalProtectControlStep> {
    return this.personalProtectControlStepRepository.getPersonalProtectControlStepById(stepId)
  }
}
