import { frameworkData } from "@/data/standards-hierarchy-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

// Export the route segment config
export const dynamic = "force-dynamic"
export const dynamicParams = true

export async function generateMetadata({ params }: { params: { domain: string } }): Promise<Metadata> {
  const domain = frameworkData.domains.find((d) => d.id === params.domain)

  if (!domain) {
    return {
      title: "Domain Not Found",
    }
  }

  return {
    title: `${domain.title.ar} | ${domain.title.en}`,
    description: domain.description.ar,
  }
}

export async function generateStaticParams() {
  return frameworkData.domains.map((domain) => ({
    domain: domain.id,
  }))
}

export default function FrameworkDomainPage({ params }: { params: { domain: string } }) {
  const domain = frameworkData.domains.find((d) => d.id === params.domain)
  const language = "ar" // Default language

  if (!domain) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href="/framework">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>رجوع</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">{domain.title.ar}</h1>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-12">
            <h2 className="text-2xl font-bold mb-4">{language === "ar" ? domain.title.ar : domain.title.en}</h2>
            <p className="text-lg">{domain.description[language]}</p>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center">المكونات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domain.components.map((component) => (
              <Card key={component.id} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{component.title.ar}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{component.description.ar}</p>
                  <p>{component.description.en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
