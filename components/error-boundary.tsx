"use client"
import { Component, type ReactNode } from "react"
import { LanguageContext } from "@/components/language-provider"

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  static contextType = LanguageContext
  declare context: React.ContextType<typeof LanguageContext>

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught", error)
  }

  render() {
    if (this.state.hasError) {
      const t = this.context?.t ?? ((k: string) => k)
      const language = this.context?.language ?? "en"
      
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950 dark:via-slate-900 dark:to-orange-950">
          {/* Enhanced background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(239,68,68,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(249,115,22,0.3),transparent_50%)]"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
            {/* Enhanced Error Icon */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-2xl shadow-2xl shadow-red-500/30">
                  <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Enhanced Error Title */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 dark:from-red-400 dark:via-orange-300 dark:to-red-400 bg-clip-text text-transparent">
              {language === "ar" ? "حدث خطأ" : "Something Went Wrong"}
            </h1>
            
            {/* Enhanced Error Message */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-red-200/30 dark:border-red-800/30 shadow-lg shadow-red-500/10 dark:shadow-red-500/20">
              <p className="text-lg text-muted-foreground font-medium mb-6">
                {t("common.somethingWrong")}
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {language === "ar" 
                    ? "نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو تحديث الصفحة."
                    : "We apologize for this error. Please try again or refresh the page."
                  }
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/30 dark:shadow-red-500/40 border border-red-500/30 dark:border-red-400/30"
                  >
                    {language === "ar" ? "إعادة تحميل" : "Reload Page"}
                  </button>
                  
                  <button
                    onClick={() => window.history.back()}
                    className="px-6 py-3 border border-red-200/50 dark:border-red-800/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-red-50/50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 rounded-xl transition-all duration-300 font-semibold"
                  >
                    {language === "ar" ? "العودة" : "Go Back"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
