"use client"

import { useState, useEffect } from "react"
import MainLayout from "@/components/layouts/main-layout"
import { getAllNews } from "@/data/news-data"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { Loading } from "@/components/ui/loading"
import { ROUTES } from "@/lib/routes"

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

export default function NewsPageClient() {
  const { language, isRtl } = useLanguage()
  const [allNews, setAllNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching to avoid hydration issues
    setLoading(true)
    const news = getAllNews()
    setAllNews(news)
    setLoading(false)
  }, [])

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              {language === "ar" ? "أخبار الأمن السيبراني" : "Cybersecurity News"}
            </h1>
          </div>

          {loading ? (
            <Loading fullPage text={language === "ar" ? "جاري التحميل..." : "Loading..."} />
          ) : (
            <Tabs defaultValue="all" className="w-full mb-12">
              <div className="overflow-x-auto pb-2">
                <TabsList className={`w-full max-w-4xl mx-auto mb-8 flex ${isRtl ? "rtl:flex-row-reverse" : ""}`}>
                  <TabsTrigger value="all" className="flex-shrink-0">
                    {language === "ar" ? "الكل" : "All"}
                  </TabsTrigger>
                  {Object.entries(categoryNames).map(([key, value]) => (
                    <TabsTrigger key={key} value={key} className="flex-shrink-0">
                      {value[language]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allNews.map((item) => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      language={language}
                      isRtl={isRtl}
                      categoryNames={categoryNames}
                    />
                  ))}
                </div>
              </TabsContent>

              {Object.keys(categoryNames).map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allNews
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <NewsCard
                          key={item.id}
                          item={item}
                          language={language}
                          isRtl={isRtl}
                          categoryNames={categoryNames}
                        />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

function NewsCard({
  item,
  language,
  isRtl,
  categoryNames,
}: {
  item: any
  language: string
  isRtl: boolean
  categoryNames: any
}) {
  return (
    <Link href={ROUTES.NEWS.DETAIL(item.id)} className="group">
      <div className="bg-card border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title[language]}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
            {new Date(item.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
          </div>
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {categoryNames[item.category as keyof typeof categoryNames][language]}
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
                className={`h-4 w-4 ${isRtl ? "mr-1 rtl:rotate-180" : "ml-1"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
