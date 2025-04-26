import type {
  Framework,
  FrameworkFunction,
  FrameworkCategory,
  Domain,
  Component,
  ImplementationStep,
  FrameworkBenefit,
} from "../../domain/models/framework";
import type { FrameworkRepository } from "../../domain/repositories/framework-repository";
import {
  frameworkData,
  frameworkFunctionsData,
  domainsData,
  implementationStepsData,
  frameworkBenefitsData,
} from "@/data/framework-data";

export class FrameworkRepositoryImpl implements FrameworkRepository {
  async getFramework(): Promise<Framework> {
    // In the future, this will fetch from an API
    return {
      id: frameworkData.id,
      nameEn: frameworkData.title.en,
      nameAr: frameworkData.title.ar,
      descriptionEn: frameworkData.description.en,
      descriptionAr: frameworkData.description.ar,
    };
  }

  async getFrameworkFunctions(): Promise<FrameworkFunction[]> {
    // In the future, this will fetch from an API
    return frameworkFunctionsData.map((func) => ({
      id: func.id,
      nameEn: func.title.en,
      nameAr: func.title.ar,
      descriptionEn: func.description.en,
      descriptionAr: func.description.ar,
      color: func.color,
      textColor: func.textColor,
      borderColor: func.borderColor,
    }));
  }

  async getFrameworkFunctionById(
    id: string
  ): Promise<FrameworkFunction | null> {
    const func = frameworkFunctionsData.find((f) => f.id === id);
    if (!func) return null;

    return {
      id: func.id,
      nameEn: func.title.en,
      nameAr: func.title.ar,
      descriptionEn: func.description.en,
      descriptionAr: func.description.ar,
      color: func.color,
      textColor: func.textColor,
      borderColor: func.borderColor,
    };
  }

  async getFrameworkCategories(
    functionId: string
  ): Promise<FrameworkCategory[]> {
    const func = frameworkFunctionsData.find((f) => f.id === functionId);
    if (!func) return [];

    return func.categories.map((category) => ({
      id: category.id,
      functionId: func.id,
      nameEn: category.name.en,
      nameAr: category.name.ar,
      descriptionEn: category.description.en,
      descriptionAr: category.description.ar,
    }));
  }

  async getDomains(): Promise<Domain[]> {
    // In the future, this will fetch from an API
    return domainsData.map((domain) => ({
      id: domain.id,
      nameEn: domain.title.en,
      nameAr: domain.title.ar,
      descriptionEn: domain.description.en,
      descriptionAr: domain.description.ar,
    }));
  }

  async getDomainById(id: string): Promise<Domain | null> {
    const domain = domainsData.find((d) => d.id === id);
    if (!domain) return null;

    return {
      id: domain.id,
      nameEn: domain.title.en,
      nameAr: domain.title.ar,
      descriptionEn: domain.description.en,
      descriptionAr: domain.description.ar,
    };
  }

  async getComponentsByDomainId(domainId: string): Promise<Component[]> {
    const domain = domainsData.find((d) => d.id === domainId);
    if (!domain) return [];

    return domain.components.map((component) => ({
      id: component.id,
      domainId: domain.id,
      nameEn: component.title.en,
      nameAr: component.title.ar,
      descriptionEn: component.description.en,
      descriptionAr: component.description.ar,
    }));
  }

  async getImplementationSteps(): Promise<ImplementationStep[]> {
    // In the future, this will fetch from an API
    return implementationStepsData.map((step) => ({
      step: step.step,
      titleEn: step.title.en,
      titleAr: step.title.ar,
      descriptionEn: step.description.en,
      descriptionAr: step.description.ar,
    }));
  }

  async getFrameworkBenefits(): Promise<FrameworkBenefit[]> {
    // In the future, this will fetch from an API
    return frameworkBenefitsData.map((benefit, index) => ({
      id: `benefit-${index + 1}`,
      titleEn: benefit.title.en,
      titleAr: benefit.title.ar,
      descriptionEn: benefit.description.en,
      descriptionAr: benefit.description.ar,
    }));
  }
}
