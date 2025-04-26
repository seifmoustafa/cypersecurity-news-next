import type {
  Framework,
  FrameworkFunction,
  FrameworkCategory,
  Domain,
  Component,
  ImplementationStep,
  FrameworkBenefit,
} from "../domain/models/framework";
import type { FrameworkRepository } from "../domain/repositories/framework-repository";

export class FrameworkService {
  private repository: FrameworkRepository;

  constructor(repository: FrameworkRepository) {
    this.repository = repository;
  }

  async getFramework(): Promise<Framework> {
    return this.repository.getFramework();
  }

  async getFrameworkFunctions(): Promise<FrameworkFunction[]> {
    return this.repository.getFrameworkFunctions();
  }

  async getFrameworkFunctionById(
    id: string
  ): Promise<FrameworkFunction | null> {
    return this.repository.getFrameworkFunctionById(id);
  }

  async getFrameworkCategories(
    functionId: string
  ): Promise<FrameworkCategory[]> {
    return this.repository.getFrameworkCategories(functionId);
  }

  async getDomains(): Promise<Domain[]> {
    return this.repository.getDomains();
  }

  async getDomainById(id: string): Promise<Domain | null> {
    return this.repository.getDomainById(id);
  }

  async getComponentsByDomainId(domainId: string): Promise<Component[]> {
    return this.repository.getComponentsByDomainId(domainId);
  }

  async getImplementationSteps(): Promise<ImplementationStep[]> {
    return this.repository.getImplementationSteps();
  }

  async getFrameworkBenefits(): Promise<FrameworkBenefit[]> {
    return this.repository.getFrameworkBenefits();
  }
}
