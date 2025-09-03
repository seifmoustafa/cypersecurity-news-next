"use client"

import { useParams } from "next/navigation"
import { Suspense } from "react"
import MainLayout from "@/components/layouts/main-layout"
import TechniqueDetailPageClient from "./TechniqueDetailPageClient"

export default function TechniqueDetailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TechniqueDetailPageClient />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </MainLayout>
  )
}
