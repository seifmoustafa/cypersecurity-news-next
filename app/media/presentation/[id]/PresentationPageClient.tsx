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
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{presentation.title.ar}</h1>
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground/80">{presentation.title.en}</h2>
              <div className="text-muted-foreground mb-6">
                <p className="text-lg">{presentation.description.ar}</p>
                <p className="text-base mt-2">{presentation.description.en}</p>
              </div>
            </div>

            <div className="flex flex-col items-center mb-8">
              <Image
                src={presentation.thumbnailUrl || "/placeholder.svg"}
                alt={presentation.title.ar}
                width={800}
                height={600}
                className="object-contain rounded-lg shadow-lg"
                priority
              />
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => window.open(presentation.url, "_blank")}
                className="bg-primary hover:bg-primary/90"
              >
                Download Presentation
              </Button>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
