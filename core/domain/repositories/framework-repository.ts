import type { Framework, Domain, Component } from "../models/framework"

export interface FrameworkRepository {
  getFramework(): Promise<Framework>
  getDomains(): Promise<Domain[]>
  getDomainById(id: string): Promise<Domain | null>
  getComponentsByDomainId(domainId: string): Promise<Component[]>
}
