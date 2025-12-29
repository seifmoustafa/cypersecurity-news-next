import { Suspense } from "react"
import AwarenessDetailPageClient from "./AwarenessDetailPageClient"

interface AwarenessDetailPageProps {
  params: Promise<{
    year: string
    id: string
  }>
}

export default async function AwarenessDetailPage({ params }: AwarenessDetailPageProps) {
  const resolvedParams = await params
  const { year, id } = resolvedParams

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AwarenessDetailPageClient year={year} id={id} />
    </Suspense>
  )
}
