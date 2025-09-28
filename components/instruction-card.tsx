"use client"

import type { Instruction } from "@/core/domain/models/instruction"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Eye, Download } from "lucide-react"
import Link from "next/link"
import { getLocalizedText } from "@/lib/utils"

interface InstructionCardProps {
  instruction: Instruction
  categoryId: string
  yearNumber: number
}

export function InstructionCard({ instruction, categoryId, yearNumber }: InstructionCardProps) {
  const { language } = useLanguage()

  const title = getLocalizedText(language, instruction.title, instruction.titleEn)
  const summary = getLocalizedText(language, instruction.summary, instruction.summaryEn)

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight line-clamp-2 mb-2">{title}</CardTitle>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {new Date(instruction.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                {language === "ar" ? "تعليمات" : "Instructions"}
              </Badge>
              {instruction.isActive && (
                <Badge variant="default" className="text-xs">
                  {language === "ar" ? "نشط" : "Active"}
                </Badge>
              )}
            </div>
          </div>

          {instruction.imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={instruction.imageUrl || "/placeholder.svg"}
                alt={title}
                className="w-16 h-16 object-cover rounded-md border"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {summary && <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{summary}</p>}

        <div className="flex items-center justify-between gap-2">
          <Link href={`/advanced/instructions/category/${categoryId}/${yearNumber}/${instruction.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full gap-1">
              <Eye className="h-3 w-3" />
              {language === "ar" ? "عرض" : "View"}
            </Button>
          </Link>

          {instruction.documentUrl && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => window.open(instruction.documentUrl || "", "_blank")}
            >
              <Download className="h-3 w-3" />
              {language === "ar" ? "تحميل" : "Download"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
