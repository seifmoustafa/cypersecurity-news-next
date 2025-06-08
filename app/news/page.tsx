"use client";

import MainLayout from "@/components/layouts/main-layout";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/language-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { useNews, useNewsCategories, useNewsByCategory } from "@/core/hooks/use-news";

export default function NewsPage() {
  const { language, isRtl } = useLanguage();
  const router = useRouter();
  const { news: allNews, loading: loadingAll } = useNews();
  const { categories, loading: loadingCats } = useNewsCategories();

  // Prefetch category tabs
  useEffect(() => {
    categories.forEach((cat) => {
      router.prefetch(`/news/category/${cat.id}`);
    });
  }, [categories, router]);

  if (loadingAll || loadingCats) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 flex justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              {language === "ar" ? "أخبار الأمن السيبراني" : "Cybersecurity News"}
            </h1>
            <h2 className="text-xl text-foreground/80">
              {language === "ar" ? "أخبار الأمن السيبراني" : "Cybersecurity News"}
            </h2>
          </header>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full mb-12">
            <TabsList
              className={`w-full max-w-4xl mx-auto mb-8 flex flex-wrap justify-center ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              <TabsTrigger value="all" className="flex-grow">
                {language === "ar" ? "الكل" : "All"}
              </TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="flex-grow">
                  {language === "ar" ? cat.nameAr : cat.nameEn}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All News */}
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allNews.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>

            {/* Per-category */}
            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <CategoryNewsList categoryId={cat.id} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}

function CategoryNewsList({ categoryId }: { categoryId: string }) {
  const { news, loading } = useNewsByCategory(categoryId);
  if (loading) return <div className="animate-pulse">Loading...</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}

type NewsItem = {
  id: string;
  title: string;
  titleEn: string | null;
  summary: string | null;
  summaryEn: string | null;
  date: string;
  imageUrl?: string | null;
  categoryId: string;
};

function NewsCard({ item }: { item: NewsItem }) {
  const { language, isRtl } = useLanguage();

  // pick localized title & summary
  const newsTitle =
    language === "ar" ? item.title : item.titleEn || item.title;
  const newsSummary =
    language === "ar" ? item.summary || "" : item.summaryEn || "";

  // slugify the title
  const slug = slugify(newsTitle);

  return (
    <Link href={`/news/${slug}`} className="group">
      <div className="bg-card border rounded-lg overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.imageUrl ?? "/placeholder.svg"}
            alt={newsTitle}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className={`absolute top-2 ${
              isRtl ? "right-2" : "left-2"
            } bg-primary text-white text-xs px-2 py-1 rounded`}
          >
            {new Date(item.date).toLocaleDateString(
              language === "ar" ? "ar-SA" : "en-US"
            )}
          </div>
        </div>

        <div
          className={`p-4 flex-1 flex flex-col ${
            isRtl ? "text-right" : "text-left"
          }`}
        >
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {newsTitle}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {newsSummary}
          </p>
          <div className="mt-auto inline-flex items-center text-primary font-medium">
            {language === "ar" ? "اقرأ المزيد" : "Read More"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${
                isRtl ? "mr-1 rotate-180" : "ml-1"
              }`}
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
          </div>
        </div>
      </div>
    </Link>
  );
}
