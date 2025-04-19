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
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{lecture.title.ar}</h1>
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground/80">{lecture.title.en}</h2>
              <div className="text-muted-foreground mb-6">
                <p className="text-lg">{lecture.description.ar}</p>
                <p className="text-base mt-2">{lecture.description.en}</p>
              </div>
            </div>

            <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={lecture.thumbnailUrl || "/placeholder.svg"}
                alt={lecture.title.ar}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="prose dark:prose-invert max-w-none" dir="rtl">
                <div dangerouslySetInnerHTML={{ __html: lecture.content.ar }} />
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lecture.content.en }} />
              </div>
            </div>

            {lecture.url && (
              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  onClick={() => window.open(lecture.url, "_blank")}
                  className="bg-primary hover:bg-primary/90"
                >
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
