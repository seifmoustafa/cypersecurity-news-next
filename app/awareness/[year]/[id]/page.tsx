import { Suspense } from "react"
import AwarenessDetailPageClient from "./AwarenessDetailPageClient"

interface AwarenessDetailPageProps {
  params: {
    year: string
    id: string
  }
}

export default function AwarenessDetailPage({ params }: AwarenessDetailPageProps) {
  const { year, id } = params

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AwarenessDetailPageClient year={year} id={id} />
    </Suspense>
  )
}
