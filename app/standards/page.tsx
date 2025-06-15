import type { Metadata } from "next"
import { container } from "@/core/di/container"
import StandardsPageClient from "./StandardsPageClient"

export const metadata: Metadata = {
  title: "Cybersecurity Standards | Cybersecurity Portal",
  description: "Browse cybersecurity standards by category including international, national, and internal standards.",
  keywords: "cybersecurity standards, ISO 27001, NIST, security frameworks, compliance standards",
}

export default async function StandardsPage() {
  try {
    // Get all standard categories
    const categoriesResponse = await container.services.standards.getAllStandardCategories(1, 100)

    return <StandardsPageClient categories={categoriesResponse.data} />
  } catch (error) {
    console.error("❌ Error in StandardsPage:", error)
    return <StandardsPageClient categories={[]} />
  }
}
