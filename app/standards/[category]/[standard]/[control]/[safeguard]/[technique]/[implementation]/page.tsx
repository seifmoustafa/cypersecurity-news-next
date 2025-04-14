"use client"
export const dynamicParams = true;
export const dynamic = "force-dynamic";

import {
  privilegedAccessImplementation,
  privilegedAccountSeparationDetails,
} from "@/data/standards-hierarchy-data";
import { notFound } from "next/navigation";
import MainLayout from "@/components/layouts/main-layout";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export default function ImplementationPage({
  params,
}: {
  params: {
    category: string;
    standard: string;
    control: string;
    safeguard: string;
    technique: string;
    implementation: string;
  };
}) {
  const { language, isRtl } = useLanguage();

  const implementation = privilegedAccessImplementation.find(
    (i) => i.id === params.implementation
  );

  if (!implementation) {
    notFound();
  }

  const details =
    params.implementation === "a9-2-3-3"
      ? privilegedAccountSeparationDetails
      : null;

  return (
    <MainLayout>
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="mb-8 flex items-center">
          <Link
            href={`/standards/${params.category}/${params.standard}/${params.control}/${params.safeguard}/${params.technique}`}
          >
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>{language === "ar" ? "رجوع" : "Back"}</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono mr-2">
              {implementation.code}
            </span>
            {implementation.title[language]}
          </h1>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {implementation.title[language]}
          </h2>
          <p className="text-lg">{implementation.description[language]}</p>

          <h3 className="text-xl font-bold mb-4">
            {language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}
          </h3>
          <ol className="space-y-4">
            {implementation.steps.map((step: any, index: number) => (
              <li key={index} className="flex flex-col gap-1">
                <p className="font-medium">{step[language]}</p>
              </li>
            ))}
          </ol>
        </div>

        {details && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {language === "ar" ? "تفاصيل التنفيذ" : "Implementation Details"}
            </h2>
            <div className="bg-muted/50 rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-4">{details.title[language]}</h3>
              <p className="text-muted-foreground mb-6">{details.description[language]}</p>

              <div className="prose dark:prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: details.content[language] }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
