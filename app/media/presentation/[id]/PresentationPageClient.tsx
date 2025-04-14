"use client"

import { mediaLibraryData } from "@/data/media-library-data"
import { notFound } from "next/navigation"
import Image from "next/image"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export default function PresentationPageClient({ id }: { id: string }) {
  const { language } = useLanguage()

  const presentation = mediaLibraryData.presentations.find(
    (item) => item.id.toString() === id
  )

  if (!presentation) {
    notFound()
  }

  return (
    <MainLayout>
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Title & Description */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                {presentation.title[language]}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {presentation.description[language]}
              </p>
            </div>

            {/* Thumbnail */}
            <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden shadow-md">
              <Image
                src={presentation.thumbnailUrl || "/placeholder.svg"}
                alt={presentation.title[language]}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => window.open(presentation.url, "_blank")}
                className="bg-primary hover:bg-primary/90"
              >
                {language === "ar" ? "تحميل العرض التقديمي" : "Download Presentation"}
              </Button>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
