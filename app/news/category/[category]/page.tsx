import { getNewsByCategory } from "@/data/news-data"
import NewsCategoryClientPage from "./NewsCategoryClientPage"
import type { Metadata } from "next"

// Export the route segment config
export const dynamic = "force-dynamic"
export const dynamicParams = true

const categoryNames = {
  dataBreaches: {
    ar: "تسريبات البيانات",
    en: "Data Breaches",
  },
  cyberAttacks: {
    ar: "الهجمات السيبرانية",
    en: "Cyber Attacks",
  },
  vulnerabilities: {
    ar: "الثغرات الأمنية",
    en: "Vulnerabilities",
  },
  threatIntelligence: {
    ar: "معلومات التهديدات",
    en: "Threat Intelligence",
  },
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = params.category

  if (!categoryNames[category as keyof typeof categoryNames]) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${categoryNames[category as keyof typeof categoryNames].ar} | ${categoryNames[category as keyof typeof categoryNames].en}`,
    description: `Latest news about ${categoryNames[category as keyof typeof categoryNames].en}`,
  }
}

export async function generateStaticParams() {
  return Object.keys(categoryNames).map((category) => ({
    category,
  }))
}

export default async function NewsCategoryPage({ params }: { params: { category: string } }) {
  const category = params.category
  const news = getNewsByCategory(category)

  return <NewsCategoryClientPage params={params} news={news} />
}
