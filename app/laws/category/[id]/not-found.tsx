"use client"

import { useLanguage } from "@/components/language-provider"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Scale } from "lucide-react"
import Link from "next/link"

export default function LawCategoryNotFound() {
  const { language, isRtl } = useLanguage()

  return (
    <div className={isRtl ? "rtl" : "ltr"} dir={isRtl ? "rtl" : "ltr"}>
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Scale className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">{language === "ar" ? "الفئة غير موجودة" : "Category Not Found"}</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {language === "ar"
                ? "عذراً، لا يمكن العثور على فئة القوانين المطلوبة."
                : "Sorry, the requested law category could not be found."}
            </p>
            <Link href="/">
              <Button>{language === "ar" ? "العودة للرئيسية" : "Back to Home"}</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    </div>
  )
}
