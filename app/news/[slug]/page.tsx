"use client"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { Suspense, useEffect } from "react"
import { useNewsBySlug } from "@/core/hooks/use-news"
import DOMPurify from "isomorphic-dompurify"

export default function NewsArticlePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <NewsArticleContent />
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

function NewsArticleContent() {
  const params = useParams()
  const slug = params.slug as string
  const { language, isRtl } = useLanguage()

  const { news, loading, error } = useNewsBySlug(slug)

  // Debug: Log the slug and news data
  useEffect(() => {
    console.log("Current slug:", slug)
    console.log("News data:", news)
    console.log("Loading:", loading)
    console.log("Error:", error)
  }, [slug, news, loading, error])

  if (loading) {
    return <LoadingState />
  }

  if (error || !news) {
    console.error("News not found for slug:", slug)
    return notFound()
  }

  // Get the title and content for the current language with fallback
  const title = language === "ar" ? news.title || news.titleEn || "" : news.titleEn || news.title || ""
  const content = language === "ar" ? news.content || news.contentEn || "" : news.contentEn || news.content || ""
  const summary = language === "ar" ? news.summary || news.summaryEn || "" : news.summaryEn || news.summary || ""

  // Sanitize the HTML content
  const sanitizedContent = DOMPurify.sanitize(content)

  return (
    <MainLayout>
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className={`text-sm text-muted-foreground mb-2 ${isRtl ? "text-right" : "text-left"}`}>
                {new Date(news.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
              </div>
              <h1
                className={`text-3xl md:text-4xl font-bold mb-4 text-foreground ${isRtl ? "text-right" : "text-left"}`}
              >
                {title}
              </h1>
              <div className={`text-muted-foreground mb-6 ${isRtl ? "text-right" : "text-left"}`}>
                <p className="text-lg">{summary}</p>
              </div>
            </div>

            <div className="relative w-full h-[300px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
              <Image src={news.imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
            </div>

            <div className={`prose dark:prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}>
              <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>

            {news.tags && news.tags.length > 0 && (
              <div className={`mt-8 ${isRtl ? "text-right" : "text-left"}`}>
                <h3 className="text-lg font-semibold mb-2">{language === "ar" ? "الوسوم:" : "Tags:"}</h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
