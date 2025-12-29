import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import ArticlePageClient from "./ArticlePageClient"

interface PageProps {
      params: Promise<{
            id: string
      }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
      try {
            const resolvedParams = await params
            const article = await container.services.articles.getArticleById(resolvedParams.id)

            if (!article) {
                  return {
                        title: "Article Not Found | Cybersecurity Portal",
                        description: "The requested article could not be found.",
                  }
            }

            const title = article.titleEn || article.title || ""
            const summary = article.summaryEn || article.summary || ""

            return {
                  title: `${title} | Cybersecurity Portal`,
                  description: summary,
            }
      } catch (error) {
            return {
                  title: "Article | Cybersecurity Portal",
                  description: "Article details",
            }
      }
}

export default async function ArticlePage({ params }: PageProps) {
      try {
            const resolvedParams = await params
            const article = await container.services.articles.getArticleById(resolvedParams.id)

            if (!article) {
                  notFound()
            }

            return <ArticlePageClient article={article} />
      } catch (error) {
            console.error("❌ Error in ArticlePage:", error)
            notFound()
      }
}
