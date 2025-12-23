"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  FileText,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { container } from "@/core/di/container";

interface ProcedurePageClientProps {
  procedure: {
    id: string;
    name: string;
    nameAr: string;
    nameEn: string;
    description: string;
    descriptionAr: string;
    descriptionEn: string;
    createdAt: string;
    isActive: boolean;
  };
}

export default function ProcedurePageClient({
  procedure,
}: ProcedurePageClientProps) {
  const { language, isRtl } = useLanguage();
  const [controls, setControls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const controlsData =
          await container.services.procedures.getControlsByProcedureId(
            procedure.id,
            1,
            100
          );
        setControls(controlsData.data);
      } catch (error) {
        console.error("Error fetching controls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchControls();
  }, [procedure.id]);

  const title =
    language === "ar"
      ? procedure.nameAr || procedure.nameEn
      : procedure.nameEn || procedure.nameAr;
  const description =
    language === "ar"
      ? procedure.descriptionAr || procedure.descriptionEn
      : procedure.descriptionEn || procedure.descriptionAr;

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/advanced/procedures">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>
                    {language === "ar"
                      ? "رجوع إلى الإجراءات"
                      : "Back to Procedures"}
                  </span>
                </Button>
              </Link>
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1
                      className={`text-4xl font-bold mb-4 ${
                        isRtl ? "text-right" : "text-left"
                      }`}
                    >
                      {title}
                    </h1>
                    {description && (
                      <p
                        className={`whitespace-per-line text-xl text-muted-foreground leading-relaxed ${
                          isRtl ? "text-right" : "text-left"
                        }`}
                      >
                        {description
                          .replace(/<\/?[^>]+(>|$)/g, "")
                          .replace(/<br\s*\/?>/gi, "\n")
                          .replace(/<\/p>/gi, "\n")
                          .trim()}
                      </p>
                    )}
                    {/* <div className="flex items-center gap-4 mt-6">
                      <Badge variant="outline" className="gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(procedure.createdAt).toLocaleDateString("en-US")}
                      </Badge>
                      <Badge variant={procedure.isActive ? "default" : "secondary"}>
                        {procedure.isActive ? (language === "ar" ? "نشط" : "Active") : (language === "ar" ? "غير نشط" : "Inactive")}
                      </Badge>
                    </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {language === "ar" ? "عناصر التحكم" : "Controls"}
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-300 rounded-lg h-32 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : controls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {controls.map((control) => (
                  <Link
                    key={control.id}
                    href={`/advanced/procedures/${procedure.id}/${control.id}`}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {control.code || "N/A"}
                          </Badge>
                        </div>
                        <h3 className="font-bold mb-2 line-clamp-2">
                          {language === "ar"
                            ? control.nameAr || control.nameEn
                            : control.nameEn || control.nameAr}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {language === "ar"
                            ? control.descriptionAr
                                .replace(/<\/?[^>]+(>|$)/g, "")
                                .replace(/<br\s*\/?>/gi, "\n")
                                .replace(/<\/p>/gi, "\n") ||
                              control.descriptionEn
                                .replace(/<\/?[^>]+(>|$)/g, "")
                                .replace(/<br\s*\/?>/gi, "\n")
                                .replace(/<\/p>/gi, "\n")
                            : control.descriptionEn
                                .replace(/<\/?[^>]+(>|$)/g, "")
                                .replace(/<br\s*\/?>/gi, "\n")
                                .replace(/<\/p>/gi, "\n") ||
                              control.descriptionAr
                                .replace(/<\/?[^>]+(>|$)/g, "")
                                .replace(/<br\s*\/?>/gi, "\n")
                                .replace(/<\/p>/gi, "\n")}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {language === "ar"
                    ? "لا توجد عناصر تحكم متاحة"
                    : "No controls available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
