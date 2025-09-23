"use client"

import { useLanguage } from "@/components/language-provider"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function LectureNotFound() {
  const { language, isRtl } = useLanguage()

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            {language === "ar" ? "المحاضرة غير موجودة" : "Lecture Not Found"}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {language === "ar"
              ? "عذراً، لا يمكن العثور على المحاضرة المطلوبة."
              : "Sorry, the requested lecture could not be found."}
          </p>
          <Link href="/advanced/lectures">
            <Button>{language === "ar" ? "العودة للمحاضرات" : "Back to Lectures"}</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
