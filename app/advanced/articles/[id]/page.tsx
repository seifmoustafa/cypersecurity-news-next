import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import ArticlePageClient from "./ArticlePageClient"

interface ArticlePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const article = await container.services.articles.getArticleById(params.id)

    if (!article) {
      return {
        title: "Article Not Found | CYS Portal",
        description: "The requested article could not be found",
      }
    }

    return {
      title: `${article.titleEn || article.title} | CYS Portal`,
      description: article.summaryEn || article.summary || "Read this cybersecurity article",
    }
  } catch (error) {
    return {
      title: "Article Not Found | CYS Portal",
      description: "The requested article could not be found",
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    console.log(`🔍 Attempting to fetch article with ID: ${params.id}`)
    const article = await container.services.articles.getArticleById(params.id)

    if (!article) {
      console.log(`❌ No article found for ID: ${params.id}`)
      notFound()
    }

    console.log(`✅ Successfully loaded article: ${article.title || article.titleEn}`)
    return <ArticlePageClient article={article} />
  } catch (error) {
    console.error(`❌ Error in ArticlePage for ID ${params.id}:`, error)
    notFound()
  }
}
