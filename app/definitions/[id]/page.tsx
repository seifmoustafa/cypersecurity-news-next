"use client"

import { getDefinitionById } from "@/data/definitions-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Suspense } from "react"

export default function DefinitionPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DefinitionContent />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse">Loading...</div>
      </div>
    </MainLayout>
  )
}

function DefinitionContent() {
  const params = useParams()
  const id = params.id as string
  const { language, isRtl } = useLanguage()
  const [definition, setDefinition] = useState<any>(null)

  useEffect(() => {
    const definitionItem = getDefinitionById(id)
    if (!definitionItem) {
      notFound()
    }
    setDefinition(definitionItem)
  }, [id])

  if (!definition) {
    return <LoadingState />
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href="/#standards">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">{definition.term[language]}</h1>
          </div>

          <div className={`prose dark:prose-invert max-w-none mb-8 ${isRtl ? "text-right" : "text-left"}`}>
            <p className="text-lg">{definition.definition[language]}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
