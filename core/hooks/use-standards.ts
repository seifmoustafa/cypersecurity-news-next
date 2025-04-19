"use client"

import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { Standard, StandardCategory, Control } from "../domain/models/standard"

export function useStandards() {
  const [standards, setStandards] = useState<Standard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        setLoading(true)
        const data = await container.services.standards.getAllStandards()
        setStandards(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchStandards()
  }, [])

  return { standards, loading, error }
}

export function useStandardById(id: string) {
  const [standard, setStandard] = useState<Standard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStandard = async () => {
      try {
        setLoading(true)
        const data = await container.services.standards.getStandardById(id)
        setStandard(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchStandard()
  }, [id])

  return { standard, loading, error }
}

export function useStandardsByCategory(category: string) {
  const [standards, setStandards] = useState<Standard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        setLoading(true)
        const data = await container.services.standards.getStandardsByCategory(category)
        setStandards(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchStandards()
  }, [category])

  return { standards, loading, error }
}

export function useStandardCategories() {
  const [categories, setCategories] = useState<StandardCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await container.services.standards.getStandardCategories()
        setCategories(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

export function useStandardCategoryById(id: string) {
  const [category, setCategory] = useState<StandardCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const data = await container.services.standards.getStandardCategoryById(id)
        setCategory(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  return { category, loading, error }
}

export function useControlsByStandardId(standardId: string) {
  const [controls, setControls] = useState<Control[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchControls = async () => {
      try {
        setLoading(true)
        const data = await container.services.standards.getControlsByStandardId(standardId)
        setControls(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchControls()
  }, [standardId])

  return { controls, loading, error }
}

export function useControlById(standardId: string, controlId: string) {
  const [control, setControl] = useState<Control | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchControl = async () => {
      try {
        setLoading(true)
        const data = await container.services.standards.getControlById(standardId, controlId)
        setControl(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchControl()
  }, [standardId, controlId])

  return { control, loading, error }
}
