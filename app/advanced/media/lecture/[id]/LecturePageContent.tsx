"use client"

import { mediaLibraryData } from "@/data/media-library-data"
import { notFound } from "next/navigation"
import Image from "next/image"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function LecturePageContent() {
  const params = useParams()
  const id = params.id as string
  const { language, isRtl } = useLanguage()
  const [lecture, setLecture] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const lectureItem = mediaLibraryData.lectures.find((item) => item.id.toString() === id)
    if (!lectureItem) {
      notFound()
    }
    setLecture(lectureItem)
  }, [id])

  if (!lecture) {
    return null
  }

  return (
    <MainLayout>
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center">
              <Link href="/#media">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع" : "Back"}</span>
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-center flex-1">{lecture.title[language]}</h1>
            </div>

            <div className={`text-muted-foreground mb-6 ${isRtl ? "text-right" : "text-left"}`}>
              <p className="text-lg">{lecture.description[language]}</p>
            </div>

            <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={lecture.thumbnailUrl || "/placeholder.svg"}
                alt={lecture.title[language]}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isRtl ? (
                <>
                  <div className="prose dark:prose-invert max-w-none" dir="rtl">
                    <div dangerouslySetInnerHTML={{ __html: lecture.content.ar }} />
                  </div>
                  {language === "en" && (
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: lecture.content.en }} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: lecture.content.en }} />
                  </div>
                  {language === "ar" && (
                    <div className="prose dark:prose-invert max-w-none" dir="rtl">
                      <div dangerouslySetInnerHTML={{ __html: lecture.content.ar }} />
                    </div>
                  )}
                </>
              )}
            </div>

            {lecture.url && (
              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  onClick={() => window.open(lecture.url, "_blank")}
                  className="bg-primary hover:bg-primary/90"
                >
                  {language === "ar" ? "تحميل مواد المحاضرة" : "Download Lecture Materials"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
