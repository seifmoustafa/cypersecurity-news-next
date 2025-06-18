"use client"

import { useState, useEffect } from "react"
import { container } from "../di/container"
import type {
  SecurityProcedureStandard,
  SecurityProcedureControl,
  SecurityProcedureSafeguard,
  SecurityProcedureTechnique,
  SecurityProcedureImplementationStep,
} from "../domain/models/security-procedure"

// Hook for standards
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

// Hook for controls by standard ID
export function useSecurityProcedureControls(standardId: string, page = 1, pageSize = 10) {
  const [controls, setControls] = useState<SecurityProcedureControl[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!standardId) return

    const fetchControls = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getControlsByStandardId(standardId, page, pageSize)
        setControls(result.controls)
        setPagination(result.pagination)
      } catch (err) {
        setError("Failed to fetch controls")
        console.error("Error fetching controls:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchControls()
  }, [standardId, page, pageSize])

  return { controls, pagination, loading, error }
}

// Hook for safeguards by control ID
export function useSecurityProcedureSafeguards(controlId: string) {
  const [safeguards, setSafeguards] = useState<SecurityProcedureSafeguard[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!controlId) return

    const fetchSafeguards = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getSafeguardsByControlId(controlId)
        setSafeguards(result.safeguards)
        setPagination(result.pagination)
      } catch (err) {
        setError("Failed to fetch safeguards")
        console.error("Error fetching safeguards:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSafeguards()
  }, [controlId])

  return { safeguards, pagination, loading, error }
}

// Hook for techniques by safeguard ID
export function useSecurityProcedureTechniques(safeguardId: string, page = 1, pageSize = 10, search = "") {
  const [techniques, setTechniques] = useState<SecurityProcedureTechnique[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!safeguardId) return

    const fetchTechniques = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getTechniquesBySafeguardId(
          safeguardId,
          page,
          pageSize,
          search,
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
  }, [safeguardId, page, pageSize, search])

  return { techniques, pagination, loading, error }
}

// Hook for implementation steps by technique ID
export function useSecurityProcedureImplementationSteps(techniqueId: string) {
  const [implementationSteps, setImplementationSteps] = useState<SecurityProcedureImplementationStep[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!techniqueId) return

    const fetchImplementationSteps = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getImplementationStepsByTechniqueId(techniqueId)
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
  }, [techniqueId])

  return { implementationSteps, pagination, loading, error }
}

// Hook for individual entities by ID
export function useSecurityProcedureStandard(id: string) {
  const [standard, setStandard] = useState<SecurityProcedureStandard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchStandard = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getStandardById(id)
        setStandard(result)
      } catch (err) {
        setError("Failed to fetch standard")
        console.error("Error fetching standard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStandard()
  }, [id])

  return { standard, loading, error }
}

export function useSecurityProcedureControl(id: string) {
  const [control, setControl] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchControl = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getControlById(id)
        setControl(result)
      } catch (err) {
        setError("Failed to fetch control")
        console.error("Error fetching control:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchControl()
  }, [id])

  return { control, loading, error }
}

export function useSecurityProcedureSafeguard(id: string) {
  const [safeguard, setSafeguard] = useState<SecurityProcedureSafeguard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchSafeguard = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getSafeguardById(id)
        setSafeguard(result)
      } catch (err) {
        setError("Failed to fetch safeguard")
        console.error("Error fetching safeguard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSafeguard()
  }, [id])

  return { safeguard, loading, error }
}

export function useSecurityProcedureTechnique(id: string) {
  const [technique, setTechnique] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchTechnique = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getTechniqueById(id)
        setTechnique(result)
      } catch (err) {
        setError("Failed to fetch technique")
        console.error("Error fetching technique:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTechnique()
  }, [id])

  return { technique, loading, error }
}

export function useSecurityProcedureImplementationStep(id: string) {
  const [implementationStep, setImplementationStep] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchImplementationStep = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await container.services.securityProcedures.getImplementationStepById(id)
        setImplementationStep(result)
      } catch (err) {
        setError("Failed to fetch implementation step")
        console.error("Error fetching implementation step:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchImplementationStep()
  }, [id])

  return { implementationStep, loading, error }
}
