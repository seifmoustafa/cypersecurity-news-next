import type { FrameworkRepository } from "../domain/repositories/framework-repository"
import type { Framework, Domain, Component } from "../domain/models/framework"

export class FrameworkService {
  private repository: FrameworkRepository

  constructor(repository: FrameworkRepository) {
    this.repository = repository
  }

  async getFramework(): Promise<Framework> {
    return this.repository.getFramework()
  }

  async getDomains(): Promise<Domain[]> {
    return this.repository.getDomains()
  }

  async getDomainById(id: string): Promise<Domain | null> {
    return this.repository.getDomainById(id)
  }

  async getComponentsByDomainId(domainId: string): Promise<Component[]> {
    return this.repository.getComponentsByDomainId(domainId)
  }
}
