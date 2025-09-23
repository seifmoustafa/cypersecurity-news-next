import type { Metadata } from "next"
import { container } from "@/core/di/container"
import HelperSystemsPageClient from "./HelperSystemsPageClient"

export const metadata: Metadata = {
  title: "Helper Systems | Cybersecurity Portal",
  description: "Browse all available cybersecurity helper systems and tools",
}

export default async function HelperSystemsPage() {
  try {
    // Use the correct method name from the service
    const helperSystemsResponse = await container.services.helperSystems.getHelperSystems(1, 12)

    return <HelperSystemsPageClient initialHelperSystems={helperSystemsResponse} />
  } catch (error) {
    console.error("❌ Error in HelperSystemsPage:", error)
    return (
      <HelperSystemsPageClient
        initialHelperSystems={{ data: [], pagination: { itemsCount: 0, pagesCount: 0, pageSize: 12, currentPage: 1 } }}
      />
    )
  }
}
