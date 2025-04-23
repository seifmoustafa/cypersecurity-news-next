"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Button } from "@/components/ui/button"
import { Shield, Lock, ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SecurityProceduresSection() {
  const { language, t } = useLanguage()
  const router = useRouter()

  // Prefetch the internal standards page
  useEffect(() => {
    router.prefetch("/standards/internal")
  }, [router])

  return (
    <SectionContainer id="security-procedures" className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <SectionHeader
        title={t("section.securityProcedures")}
        subtitle={t("securityProcedures.subtitle")}
        className="text-white"
      />

      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden rounded-xl">
        {/* Hero background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-10"></div>

        {/* Hero content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            {/* Cybersecurity icon group */}
            <div className="flex justify-center mb-6 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-blue-500/20 p-3 rounded-full backdrop-blur-sm"
              >
                <Shield className="h-8 w-8 text-blue-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-cyan-500/20 p-3 rounded-full backdrop-blur-sm"
              >
                <Lock className="h-8 w-8 text-cyan-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-blue-500/20 p-3 rounded-full backdrop-blur-sm"
              >
                <ShieldAlert className="h-8 w-8 text-blue-400" />
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
              {language === "ar" ? "المعايير الداخلية" : "Internal Standards"}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow leading-relaxed">
              {language === "ar"
                ? "مجموعة شاملة من المعايير الداخلية لتعزيز الأمن السيبراني وحماية البنية التحتية الحيوية"
                : "A comprehensive set of internal standards to enhance cybersecurity and protect critical infrastructure"}
            </p>

            <div className="mt-8">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => router.push("/standards/internal")}
              >
                {language === "ar" ? "استكشف المزيد" : "Explore More"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionContainer>
  )
}
