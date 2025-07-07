"use client"
import { useLanguage } from "@/components/language-provider"

export default function LoadingScreen() {
  const { t } = useLanguage()
  return (
    <div className="flex items-center justify-center min-h-screen">
      {t("common.loading")}
    </div>
  )
}
