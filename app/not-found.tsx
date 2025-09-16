"use client"

import UnifiedErrorPage from "@/components/unified-error-page"

export default function NotFound() {
  return (
    <UnifiedErrorPage
      type="not-found"
      title="404 - الصفحة غير موجودة"
    />
  )
}
