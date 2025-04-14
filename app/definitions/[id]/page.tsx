import { getDefinitionById, getAllDefinitions } from "@/data/definitions-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

// Export the route segment config
export const dynamic = "force-dynamic"
export const dynamicParams = true

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const definition = getDefinitionById(params.id)

  if (!definition) {
    return {
      title: "Definition Not Found",
    }
  }

  return {
    title: `${definition.term.ar} | ${definition.term.en}`,
    description: definition.definition.ar,
  }
}

export async function generateStaticParams() {
  const allDefinitions = getAllDefinitions()

  return allDefinitions.map((definition) => ({
    id: definition.id,
  }))
}

export default function DefinitionPage({ params }: { params: { id: string } }) {
  const definition = getDefinitionById(params.id)
  const language = "ar" // Assuming a default language, you might want to get this from context or props

  if (!definition) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href="/#standards">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>رجوع</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">{definition.term.ar}</h1>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <h2 className="text-xl font-bold mb-4">{definition.term[language]}</h2>
            <p className="text-lg">{definition.definition[language]}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
