"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Error caught by error boundary:", error)
      setError(error.error)
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  if (hasError) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
          <div className="bg-destructive/10 p-6 rounded-lg max-w-lg w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <h2 className="text-xl font-bold">Something went wrong</h2>
            </div>
            <p className="mb-4 text-muted-foreground">An unexpected error occurred. Our team has been notified.</p>
            {error && (
              <div className="bg-muted p-3 rounded mb-4 overflow-auto max-h-32">
                <code className="text-sm">{error.message}</code>
              </div>
            )}
            <Button onClick={() => window.location.reload()}>Refresh the page</Button>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
