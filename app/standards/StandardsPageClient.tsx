"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Home,
  Building,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import type { StandardCategory } from "@/core/domain/models/standard";

interface StandardsPageClientProps {
  categories: StandardCategory[];
}

export default function StandardsPageClient({
  categories,
}: StandardsPageClientProps) {
  const { language, isRtl, t } = useLanguage();

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes("international"))
      return <Globe className="h-8 w-8 text-primary" />;
    if (name.includes("national") || name.includes("local"))
      return <Home className="h-8 w-8 text-primary" />;
    if (name.includes("internal"))
      return <Building className="h-8 w-8 text-primary" />;
    return <Globe className="h-8 w-8 text-primary" />;
  };

  return (
    <div className={isRtl ? "rtl" : "ltr"} dir={isRtl ? "rtl" : "ltr"}>
      <MainLayout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Link href="/#standards">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
              >
                {isRtl ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
                <span>
                  {language === "ar" ? "رجوع إلى الرئيسية" : "Back to Home"}
                </span>
              </Button>
            </Link>
            {/* Page Header */}
            <div className="mb-12">
              <div
                className={`text-center mb-8 ${
                  isRtl ? "text-right" : "text-left"
                }`}
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent mb-4">
                  {t("standards.title")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t("standards.subtitle")}
                </p>
              </div>
            </div>

            {/* Categories Grid */}
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => {
                  const categorySlug = slugify(category.nameEn, category.id);

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/standards/${categorySlug}`}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                          <CardHeader className="text-center pb-4">
                            <div className="flex justify-center mb-4">
                              <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                {getCategoryIcon(category.nameEn)}
                              </div>
                            </div>
                            <CardTitle
                              className={`text-xl ${
                                isRtl ? "text-right" : "text-left"
                              }`}
                            >
                              {language === "ar"
                                ? category.nameAr
                                : category.nameEn}
                            </CardTitle>
                          </CardHeader>
                          <CardContent
                            className={`text-center ${
                              isRtl ? "text-right" : "text-left"
                            }`}
                          >
                            <p className="text-muted-foreground mb-6 line-clamp-3">
                              {language === "ar"
                                ? category.descriptionAr
                                : category.descriptionEn}
                            </p>
                            <Button
                              variant="outline"
                              className={`w-full gap-2 ${
                                isRtl ? "flex-row-reverse" : ""
                              }`}
                            >
                              <span>{t("standards.explore")}</span>
                              {isRtl ? (
                                <ArrowLeft className="h-4 w-4" />
                              ) : (
                                <ArrowRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">
                  {t("standards.noCategoriesTitle")}
                </h3>
                <p className="text-muted-foreground">
                  {t("standards.noCategoriesDescription")}
                </p>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
