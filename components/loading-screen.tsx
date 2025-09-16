"use client"
import { useLanguage } from "@/components/language-provider"
import { Shield, Lock, ShieldAlert, Database, Server, Cloud } from "lucide-react"

export default function LoadingScreen() {
  const { t, language } = useLanguage()
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-slate-900 dark:to-cyan-950">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.3),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.02)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>
      
      <div className="relative z-10 text-center">
        {/* Enhanced Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl shadow-2xl shadow-blue-500/30">
              <Shield className="h-12 w-12 text-white animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Enhanced Title */}
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-400 bg-clip-text text-transparent">
          {language === "ar" ? "بوابة الأمن السيبراني" : "Cybersecurity Portal"}
        </h1>
        
        {/* Enhanced Loading Animation */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Enhanced Loading Text */}
        <p className="text-lg text-muted-foreground font-medium mb-8">
          {t("common.loading")}
        </p>
        
        {/* Cybersecurity Icons Animation */}
        <div className="flex justify-center items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 dark:bg-blue-500/10 rounded-xl flex items-center justify-center animate-pulse">
            <Lock className="h-6 w-6 text-blue-500" />
          </div>
          <div className="w-12 h-12 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-xl flex items-center justify-center animate-pulse" style={{ animationDelay: '0.2s' }}>
            <ShieldAlert className="h-6 w-6 text-cyan-500" />
          </div>
          <div className="w-12 h-12 bg-blue-500/20 dark:bg-blue-500/10 rounded-xl flex items-center justify-center animate-pulse" style={{ animationDelay: '0.4s' }}>
            <Database className="h-6 w-6 text-blue-500" />
          </div>
          <div className="w-12 h-12 bg-purple-500/20 dark:bg-purple-500/10 rounded-xl flex items-center justify-center animate-pulse" style={{ animationDelay: '0.6s' }}>
            <Server className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
