import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import ArticlePageClient from "./ArticlePageClient"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const article = await container.services.articles.getArticleBySlug(params.slug)

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
  const article = await container.services.articles.getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return <ArticlePageClient article={article} />
}
