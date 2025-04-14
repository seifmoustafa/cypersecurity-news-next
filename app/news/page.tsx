import type { Metadata } from "next"
import NewsPageClient from "./NewsPageClient"

export const metadata: Metadata = {
  title: "أخبار الأمن السيبراني | Cybersecurity News",
  description: "أحدث الأخبار والتحديثات حول الأمن السيبراني والتهديدات الإلكترونية",
}

export default function NewsPage() {
  return <NewsPageClient />
}
