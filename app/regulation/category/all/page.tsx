import type { Metadata } from "next"
import AllRegulationsPageClient from "./AllRegulationsPageClient"
import MainLayout from "@/components/layouts/main-layout"

export const metadata: Metadata = {
  title: "All Regulations | Cybersecurity Center",
  description: "Browse all cybersecurity regulations.",
}

export default function AllRegulationsPage() {
  return (
    <MainLayout>
      <AllRegulationsPageClient />
    </MainLayout>
  )
}
