import type { ApiDataSource } from "@/core/data/sources/api-data-source";
import type { HelperRepository } from "@/core/domain/repositories/helper-repository";
import type { HelperCategory, HelperCategoriesResponse, Helper, HelpersResponse } from "@/core/domain/models/helper";

export class HelperRepositoryImpl implements HelperRepository {
  constructor(private dataSource: ApiDataSource) {}

  async getAllCategories(page = 1, pageSize = 10, search?: string): Promise<HelperCategoriesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await this.dataSource.get<HelperCategoriesResponse>(`/HelperCategory?${params.toString()}`);
    return response;
  }

  async getCategoryById(id: string): Promise<HelperCategory | null> {
    try {
      const response = await this.dataSource.get<HelperCategory>(`/HelperCategory/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching helper category with id ${id}:`, error);
      return null;
    }
  }

  async getHelpersByCategory(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<HelpersResponse> {
    const params = new URLSearchParams({
      categoryId: categoryId,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await this.dataSource.get<HelpersResponse>(`/Helper/byCategory?${params.toString()}`);
    return response;
  }

  async getHelperById(id: string): Promise<Helper | null> {
    try {
      const response = await this.dataSource.get<Helper>(`/Helper/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching helper with id ${id}:`, error);
      return null;
    }
  }
}
