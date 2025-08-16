"use client"

import { useState, useEffect, useCallback } from "react"
import { container } from "../di/container"
import type {
  SecurityProcedureStandard,
  SecurityProcedureControl,
  SecurityProcedureSafeguard,
  SecurityProcedureTechnique,
  SecurityProcedureImplementationStep,
} from "../domain/models/security-procedure"

// Consolidated hook for all security procedures data
export function useSecurityProcedures() {
  // Standards
  const getStandards = useCallback(async (page = 1, pageSize = 100, search = "") => {
    try {
      const result = await container.services.securityProcedures.getStandards(page, pageSize, search)
      return result.standards
    } catch (err) {
      console.error("Error fetching standards:", err)
      return []
    }
  }, [])

  const getStandardById = useCallback(async (id: string) => {
    try {
      return await container.services.securityProcedures.getStandardById(id)
    } catch (err) {
      console.error("Error fetching standard:", err)
      return null
    }
  }, [])

  // Controls
  const getControlsByStandardId = useCallback(async (standardId: string, page = 1, pageSize = 100) => {
    try {
      const result = await container.services.securityProcedures.getControlsByStandardId(standardId, page, pageSize)
      return result.controls
    } catch (err) {
      console.error("Error fetching controls:", err)
      return []
    }
  }, [])

  const getControlById = useCallback(async (id: string) => {
    try {
      return await container.services.securityProcedures.getControlById(id)
    } catch (err) {
      console.error("Error fetching control:", err)
      return null
    }
  }, [])

  // Safeguards
  const getSafeguardsByControlId = useCallback(async (controlId: string) => {
    try {
      const result = await container.services.securityProcedures.getSafeguardsByControlId(controlId)
      return result.safeguards
    } catch (err) {
      console.error("Error fetching safeguards:", err)
      return []
    }
  }, [])

  const getSafeguardById = useCallback(async (id: string) => {
    try {
      return await container.services.securityProcedures.getSafeguardById(id)
    } catch (err) {
      console.error("Error fetching safeguard:", err)
      return null
    }
  }, [])

  // Techniques
  const getTechniquesBySafeguardId = useCallback(async (safeguardId: string, page = 1, pageSize = 100, search = "") => {
    try {
      const result = await container.services.securityProcedures.getTechniquesBySafeguardId(
        safeguardId,
        page,
        pageSize,
        search,
      )
      return result.techniques
    } catch (err) {
      console.error("Error fetching techniques:", err)
      return []
    }
  }, [])

  const getTechniqueById = useCallback(async (id: string) => {
    try {
      return await container.services.securityProcedures.getTechniqueById(id)
    } catch (err) {
      console.error("Error fetching technique:", err)
      return null
    }
  }, [])

  // Implementation Steps
  const getImplementationStepsByTechniqueId = useCallback(async (techniqueId: string) => {
    try {
      const result = await container.services.securityProcedures.getImplementationStepsByTechniqueId(techniqueId)
      return result.implementationSteps
    } catch (err) {
      console.error("Error fetching implementation steps:", err)
      return []
    }
  }, [])

  const getImplementationStepById = useCallback(async (id: string) => {
    try {
      return await container.services.securityProcedures.getImplementationStepById(id)
    } catch (err) {
      console.error("Error fetching implementation step:", err)
      return null
    }
  }, [])

  return {
    getStandards,
    getStandardById,
    getControlsByStandardId,
    getControlById,
    getSafeguardsByControlId,
    getSafeguardById,
    getTechniquesBySafeguardId,
    getTechniqueById,
    getImplementationStepsByTechniqueId,
    getImplementationStepById,
  }
}

// Individual hooks for specific use cases
export function useSecurityProcedureStandards(page = 1, pageSize = 10, search = "") {
  const [standards, setStandards] = useState<SecurityProcedureStandard[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getStandards(page, pageSize, search)
        setStandards(result.standards)
        setPagination(result.pagination)
      } catch (err) {
        setError("Failed to fetch standards")
        console.error("Error fetching standards:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStandards()
  }, [page, pageSize, search])

  return { standards, pagination, loading, error }
}

export function useSecurityProcedureControls(standardId: string, page = 1, pageSize = 10, PageSearch = "") {
  const [allControls, setAllControls] = useState<SecurityProcedureControl[]>([])
  const [controls, setControls] = useState<SecurityProcedureControl[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!standardId) {
      setLoading(false)
      return
    }

    const fetchControls = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getControlsByStandardId(standardId, page, pageSize, PageSearch)
        setControls(result.controls)
        setPagination({
          itemsCount: result.pagination.itemsCount,
          pageSize: result.pagination.pageSize,
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
        })
      } catch (err) {
        setError("Failed to fetch controls")
        console.error("Error fetching controls:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchControls()
  }, [standardId, page, pageSize, PageSearch])

  return { controls, pagination, loading, error }
}

export function useSecurityProcedureSafeguards(controlId: string, page = 1, pageSize = 10, PageSearch = "") {
  const [allSafeguards, setAllSafeguards] = useState<SecurityProcedureSafeguard[]>([])
  const [safeguards, setSafeguards] = useState<SecurityProcedureSafeguard[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!controlId) {
      setLoading(false)
      return
    }

    const fetchSafeguards = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getSafeguardsByControlId(controlId, page, pageSize, PageSearch)
        setSafeguards(result.safeguards)
        setPagination({
          itemsCount: result.pagination.itemsCount,
          pageSize: result.pagination.pageSize,
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
        })
      } catch (err) {
        setError("Failed to fetch safeguards")
        console.error("Error fetching safeguards:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSafeguards()
  }, [controlId, page, pageSize, PageSearch])

  return { safeguards, pagination, loading, error }
}

export function useSecurityProcedureTechniques(safeguardId: string, page = 1, pageSize = 10, PageSearch = "") {
  const [techniques, setTechniques] = useState<SecurityProcedureTechnique[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!safeguardId) {
      setLoading(false)
      return
    }

    const fetchTechniques = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getTechniquesBySafeguardId(
          safeguardId,
          page,
          pageSize,
          PageSearch,
        )
        setTechniques(result.techniques)
        setPagination(result.pagination)
      } catch (err) {
        setError("Failed to fetch techniques")
        console.error("Error fetching techniques:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTechniques()
  }, [safeguardId, page, pageSize, PageSearch])

  return { techniques, pagination, loading, error }
}

export function useSecurityProcedureImplementationSteps(techniqueId: string, page = 1, pageSize = 10, PageSearch = "") {
  const [implementationSteps, setImplementationSteps] = useState<SecurityProcedureImplementationStep[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!techniqueId) {
      setLoading(false)
      return
    }

    const fetchImplementationSteps = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getImplementationStepsByTechniqueId(techniqueId, page, pageSize, PageSearch)
        setImplementationSteps(result.implementationSteps)
        setPagination(result.pagination)
      } catch (err) {
        setError("Failed to fetch implementation steps")
        console.error("Error fetching implementation steps:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchImplementationSteps()
  }, [techniqueId, page, pageSize, PageSearch])

  return { implementationSteps, pagination, loading, error }
}
