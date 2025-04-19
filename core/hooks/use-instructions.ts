"use client"

import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { Instruction } from "../domain/models/instruction"

export function useInstructions() {
  const [instructions, setInstructions] = useState<Instruction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        setLoading(true)
        const data = await container.services.instructions.getAllInstructions()
        setInstructions(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchInstructions()
  }, [])

  return { instructions, loading, error }
}

export function useInstructionsByType(type: "group" | "branch") {
  const [instructions, setInstructions] = useState<Instruction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        setLoading(true)
        const data = await container.services.instructions.getInstructionsByType(type)
        setInstructions(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchInstructions()
  }, [type])

  return { instructions, loading, error }
}

export function useInstructionsByYear(year: string) {
  const [instructions, setInstructions] = useState<Instruction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        setLoading(true)
        const data = await container.services.instructions.getInstructionsByYear(year)
        setInstructions(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchInstructions()
  }, [year])

  return { instructions, loading, error }
}

export function useInstructionsByTypeAndYear(type: "group" | "branch", year: string) {
  const [instruction, setInstruction] = useState<Instruction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchInstruction = async () => {
      try {
        setLoading(true)
        const data = await container.services.instructions.getInstructionsByTypeAndYear(type, year)
        setInstruction(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchInstruction()
  }, [type, year])

  return { instruction, loading, error }
}

export function useYearsByType(type: "group" | "branch") {
  const [years, setYears] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true)
        const data = await container.services.instructions.getYearsByType(type)
        setYears(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchYears()
  }, [type])

  return { years, loading, error }
}
