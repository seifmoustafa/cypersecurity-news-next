"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { mediaLibraryData } from "@/data/media-library-data"

export default function PresentationPageContent() {
  const params = useParams()
  const id = params.id as string
  const { language, isRtl } = useLanguage()
  const [presentation, setPresentation] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const presentationItem = mediaLibraryData.presentations.find((item) => item.id.toString() === id)
    if (!presentationItem) {
      notFound()
    }
    setPresentation(presentationItem)
  }, [id])

  if (!presentation) {
    return null
  }

  return (
    <MainLayout>
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center">
              <Link href="/advanced#media">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع" : "Back"}</span>
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-center flex-1">{presentation.title[language]}</h1>
            </div>

            <div className={`text-muted-foreground mb-6 ${isRtl ? "text-right" : "text-left"}`}>
              <p className="text-lg">{presentation.description[language]}</p>
            </div>

            <div className="flex flex-col items-center mb-8">
              <Image
                src={presentation.thumbnailUrl || "/placeholder.svg"}
                alt={presentation.title[language]}
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
                {language === "ar" ? "تحميل العرض التقديمي" : "Download Presentation"}
              </Button>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
