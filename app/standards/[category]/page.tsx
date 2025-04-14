"use client"
export const dynamicParams = true;
export const dynamic = "force-dynamic";

import { standardsData } from "@/data/standards-data";
import { internationalStandardsData } from "@/data/standards-hierarchy-data";
import { notFound } from "next/navigation";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export default function StandardsCategoryPage({ params }: { params: { category: string } }) {
  const { language, isRtl } = useLanguage();
  const categoryKey = params.category as keyof typeof standardsData;
  const categoryData = standardsData[categoryKey];

  if (!categoryData) {
    notFound();
  }

  const standards = categoryKey === "international" ? internationalStandardsData : [];
  const categoryTitle = {
    international: language === "ar" ? "المعايير الدولية" : "International Standards",
    local: language === "ar" ? "المعايير المحلية" : "Local Standards",
    internal: language === "ar" ? "المعايير الداخلية" : "Internal Standards",
  }[categoryKey];

  return (
    <MainLayout>
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="mb-8 flex items-center">
          <Link href="/#standards">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>{language === "ar" ? "رجوع" : "Back"}</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">{categoryTitle}</h1>
        </div>

        <div className={`prose dark:prose-invert max-w-none mb-8 ${isRtl ? "text-right" : "text-left"}`}>
          <p>{categoryData.description.replace(/<[^>]*>?/gm, "")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(categoryKey === "international" ? standards : categoryData.items).map((item: any, index: number) => (
            <Link
              key={item.id || index}
              href={
                categoryKey === "international"
                  ? `/standards/${categoryKey}/${item.id}`
                  : `/standards/${categoryKey}`
              }
            >
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                {item.imageUrl && (
                  <div className="relative h-48">
                    <Image
                      src={item.imageUrl}
                      alt={item.title?.[language] || item.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                    {item.title?.[language] || item.name}
                  </CardTitle>
                  {item.organization && (
                    <p className={`text-sm text-muted-foreground ${isRtl ? "text-right" : "text-left"}`}>
                      {item.organization[language]}
                    </p>
                  )}
                </CardHeader>
                <CardContent className={isRtl ? "text-right" : "text-left"}>
                  <p className="text-muted-foreground line-clamp-3">
                    {item.description?.[language] || item.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
