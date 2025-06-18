import { Suspense } from "react";
import ImplementationStepDetailPageClient from "./ImplementationStepDetailPageClient";
import { Skeleton } from "@/components/ui/skeleton";
import MainLayout from "@/components/layouts/main-layout";

interface PageProps {
  params: Promise<{
    standardId: string;
    controlId: string;
    safeguardId: string;
    techniqueId: string;
    implementationId: string;
  }>;
}

export default async function ImplementationStepDetailPage({
  params,
}: PageProps) {
  const { standardId, controlId, safeguardId, techniqueId, implementationId } =
    await params;

  return (
    <MainLayout>
      <Suspense fallback={<ImplementationStepDetailPageSkeleton />}>
        <ImplementationStepDetailPageClient
          standardId={standardId}
          controlId={controlId}
          safeguardId={safeguardId}
          techniqueId={techniqueId}
          implementationId={implementationId}
        />
      </Suspense>
    </MainLayout>
  );
}

function ImplementationStepDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-12 w-96 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800 p-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
