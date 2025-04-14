import { awarenessData } from "@/data/awareness-data"
import { notFound } from "next/navigation"
import Image from "next/image"
import MainLayout from "@/components/layouts/main-layout"
import type { Metadata } from "next"

// Export the route segment config
export const dynamic = "force-dynamic"
export const dynamicParams = true

// Helper function to get awareness item by ID
function getAwarenessById(id: string) {
  const allItems = [...awarenessData.bulletins, ...awarenessData.articles]
  return allItems.find((item) => item.id.toString() === id)
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = getAwarenessById(params.id)

  if (!item) {
    return {
      title: "Item Not Found",
    }
  }

  return {
    title: `${item.title.ar} | ${item.title.en}`,
    description: item.summary.ar,
  }
}

export async function generateStaticParams() {
  const allItems = [...awarenessData.bulletins, ...awarenessData.articles]

  return allItems.map((item) => ({
    id: item.id.toString(),
  }))
}

export default function AwarenessItemPage({ params }: { params: { id: string } }) {
  const item = getAwarenessById(params.id)
  const language = "ar" // Default language

  if (!item) {
    notFound()
  }

  return (
    <MainLayout>
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="text-sm text-muted-foreground mb-2">{item.date}</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{item.title.ar}</h1>
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground/80">{item.title.en}</h2>
              <div className="text-muted-foreground mb-6">
                <p className="text-lg">{item.summary.ar}</p>
                <p className="text-base mt-2">{item.summary.en}</p>
              </div>
            </div>

            <div className="relative w-full h-[300px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title.ar}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: item.content[language] }} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  )
}
