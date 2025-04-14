import { getNewsById, getAllNews } from "@/data/news-data"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import NewsDetailClientPage from "./NewsDetailClientPage"

// Export the route segment config
export const dynamic = "force-dynamic"
export const dynamicParams = true

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const newsItem = getNewsById(params.id)

  if (!newsItem) {
    return {
      title: "News Not Found",
    }
  }

  return {
    title: `${newsItem.title.ar} | ${newsItem.title.en}`,
    description: newsItem.summary.ar,
  }
}

export async function generateStaticParams() {
  const allNews = getAllNews()
  return allNews.map((item) => ({
    id: item.id,
  }))
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const newsItem = getNewsById(params.id)

  if (!newsItem) {
    notFound()
  }

  return <NewsDetailClientPage newsItem={newsItem} />
}
