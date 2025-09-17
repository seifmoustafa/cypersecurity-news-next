"use client"

import { useLanguage } from "@/components/language-provider"
import { systemsData } from "@/data/systems-data"
import { Shield, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PersonalProtectToolsPage() {
  const { language } = useLanguage()
  const isRtl = language === "ar"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"/>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{language === "ar" ? "أدوات الحماية" : "Protection Tools"}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemsData.map((tool) => (
            <Link key={tool.id} href={tool.link} target="_blank" className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.02]">
              <div className="relative aspect-video" style={{ backgroundImage: `url(${tool.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">{tool.title[language] || tool.title.en}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{tool.description[language] || tool.description.en}</p>
                <div className="mt-4 inline-flex items-center text-green-600 dark:text-green-400 group-hover:underline">
                  <ExternalLink className="h-4 w-4 mr-2" /> {language === "ar" ? "زيارة" : "Visit"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}




