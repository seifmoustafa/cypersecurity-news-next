"use client"
export const dynamicParams = true;
export const dynamic = "force-dynamic";

import { internationalStandardsData, iso27001Controls } from "@/data/standards-hierarchy-data";
import { notFound } from "next/navigation";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export default function StandardPage({ params }: { params: { category: string; standard: string } }) {
  const { language, isRtl } = useLanguage();
  const standard = internationalStandardsData.find((s) => s.id === params.standard);

  if (!standard) {
    notFound();
  }

  const controls = params.standard === "iso-27001" ? iso27001Controls : [];

  return (
    <MainLayout>
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="mb-8 flex items-center">
          <Link href={`/standards/${params.category}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>{language === "ar" ? "رجوع" : "Back"}</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">{standard.title[language]}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1 relative h-64 md:h-full rounded-lg overflow-hidden">
            <Image
              src={standard.imageUrl || "/placeholder.svg"}
              alt={standard.title[language]}
              fill
              className="object-cover"
            />
          </div>
          <div className="md:col-span-2">
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-lg">{standard.description[language]}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  {language === "ar" ? "المنظمة" : "Organization"}
                </h3>
                <p>{standard.organization[language]}</p>
              </div>
              <div>
                <h3 className="font-semibold text-muted-foreground">{language === "ar" ? "السنة" : "Year"}</h3>
                <p>{standard.year}</p>
              </div>
            </div>
            {standard.documentUrl && (
              <Button className="mt-4" onClick={() => window.open(standard.documentUrl, "_blank")}>
                {language === "ar" ? "تحميل الوثيقة" : "Download Document"}
              </Button>
            )}
          </div>
        </div>

        {controls.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {language === "ar" ? "الضوابط الأمنية" : "Security Controls"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {controls.map((control) => (
                <Link
                  key={control.id}
                  href={`/standards/${params.category}/${params.standard}/${control.id}`}
                >
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono">
                          {control.code}
                        </span>
                        <span>{control.title[language]}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{control.description[language]}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
