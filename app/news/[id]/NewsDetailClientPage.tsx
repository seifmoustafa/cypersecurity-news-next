"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { Loading } from "@/components/ui/loading"

export default function NewsDetailClientPage({ newsItem }: { newsItem: any }) {
  const { language, isRtl } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState<any>(null)

  useEffect(() => {
    // Simulate data fetching to avoid hydration issues
    setLoading(true)
    setNews(newsItem)
    setLoading(false)
  }, [newsItem])

  if (loading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16">
          <Loading fullPage text={language === "ar" ? "جاري التحميل..." : "Loading..."} />
        </div>
      </MainLayout>
    )
  }

  if (!news) {
    notFound()
  }

  return (
    <MainLayout>
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className={`text-sm text-muted-foreground mb-2 ${isRtl ? "text-right" : "text-left"}`}>
                {news.date}
              </div>
              <h1
                className={`text-3xl md:text-4xl font-bold mb-4 text-foreground ${isRtl ? "text-right" : "text-left"}`}
              >
                {news.title[language]}
              </h1>
              <div className={`text-muted-foreground mb-6 ${isRtl ? "text-right" : "text-left"}`}>
                <p className="text-lg">{news.summary[language]}</p>
              </div>
            </div>

            <div className="relative w-full h-[300px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={news.imageUrl || "/placeholder.svg"}
                alt={news.title[language]}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className={`prose dark:prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}>
              <div dangerouslySetInnerHTML={{ __html: news.content[language] }} />
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
