"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { FileText, Home, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ArticleNotFound() {
  const { language, isRtl } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className={`text-center max-w-md mx-auto px-4 ${isRtl ? "text-right" : "text-left"}`}>
        <div className="mb-8">
          <FileText className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {language === "ar" ? "المقال غير موجود" : "Article Not Found"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {language === "ar"
              ? "عذراً، لا يمكن العثور على المقال المطلوب. قد يكون قد تم حذفه أو نقله."
              : "Sorry, the article you&apos;re looking for doesn&apos;t exist. It may have been deleted or moved."}
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/articles" className="block">
            <Button className={`w-full ${isRtl ? "flex-row-reverse" : ""}`}>
              {isRtl ? <ArrowRight className="h-4 w-4 mr-2" /> : <ArrowLeft className="h-4 w-4 mr-2" />}
              {language === "ar" ? "رجوع إلى المقالات" : "Back to Articles"}
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className={`w-full ${isRtl ? "flex-row-reverse" : ""}`}>
              <Home className="h-4 w-4 mr-2" />
              {language === "ar" ? "الصفحة الرئيسية" : "Go Home"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
