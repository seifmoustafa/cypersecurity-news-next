import type {
  Framework,
  FrameworkFunction,
  FrameworkCategory,
  Domain,
  Component,
  ImplementationStep,
  FrameworkBenefit,
} from "../models/framework";

export interface FrameworkRepository {
  getFramework(): Promise<Framework>;
  getFrameworkFunctions(): Promise<FrameworkFunction[]>;
  getFrameworkFunctionById(id: string): Promise<FrameworkFunction | null>;
  getFrameworkCategories(functionId: string): Promise<FrameworkCategory[]>;
  getDomains(): Promise<Domain[]>;
  getDomainById(id: string): Promise<Domain | null>;
  getComponentsByDomainId(domainId: string): Promise<Component[]>;
  getImplementationSteps(): Promise<ImplementationStep[]>;
  getFrameworkBenefits(): Promise<FrameworkBenefit[]>;
}
