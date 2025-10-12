import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import NewsDetailPageClient from "./NewsDetailPageClient"
import MainLayout from "@/components/layouts/main-layout"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const news = await container.services.news.getNewsById(params.id)

    if (!news) {
      return {
        title: "News Article Not Found | Cybersecurity Portal",
        description: "The requested news article could not be found.",
      }
    }

    const title = news.titleEn || news.title || ""
    const summary = news.summaryEn || news.summary || ""

    return {
      title: `${title} | Cybersecurity Portal`,
      description: summary,
    }
  } catch (error) {
    return {
      title: "News Article Not Found | Cybersecurity Portal",
      description: "The requested news article could not be found.",
    }
  }
}

export default async function NewsDetailPage({ params }: PageProps) {
  try {
    const news = await container.services.news.getNewsById(params.id)

    if (!news) {
      notFound()
    }

    return (
      <MainLayout>
        <NewsDetailPageClient news={news} />
      </MainLayout>
    )
  } catch (error) {
    console.error("❌ Error in NewsDetailPage:", error)
    notFound()
  }
}