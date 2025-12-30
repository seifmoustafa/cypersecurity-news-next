import type { Metadata } from "next"
import ArticlesPageClient from "./ArticlesPageClient"

export const metadata: Metadata = {
  title: "Articles | CYS Portal",
  description: "Browse all cybersecurity articles and insights",
}

export default function ArticlesPage() {
  return <ArticlesPageClient />
}
