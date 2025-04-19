"use client"

import { getNewsByCategory } from "@/data/news-data"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Suspense } from "react"

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

export default function NewsCategoryPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <NewsCategoryContent />
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

function NewsCategoryContent() {
  const params = useParams()
  const category = params.category as string
  const { language, isRtl } = useLanguage()
  const [news, setNews] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!categoryNames[category as keyof typeof categoryNames]) {
      notFound()
    }

    setNews(getNewsByCategory(category))

    // Prefetch news item pages
    getNewsByCategory(category).forEach((item) => {
      router.prefetch(`/news/${item.id}`)
    })
  }, [category, router])

  if (!categoryNames[category as keyof typeof categoryNames]) {
    return <LoadingState />
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              {categoryNames[category as keyof typeof categoryNames][language]}
            </h1>
            <h2 className="text-xl text-foreground/80">
              {language === "ar"
                ? categoryNames[category as keyof typeof categoryNames].en
                : categoryNames[category as keyof typeof categoryNames].ar}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <Link href={`/news/${item.id}`} key={item.id} className="group">
                <div className="bg-card border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title[language]}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} bg-primary text-white text-xs px-2 py-1 rounded`}
                    >
                      {new Date(item.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                    </div>
                  </div>

                  <div className={`p-4 flex-1 flex flex-col ${isRtl ? "text-right" : "text-left"}`}>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      {item.title[language]}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.summary[language]}</p>
                    <div className="mt-auto">
                      <span className="text-primary font-medium inline-flex items-center">
                        {language === "ar" ? "اقرأ المزيد" : "Read More"}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${isRtl ? "mr-1 rotate-180" : "ml-1"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
