import type { HelperCategory, HelperCategoriesResponse, Helper, HelpersResponse } from "../models/helper";

export interface HelperRepository {
  getAllCategories(page?: number, pageSize?: number, search?: string): Promise<HelperCategoriesResponse>;
  getCategoryById(id: string): Promise<HelperCategory | null>;
  getHelpersByCategory(categoryId: string, page?: number, pageSize?: number, search?: string): Promise<HelpersResponse>;
  getHelperById(id: string): Promise<Helper | null>;
}
