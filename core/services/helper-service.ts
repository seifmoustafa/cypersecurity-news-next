import type { HelperRepository } from "../domain/repositories/helper-repository";
import type {
  HelperCategory,
  HelperCategoriesResponse,
  Helper,
  HelpersResponse,
} from "../domain/models/helper";

export class HelperService {
  private repository: HelperRepository;

  constructor(repository: HelperRepository) {
    this.repository = repository;
  }

  async getAllCategories(page = 1, pageSize = 10, search?: string): Promise<HelperCategoriesResponse> {
    return this.repository.getAllCategories(page, pageSize, search);
  }

  async getCategoryById(id: string): Promise<HelperCategory | null> {
    return this.repository.getCategoryById(id);
  }

  async getHelpersByCategory(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<HelpersResponse> {
    return this.repository.getHelpersByCategory(categoryId, page, pageSize, search);
  }

  async getHelperById(id: string): Promise<Helper | null> {
    return this.repository.getHelperById(id);
  }
}
