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
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"/>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{language === "ar" ? "أدوات الحماية" : "Protection Tools"}</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {language === "ar" 
              ? "اكتشف أفضل الأدوات والتطبيقات لحماية نفسك وأجهزتك من التهديدات السيبرانية"
              : "Discover the best tools and applications to protect yourself and your devices from cyber threats"
            }
          </p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === "ar" ? "إجمالي الأدوات" : "Total Tools"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {systemsData.length} {language === "ar" ? "أداة" : "tools"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === "ar" ? "محدث آخر مرة" : "Last updated"}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {systemsData.map((tool, index) => (
            <Link 
              key={tool.id} 
              href={tool.link} 
              target="_blank" 
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden"
                onMouseMove={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  const rect = el.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  const rotateX = ((y - rect.height / 2) / rect.height) * -3
                  const rotateY = ((x - rect.width / 2) / rect.width) * 3
                  el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)"
                }}
                style={{ transform: "perspective(900px)" }}
              >
                {/* Tool Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-indigo-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                    {language === "ar" ? "أداة" : "Tool"}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {language === "ar" ? "خارجي" : "External"}
                  </div>
                </div>

                {/* Tool Content */}
                <div className="p-8">
                  {/* Tool Header */}
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
                        {tool.title[language] || tool.title.en}
                      </h3>
                    </div>
                  </div>

                  {/* Tool Description */}
                  <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-4">
                    {tool.description[language] || tool.description.en}
                  </div>

                  {/* Tool Footer */}
                  <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-purple-400">
                    <ExternalLink className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    <span className="mr-2 rtl:mr-0 rtl:ml-2">
                      {language === "ar" ? "زيارة الأداة" : "Visit Tool"}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                    ) : (
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {language === "ar" ? "هل تحتاج مساعدة في اختيار الأداة المناسبة؟" : "Need help choosing the right tool?"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {language === "ar" 
                ? "تواصل معنا للحصول على توصيات شخصية لأدوات الحماية المناسبة لاحتياجاتك"
                : "Contact us for personalized recommendations for protection tools that suit your needs"
              }
            </p>
            <button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              {language === "ar" ? "تواصل معنا" : "Contact Us"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}




