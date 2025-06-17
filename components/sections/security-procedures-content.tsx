"use client"

import type React from "react"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Shield, Lock, ShieldCheck, Database, Server, Key } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SecurityProceduresContent() {
  const { language } = useLanguage()
  const router = useRouter()

  // Prefetch the internal standards page
  useEffect(() => {
    router.prefetch("/standards/internal")
  }, [router])

  return (
    <div className="w-full">
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden rounded-xl mb-8">
        {/* Hero background with cybersecurity elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 via-indigo-900/90 to-gray-900/95 z-0">
          {/* Animated cybersecurity elements */}
          <div className="absolute inset-0 overflow-hidden">
            <SecurityBackgroundAnimation />
          </div>
        </div>

        {/* Content overlay */}
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
                <ShieldCheck className="h-8 w-8 text-blue-400" />
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
              {language === "ar" ? "إجراءات الأمن السيبراني" : "Cybersecurity Procedures"}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow leading-relaxed">
              {language === "ar"
                ? "إجراءات وخطوات متكاملة لتعزيز الأمن السيبراني وحماية البنية التحتية الرقمية من التهديدات السيبرانية المتطورة"
                : "Comprehensive procedures and steps to enhance cybersecurity and protect digital infrastructure from advanced cyber threats"}
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

      {/* Additional content about security procedures */}
    
    </div>
  )
}

function SecurityProcedureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="text-blue-600 dark:text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  )
}

function SecurityBackgroundAnimation() {
  return (
    <>
      {/* Animated binary code background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-blue-300 text-opacity-50 whitespace-nowrap text-sm md:text-base"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `translateX(-50%)`,
                animation: `floatText ${5 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {generateRandomBinary(20 + Math.floor(Math.random() * 30))}
            </div>
          ))}
        </div>
      </div>

      {/* Security icons floating around */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`icon-${i}`}
            className="absolute text-blue-400 text-opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {getRandomSecurityIcon()}
          </div>
        ))}
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {Array.from({ length: 10 }).map((_, i) => {
          const x1 = Math.random() * 100
          const y1 = Math.random() * 100
          const x2 = Math.random() * 100
          const y2 = Math.random() * 100

          return (
            <line
              key={`line-${i}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="5,5"
              style={{
                animation: `pulseLine ${3 + Math.random() * 5}s ease-in-out infinite`,
              }}
            />
          )
        })}
      </svg>

      <style jsx global>{`
        @keyframes floatText {
          0% {
            transform: translateX(-50%) translateY(0);
          }
          100% {
            transform: translateX(-50%) translateY(-100vh);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(50px, 50px);
          }
          50% {
            transform: translate(0, 100px);
          }
          75% {
            transform: translate(-50px, 50px);
          }
        }
        
        @keyframes pulseLine {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  )
}

// Helper function to generate random binary string
function generateRandomBinary(length: number) {
  return Array.from({ length }, () => Math.round(Math.random())).join("")
}

// Helper function to get a random security icon
function getRandomSecurityIcon() {
  const icons = [
    <Lock key="lock" size={16} />,
    <Shield key="shield" size={16} />,
    <ShieldCheck key="shield-check" size={16} />,
    <Database key="database" size={16} />,
    <Server key="server" size={16} />,
    <Key key="key" size={16} />,
  ]

  return icons[Math.floor(Math.random() * icons.length)]
}
