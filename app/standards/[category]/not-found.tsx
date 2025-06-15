"use client"

import { useLanguage } from "@/components/language-provider"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function StandardCategoryNotFound() {
  const { language, isRtl } = useLanguage()

  return (
    <div className={isRtl ? "rtl" : "ltr"} dir={isRtl ? "rtl" : "ltr"}>
      <MainLayout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <AlertTriangle className="h-12 w-12 text-yellow-500" />
                  </div>
                  <CardTitle className="text-xl">
                    {language === "ar" ? "الفئة غير موجودة" : "Category Not Found"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    {language === "ar"
                      ? "عذراً، لا يمكن العثور على فئة المعايير المطلوبة"
                      : "Sorry, the requested standards category could not be found"}
                  </p>
                  <Link href="/standards">
                    <Button className={`gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                      {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                      <span>{language === "ar" ? "العودة إلى المعايير" : "Back to Standards"}</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  )
}
