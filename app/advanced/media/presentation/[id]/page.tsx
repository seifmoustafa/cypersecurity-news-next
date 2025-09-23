"use client"

import { Suspense } from "react"
import PresentationPageContent from "./PresentationPageContent"
import MainLayout from "@/components/layouts/main-layout"

export default function PresentationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PresentationPageContent />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse">Loading...</div>
      </div>
    </MainLayout>
  )
}
