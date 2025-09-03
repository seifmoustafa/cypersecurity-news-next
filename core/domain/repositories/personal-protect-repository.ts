import {
  PersonalProtectCategory,
  PersonalProtectSubCategory,
  PersonalProtectControl,
  PersonalProtectControlStep,
  PersonalProtectCategoriesPaginatedResponse,
  PersonalProtectSubCategoriesPaginatedResponse,
  PersonalProtectControlsPaginatedResponse,
  PersonalProtectControlStepsPaginatedResponse
} from "../models/personal-protect"

export interface PersonalProtectRepository {
  // Personal Protect Categories
  getAllPersonalProtectCategories(
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectCategoriesPaginatedResponse>
  
  getPersonalProtectCategoryById(id: string): Promise<PersonalProtectCategory | null>

  // Personal Protect Sub Categories
  getSubCategoriesByCategoryId(
    categoryId: string,
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectSubCategoriesPaginatedResponse>
  
  getSubCategoryById(id: string): Promise<PersonalProtectSubCategory | null>

  // Personal Protect Controls
  getControlsBySubCategoryId(
    subCategoryId: string,
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectControlsPaginatedResponse>
  
  getControlById(id: string): Promise<PersonalProtectControl | null>

  // Personal Protect Control Steps
  getStepsByControlId(
    controlId: string,
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectControlStepsPaginatedResponse>
  
  getStepById(id: string): Promise<PersonalProtectControlStep | null>
}
