import { getDefinitionsByCategory } from "@/data/definitions-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categoryNames = {
    general: "مصطلحات عامة",
    technical: "مصطلحات تقنية",
    legal: "مصطلحات قانونية",
    threats: "التهديدات والهجمات",
  }

  const categoryName = categoryNames[params.category as keyof typeof categoryNames]

  if (!categoryName) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: categoryName,
    description: `مصطلحات وتعريفات ${categoryName} في مجال الأمن السيبراني`,
  }
}

export async function generateStaticParams() {
  return ["general", "technical", "legal", "threats"].map((category) => ({
    category,
  }))
}

export default function DefinitionCategoryPage({ params }: { params: { category: string } }) {
  const definitions = getDefinitionsByCategory(params.category)

  if (definitions.length === 0) {
    notFound()
  }

  const categoryNames = {
    general: "مصطلحات عامة",
    technical: "مصطلحات تقنية",
    legal: "مصطلحات قانونية",
    threats: "التهديدات والهجمات",
  }

  const categoryName = categoryNames[params.category as keyof typeof categoryNames]

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
            <h1 className="text-3xl font-bold text-center flex-1">{categoryName}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {definitions.map((definition) => (
              <Link href={`/definitions/${definition.id}`} key={definition.id}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{definition.term.ar}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-4">{definition.definition.ar}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
