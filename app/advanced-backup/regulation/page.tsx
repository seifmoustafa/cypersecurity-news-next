import type { Metadata } from "next"
import MainLayout from "@/components/layouts/main-layout"
import RegulationCategoriesPageClient from "./RegulationCategoriesPageClient"

export const metadata: Metadata = {
  title: "Regulation Categories | Cybersecurity Center",
  description: "Browse cybersecurity regulations by category.",
}

export default function RegulationPage() {
  return (
    <MainLayout>
      <RegulationCategoriesPageClient />
    </MainLayout>
  )
}
