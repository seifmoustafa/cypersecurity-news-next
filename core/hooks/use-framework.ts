"use client"

import { useState, useEffect } from "react"
import { container } from "@/core/di/container"
import type { Framework, FrameworkFunction, FrameworkCategory, Domain, Component } from "@/core/domain/models/framework"

export function useFramework() {
  const [framework, setFramework] = useState<Framework | null>(null)
  const [functions, setFunctions] = useState<FrameworkFunction[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const frameworkService = container.services.framework

    const fetchFramework = async () => {
      try {
        setLoading(true)
        const frameworkData = await frameworkService.getFramework()
        const functionsData = await frameworkService.getFrameworkFunctions()
        const domainsData = await frameworkService.getDomains()

        setFramework(frameworkData)
        setFunctions(functionsData)
        setDomains(domainsData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchFramework()
  }, [])

  const getFunctionById = async (id: string): Promise<FrameworkFunction | null> => {
    try {
      const frameworkService = container.services.framework
      return await frameworkService.getFrameworkFunctionById(id)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      return null
    }
  }

  const getCategoriesByFunctionId = async (functionId: string): Promise<FrameworkCategory[]> => {
    try {
      const frameworkService = container.services.framework
      return await frameworkService.getFrameworkCategories(functionId)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      return []
    }
  }

  const getDomainById = async (id: string): Promise<Domain | null> => {
    try {
      const frameworkService = container.services.framework
      return await frameworkService.getDomainById(id)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      return null
    }
  }

  const getComponentsByDomainId = async (domainId: string): Promise<Component[]> => {
    try {
      const frameworkService = container.services.framework
      return await frameworkService.getComponentsByDomainId(domainId)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      return []
    }
  }

  return {
    framework,
    functions,
    domains,
    loading,
    error,
    getFunctionById,
    getCategoriesByFunctionId,
    getDomainById,
    getComponentsByDomainId,
  }
}
