"use client"

import { awarenessData } from "@/data/awareness-data"
import { notFound } from "next/navigation"
import Image from "next/image"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Suspense } from "react"

// Helper function to get awareness item by ID
function getAwarenessById(id: string) {
  const allItems = [...awarenessData.bulletins, ...awarenessData.articles]
  return allItems.find((item) => item.id.toString() === id)
}

export default function AwarenessItemPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AwarenessItemContent />
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

function AwarenessItemContent() {
  const params = useParams()
  const id = params.id as string
  const { language, isRtl } = useLanguage()
  const [item, setItem] = useState<any>(null)

  useEffect(() => {
    const awarenessItem = getAwarenessById(id)
    if (!awarenessItem) {
      notFound()
    }
    setItem(awarenessItem)
  }, [id])

  if (!item) {
    return <LoadingState />
  }

  return (
    <MainLayout>
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className={`text-sm text-muted-foreground mb-2 ${isRtl ? "text-right" : "text-left"}`}>
                {new Date(item.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
              </div>
              <h1
                className={`text-3xl md:text-4xl font-bold mb-4 text-foreground ${isRtl ? "text-right" : "text-left"}`}
              >
                {item.title[language]}
              </h1>
              <div className={`text-muted-foreground mb-6 ${isRtl ? "text-right" : "text-left"}`}>
                <p className="text-lg">{item.summary[language]}</p>
              </div>
            </div>

            <div className="relative w-full h-[300px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title[language]}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className={`prose dark:prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}>
              <div dangerouslySetInnerHTML={{ __html: item.content[language] }} />
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
