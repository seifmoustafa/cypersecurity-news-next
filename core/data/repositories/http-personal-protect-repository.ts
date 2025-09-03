import { PersonalProtectRepository } from "../../domain/repositories/personal-protect-repository"
import { ApiDataSource } from "./api-data-source"
import {
  PersonalProtectCategory,
  PersonalProtectSubCategory,
  PersonalProtectControl,
  PersonalProtectControlStep,
  PersonalProtectCategoriesPaginatedResponse,
  PersonalProtectSubCategoriesPaginatedResponse,
  PersonalProtectControlsPaginatedResponse,
  PersonalProtectControlStepsPaginatedResponse
} from "../../domain/models/personal-protect"

export class HttpPersonalProtectRepository implements PersonalProtectRepository {
  constructor(private apiDataSource: ApiDataSource) {}

  private transformImageUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for images and documents
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformVideoUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for videos
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformDocumentUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for documents
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformControl(control: any): any {
    return {
      ...control,
      imageUrl: this.transformImageUrl(control.imageUrl),
    }
  }

  private transformStep(step: any): any {
    return {
      ...step,
      imageUrl: this.transformImageUrl(step.imageUrl),
      videoUrl: this.transformVideoUrl(step.videoUrl),
      documentUrl: this.transformDocumentUrl(step.documentUrl),
    }
  }

  // Personal Protect Categories
  async getAllPersonalProtectCategories(
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectCategoriesPaginatedResponse> {
    try {
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("pageSize", pageSize.toString())
      if (search) {
        params.append("search", search)
      }

      const response = await this.apiDataSource.get(`/PersonalProtectCategories?${params.toString()}`)
      return response
    } catch (error) {
      console.error("Error fetching personal protect categories:", error)
      throw error
    }
  }

  async getPersonalProtectCategoryById(id: string): Promise<PersonalProtectCategory | null> {
    try {
      const response = await this.apiDataSource.get(`/PersonalProtectCategories/${id}`)
      return response
    } catch (error) {
      console.error("Error fetching personal protect category by ID:", error)
      throw error
    }
  }

  // Personal Protect Sub Categories
  async getSubCategoriesByCategoryId(
    categoryId: string,
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectSubCategoriesPaginatedResponse> {
    try {
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("pageSize", pageSize.toString())
      if (search) {
        params.append("search", search)
      }

      const response = await this.apiDataSource.get(
        `/PersonalProtectSubCategories/byCategory/${categoryId}?${params.toString()}`
      )
      return response
    } catch (error) {
      console.error("Error fetching personal protect sub categories:", error)
      throw error
    }
  }

  async getSubCategoryById(id: string): Promise<PersonalProtectSubCategory | null> {
    try {
      const response = await this.apiDataSource.get(`/PersonalProtectSubCategories/${id}`)
      return response
    } catch (error) {
      console.error("Error fetching personal protect sub category by ID:", error)
      throw error
    }
  }

  // Personal Protect Controls
  async getControlsBySubCategoryId(
    subCategoryId: string,
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectControlsPaginatedResponse> {
    try {
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("pageSize", pageSize.toString())
      if (search) {
        params.append("search", search)
      }

      const response = await this.apiDataSource.get(
        `/PersonalProtectControls/bySubCategory/${subCategoryId}?${params.toString()}`
      )
      
      // Transform the controls to handle URLs properly
      return {
        ...response,
        data: response.data.map((control: any) => this.transformControl(control))
      }
    } catch (error) {
      console.error("Error fetching personal protect controls:", error)
      throw error
    }
  }

  async getControlById(id: string): Promise<PersonalProtectControl | null> {
    try {
      const response = await this.apiDataSource.get(`/PersonalProtectControls/${id}`)
      return this.transformControl(response)
    } catch (error) {
      console.error("Error fetching personal protect control by ID:", error)
      throw error
    }
  }

  // Personal Protect Control Steps
  async getStepsByControlId(
    controlId: string,
    page: number,
    pageSize: number,
    search?: string
  ): Promise<PersonalProtectControlStepsPaginatedResponse> {
    try {
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("pageSize", pageSize.toString())
      if (search) {
        params.append("search", search)
      }

      const response = await this.apiDataSource.get(
        `/PersonalProtectControlSteps/byControl/${controlId}?${params.toString()}`
      )
      
      // Transform the steps to handle URLs properly
      return {
        ...response,
        data: response.data.map((step: any) => this.transformStep(step))
      }
    } catch (error) {
      console.error("Error fetching personal protect control steps:", error)
      throw error
    }
  }

  async getStepById(id: string): Promise<PersonalProtectControlStep | null> {
    try {
      const response = await this.apiDataSource.get(`/PersonalProtectControlSteps/${id}`)
      return this.transformStep(response)
    } catch (error) {
      console.error("Error fetching personal protect control step by ID:", error)
      throw error
    }
  }
}
