import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import MainLayout from "@/components/layouts/main-layout"
import ImplementationStepDetailPageClient from "./ImplementationStepDetailPageClient"

interface PageProps {
  params: {
    standard: string
    control: string
    safeguard: string
    technique: string
    implementation: string
  }
}

export default function ImplementationStepDetailPage({ params }: PageProps) {
  return (
    <MainLayout>
      <Suspense fallback={<ImplementationStepDetailPageSkeleton />}>
        <ImplementationStepDetailPageClient
          standardSlug={params.standard}
          controlSlug={params.control}
          safeguardSlug={params.safeguard}
          techniqueSlug={params.technique}
          implementationSlug={params.implementation}
        />
      </Suspense>
    </MainLayout>
  )
}

function ImplementationStepDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800 p-8">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800 p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
