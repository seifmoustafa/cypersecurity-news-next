"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-destructive/10 p-6 rounded-lg max-w-lg w-full">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <h2 className="text-xl font-bold">Something went wrong</h2>
        </div>
        <p className="mb-4 text-muted-foreground">An unexpected error occurred. Our team has been notified.</p>
        <div className="bg-muted p-3 rounded mb-4 overflow-auto max-h-32">
          <code className="text-sm">{error.message || "Unknown error"}</code>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link href={ROUTES.HOME}>
            <Button variant="outline">Go to homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
