import type { Metadata } from "next"
import { container } from "@/core/di/container"
import SystemsPageClient from "./SystemsPageClient"

export const metadata: Metadata = {
  title: "Systems | Cybersecurity Portal",
  description: "Browse all available cybersecurity systems and tools",
}

export default async function SystemsPage() {
  try {
    const systemsResponse = await container.services.systems.getAllSystems(1, 12)

    return <SystemsPageClient initialSystems={systemsResponse} />
  } catch (error) {
    console.error("❌ Error in SystemsPage:", error)
    return (
      <SystemsPageClient
        initialSystems={{ data: [], pagination: { itemsCount: 0, pagesCount: 0, pageSize: 12, currentPage: 1 } }}
      />
    )
  }
}
