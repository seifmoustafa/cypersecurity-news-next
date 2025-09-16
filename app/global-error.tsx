"use client"

import { useEffect } from "react"
import UnifiedErrorPage from "@/components/unified-error-page"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Application Error:', error)
  }, [error])

  return (
    <html>
      <body>
        <UnifiedErrorPage
          type="critical"
          error={error}
          onRetry={reset}
          showErrorDetails={process.env.NODE_ENV === 'development'}
        />
      </body>
    </html>
  )
}
