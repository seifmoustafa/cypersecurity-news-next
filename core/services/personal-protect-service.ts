import { PersonalProtectRepository } from "../domain/repositories/personal-protect-repository" 
import {
  PersonalProtectCategory,
  PersonalProtectSubCategory,
  PersonalProtectControl,
  PersonalProtectControlStep,
  PersonalProtectCategoriesPaginatedResponse,
  PersonalProtectSubCategoriesPaginatedResponse,
  PersonalProtectControlsPaginatedResponse,
  PersonalProtectControlStepsPaginatedResponse
} from "../domain/models/personal-protect"

export class PersonalProtectService {
  private repository: PersonalProtectRepository

  constructor(repository: PersonalProtectRepository) {
    this.repository = repository
  }

  // Personal Protect Categories
  async getAllPersonalProtectCategories(
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectCategoriesPaginatedResponse> {
    return this.repository.getAllPersonalProtectCategories(page, pageSize, search)
  }

  async getPersonalProtectCategoryById(id: string): Promise<PersonalProtectCategory | null> {
    return this.repository.getPersonalProtectCategoryById(id)
  }

  // Personal Protect Sub Categories
  async getSubCategoriesByCategoryId(
    categoryId: string,
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectSubCategoriesPaginatedResponse> {
    return this.repository.getSubCategoriesByCategoryId(categoryId, page, pageSize, search)
  }

  async getSubCategoryById(id: string): Promise<PersonalProtectSubCategory | null> {
    return this.repository.getSubCategoryById(id)
  }

  // Personal Protect Controls
  async getControlsBySubCategoryId(
    subCategoryId: string,
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectControlsPaginatedResponse> {
    return this.repository.getControlsBySubCategoryId(subCategoryId, page, pageSize, search)
  }

  async getControlById(id: string): Promise<PersonalProtectControl | null> {
    return this.repository.getControlById(id)
  }

  // Personal Protect Control Steps
  async getStepsByControlId(
    controlId: string,
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectControlStepsPaginatedResponse> {
    return this.repository.getStepsByControlId(controlId, page, pageSize, search)
  }

  async getStepById(id: string): Promise<PersonalProtectControlStep | null> {
    return this.repository.getStepById(id)
  }
}
