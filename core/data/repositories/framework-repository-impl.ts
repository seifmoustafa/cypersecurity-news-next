import type { FrameworkRepository } from "../../domain/repositories/framework-repository"
import type { Framework, Domain, Component, FrameworkFunction, FrameworkCategory } from "../../domain/models/framework"
import type { MockDataSource } from "../sources/mock-data-source"

export class FrameworkRepositoryImpl implements FrameworkRepository {
  private dataSource: MockDataSource

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  async getFramework(): Promise<Framework> {
    return this.dataSource.getFramework()
  }

  async getFrameworkFunctions(): Promise<FrameworkFunction[]> {
    return this.dataSource.getFrameworkFunctions()
  }

  async getFrameworkFunctionById(id: string): Promise<FrameworkFunction | null> {
    return this.dataSource.getFrameworkFunctionById(id)
  }

  async getFrameworkCategories(functionId: string): Promise<FrameworkCategory[]> {
    return this.dataSource.getFrameworkCategories(functionId)
  }

  async getDomains(): Promise<Domain[]> {
    return this.dataSource.getDomains()
  }

  async getDomainById(id: string): Promise<Domain | null> {
    return this.dataSource.getDomainById(id)
  }

  async getComponentsByDomainId(domainId: string): Promise<Component[]> {
    return this.dataSource.getComponentsByDomainId(domainId)
  }
}
