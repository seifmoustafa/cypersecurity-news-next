"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { ArrowLeft, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Regulation } from "@/core/domain/models/regulation"

interface RegulationPageClientProps {
  regulation: Regulation
}

export default function RegulationPageClient({ regulation }: RegulationPageClientProps) {
  const { language, t } = useLanguage()

  if (!regulation) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-muted-foreground">Regulation not found</p>
        <Link href="/#regulation" className="mt-4 inline-block">
          <Button variant="default">Return to Regulations</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/#regulation">
          <Button variant="ghost" className="group flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t("common.back")}
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-4">
            {regulation.title[language]}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">{regulation.shortDescription[language]}</p>
        </div>

        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
          <Image
            src={regulation.imageUrl || "/placeholder.svg?height=400&width=800"}
            alt={regulation.title[language]}
            fill
            className="object-cover"
          />
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: regulation.fullDescription[language] }} />
        </div>

        {regulation.documentUrl && (
          <div className="flex justify-end">
            <Button
              onClick={() => window.open(regulation.documentUrl, "_blank")}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("common.download")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
