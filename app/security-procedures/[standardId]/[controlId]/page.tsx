import { Suspense } from "react"
import SafeguardsPageClient from "./SafeguardsPageClient"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  params: Promise<{ standardId: string; controlId: string }>
}

export default async function SafeguardsPage({ params }: PageProps) {
  const { standardId, controlId } = await params

  return (
    <Suspense fallback={<SafeguardsPageSkeleton />}>
      <SafeguardsPageClient standardId={standardId} controlId={controlId} />
    </Suspense>
  )
}

function SafeguardsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800 p-6"
            >
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
