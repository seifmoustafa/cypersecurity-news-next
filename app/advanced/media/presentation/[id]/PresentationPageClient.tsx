"use client"

import { mediaLibraryData } from "@/data/media-library-data"
import { notFound } from "next/navigation"
import Image from "next/image"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"

export default function PresentationPageClient({ params }: { params: { id: string } }) {
  const presentation = mediaLibraryData.presentations.find((item) => item.id.toString() === params.id)

  if (!presentation) {
    notFound()
  }

  return (
    <MainLayout>
      <article className="pt-36 pb-16 bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 dark:from-purple-950/30 dark:via-slate-900 dark:to-blue-950/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Header Section */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg shadow-purple-500/30">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h3zM9 4h6V3H9v1z" />
                </svg>
                Presentation
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 dark:from-purple-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {presentation.title.ar}
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold mb-8 text-muted-foreground">
                {presentation.title.en}
              </h2>
              
              <div className="max-w-3xl mx-auto">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-200/30 dark:border-purple-800/30 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20">
                  <p className="text-lg text-muted-foreground mb-4">{presentation.description.ar}</p>
                  <p className="text-base text-muted-foreground">{presentation.description.en}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Image Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 dark:shadow-purple-500/30 border border-purple-200/30 dark:border-purple-800/30">
                <Image
                  src={presentation.thumbnailUrl || "/placeholder.svg"}
                  alt={presentation.title.ar}
                  width={900}
                  height={675}
                  className="object-contain"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>

            {/* Enhanced Action Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => window.open(presentation.url, "_blank")}
                className="px-8 py-4 text-lg font-semibold shadow-xl shadow-purple-500/30 dark:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Presentation
              </Button>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
