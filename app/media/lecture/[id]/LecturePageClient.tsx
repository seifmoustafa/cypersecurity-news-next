"use client"

import { mediaLibraryData } from "@/data/media-library-data"
import { notFound } from "next/navigation"
import Image from "next/image"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"

export default function LecturePageClient({ params }: { params: { id: string } }) {
  const lecture = mediaLibraryData.lectures.find((item) => item.id.toString() === params.id)

  if (!lecture) {
    notFound()
  }

  return (
    <MainLayout>
      <article className="pt-36 pb-16 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-blue-950/30 dark:via-slate-900 dark:to-purple-950/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Header Section */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg shadow-purple-500/30">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Lecture
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                {lecture.title.ar}
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold mb-8 text-muted-foreground">
                {lecture.title.en}
              </h2>
              
              <div className="max-w-3xl mx-auto">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 dark:border-blue-800/30 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20">
                  <p className="text-lg text-muted-foreground mb-4">{lecture.description.ar}</p>
                  <p className="text-base text-muted-foreground">{lecture.description.en}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Image Section */}
            <div className="relative w-full h-[400px] md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/30 border border-blue-200/30 dark:border-blue-800/30">
              <Image
                src={lecture.thumbnailUrl || "/placeholder.svg"}
                alt={lecture.title.ar}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Enhanced Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 dark:border-blue-800/30 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  المحتوى العربي
                </h3>
                <div className="prose dark:prose-invert max-w-none" dir="rtl">
                  <div dangerouslySetInnerHTML={{ __html: lecture.content.ar }} />
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 dark:border-blue-800/30 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  English Content
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: lecture.content.en }} />
                </div>
              </div>
            </div>

            {/* Enhanced Action Button */}
            {lecture.url && (
              <div className="mt-12 flex justify-center">
                <Button
                  size="lg"
                  onClick={() => window.open(lecture.url, "_blank")}
                  className="px-8 py-4 text-lg font-semibold shadow-xl shadow-purple-500/30 dark:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Lecture Materials
                </Button>
              </div>
            )}
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
