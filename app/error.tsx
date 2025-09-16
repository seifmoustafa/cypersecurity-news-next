"use client"

import { useEffect } from "react"
import UnifiedErrorPage from "@/components/unified-error-page"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error)
  }, [error])

  return (
    <UnifiedErrorPage
      type="runtime"
      error={error}
      onRetry={reset}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    />
  )
}
