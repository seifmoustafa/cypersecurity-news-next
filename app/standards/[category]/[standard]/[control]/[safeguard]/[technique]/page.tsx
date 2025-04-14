"use client"
export const dynamicParams = true;
export const dynamic = "force-dynamic";

import {
  userAccessManagementTechniques,
  privilegedAccessImplementation,
} from "@/data/standards-hierarchy-data";
import { notFound } from "next/navigation";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export default function TechniquePage({
  params,
}: {
  params: {
    category: string;
    standard: string;
    control: string;
    safeguard: string;
    technique: string;
  };
}) {
  const { language, isRtl } = useLanguage();
  const technique = userAccessManagementTechniques.find((t) => t.id === params.technique);

  if (!technique) {
    notFound();
  }

  const implementations =
    params.technique === "a9-2-3" ? privilegedAccessImplementation : [];

  return (
    <MainLayout>
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="mb-8 flex items-center">
          <Link
            href={`/standards/${params.category}/${params.standard}/${params.control}/${params.safeguard}`}
          >
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>{language === "ar" ? "رجوع" : "Back"}</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono mr-2">
              {technique.code}
            </span>
            {technique.title[language]}
          </h1>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-12">
          <h2 className="text-2xl font-bold mb-4">{technique.title[language]}</h2>
          <p className="text-lg">{technique.description[language]}</p>
        </div>

        {implementations.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {implementations.map((imp) => (
                <Link
                  key={imp.id}
                  href={`/standards/${params.category}/${params.standard}/${params.control}/${params.safeguard}/${params.technique}/${imp.id}`}
                >
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono">
                          {imp.code}
                        </span>
                        <span>{imp.title[language]}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {imp.description[language]}
                      </p>
                      <div className="space-y-2">
                        {imp.steps.slice(0, 2).map((step, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{step[language]}</p>
                          </div>
                        ))}
                        {imp.steps.length > 2 && (
                          <p className="text-primary text-sm">
                            +{imp.steps.length - 2}{" "}
                            {language === "ar" ? "خطوات أخرى" : "more steps"}
                          </p>
                        )}
                      </div>
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
