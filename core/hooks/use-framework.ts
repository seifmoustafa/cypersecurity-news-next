"use client";

import { useState, useCallback, useEffect } from "react";
import { container } from "@/core/di/container";
import type {
  Framework,
  FrameworkFunction,
  Domain,
} from "@/core/domain/models/framework";

export function useFramework() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [framework, setFramework] = useState<Framework | null>(null);
  const [functions, setFunctions] = useState<FrameworkFunction[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);

  const getFramework = useCallback(async () => {
    try {
      setLoading(true);
      const data = await container.services.framework.getFramework();
      setFramework(data);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch framework")
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFrameworkFunctions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await container.services.framework.getFrameworkFunctions();
      setFunctions(data);
      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch framework functions")
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getFunctionById = useCallback(async (id: string) => {
    try {
      return await container.services.framework.getFrameworkFunctionById(id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(`Failed to fetch function with id: ${id}`)
      );
      return null;
    }
  }, []);

  const getCategoriesByFunctionId = useCallback(async (functionId: string) => {
    try {
      return await container.services.framework.getFrameworkCategories(
        functionId
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(`Failed to fetch categories for function: ${functionId}`)
      );
      return [];
    }
  }, []);

  const getDomains = useCallback(async () => {
    try {
      setLoading(true);
      const data = await container.services.framework.getDomains();
      setDomains(data);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch domains")
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getDomainById = useCallback(async (id: string) => {
    try {
      return await container.services.framework.getDomainById(id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(`Failed to fetch domain with id: ${id}`)
      );
      return null;
    }
  }, []);

  const getComponentsByDomainId = useCallback(async (domainId: string) => {
    try {
      return await container.services.framework.getComponentsByDomainId(
        domainId
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(`Failed to fetch components for domain: ${domainId}`)
      );
      return [];
    }
  }, []);

  const getImplementationSteps = useCallback(async () => {
    try {
      return await container.services.framework.getImplementationSteps();
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch implementation steps")
      );
      return [];
    }
  }, []);

  const getFrameworkBenefits = useCallback(async () => {
    try {
      return await container.services.framework.getFrameworkBenefits();
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch framework benefits")
      );
      return [];
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await getFrameworkFunctions();
      await getDomains();
    };
    loadInitialData();
  }, [getFrameworkFunctions, getDomains]);

  return {
    framework,
    functions,
    domains,
    loading,
    error,
    getFramework,
    getFrameworkFunctions,
    getFunctionById,
    getCategoriesByFunctionId,
    getDomains,
    getDomainById,
    getComponentsByDomainId,
    getImplementationSteps,
    getFrameworkBenefits,
  };
}
