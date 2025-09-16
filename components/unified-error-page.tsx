"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw, ArrowLeft, Search, AlertTriangle, FileX, Zap, Bug } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export type ErrorType = 'not-found' | 'runtime' | 'critical' | 'network' | 'server'

interface UnifiedErrorPageProps {
  type: ErrorType
  title?: string
  message?: string
  error?: Error & { digest?: string }
  onRetry?: () => void
  showErrorDetails?: boolean
}

const errorConfig = {
  'not-found': {
    icon: FileX,
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900',
    titleGradient: 'from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400',
    borderColor: 'border-blue-200/30 dark:border-blue-800/30',
    shadowColor: 'shadow-blue-500/30',
    buttonGradient: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
    buttonShadow: 'shadow-blue-500/30',
    buttonBorder: 'border-blue-200/50 dark:border-blue-800/50',
    buttonHover: 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700'
  },
  'runtime': {
    icon: AlertTriangle,
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950',
    titleGradient: 'from-red-600 via-orange-500 to-red-600 dark:from-red-400 dark:via-orange-300 dark:to-red-400',
    borderColor: 'border-red-200/30 dark:border-red-800/30',
    shadowColor: 'shadow-red-500/30',
    buttonGradient: 'from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700',
    buttonShadow: 'shadow-red-500/30',
    buttonBorder: 'border-red-200/50 dark:border-red-800/50',
    buttonHover: 'hover:bg-red-50/50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700'
  },
  'critical': {
    icon: Zap,
    gradient: 'from-purple-500 via-red-500 to-orange-500',
    bgGradient: 'from-purple-50 via-red-50 to-orange-50 dark:from-purple-950 dark:via-red-950 dark:to-orange-950',
    titleGradient: 'from-purple-600 via-red-500 to-orange-500 dark:from-purple-400 dark:via-red-300 dark:to-orange-300',
    borderColor: 'border-purple-200/30 dark:border-purple-800/30',
    shadowColor: 'shadow-purple-500/30',
    buttonGradient: 'from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700',
    buttonShadow: 'shadow-purple-500/30',
    buttonBorder: 'border-purple-200/50 dark:border-purple-800/50',
    buttonHover: 'hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700'
  },
  'network': {
    icon: AlertTriangle,
    gradient: 'from-yellow-500 to-orange-500',
    bgGradient: 'from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-950 dark:via-orange-950 dark:to-red-950',
    titleGradient: 'from-yellow-600 via-orange-500 to-red-600 dark:from-yellow-400 dark:via-orange-300 dark:to-red-400',
    borderColor: 'border-yellow-200/30 dark:border-yellow-800/30',
    shadowColor: 'shadow-yellow-500/30',
    buttonGradient: 'from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700',
    buttonShadow: 'shadow-yellow-500/30',
    buttonBorder: 'border-yellow-200/50 dark:border-yellow-800/50',
    buttonHover: 'hover:bg-yellow-50/50 dark:hover:bg-yellow-900/20 hover:border-yellow-300 dark:hover:border-yellow-700'
  },
  'server': {
    icon: AlertTriangle,
    gradient: 'from-gray-500 to-red-500',
    bgGradient: 'from-gray-50 via-red-50 to-orange-50 dark:from-gray-950 dark:via-red-950 dark:to-orange-950',
    titleGradient: 'from-gray-600 via-red-500 to-orange-600 dark:from-gray-400 dark:via-red-300 dark:to-orange-400',
    borderColor: 'border-gray-200/30 dark:border-gray-800/30',
    shadowColor: 'shadow-gray-500/30',
    buttonGradient: 'from-gray-600 to-red-600 hover:from-gray-700 hover:to-red-700',
    buttonShadow: 'shadow-gray-500/30',
    buttonBorder: 'border-gray-200/50 dark:border-gray-800/50',
    buttonHover: 'hover:bg-gray-50/50 dark:hover:bg-gray-900/20 hover:border-gray-300 dark:hover:border-gray-700'
  }
}

export default function UnifiedErrorPage({
  type,
  title,
  message,
  error,
  onRetry,
  showErrorDetails = false
}: UnifiedErrorPageProps) {
  const { language, isRtl } = useLanguage()
  const config = errorConfig[type]
  const IconComponent = config.icon

  const getDefaultTitle = () => {
    switch (type) {
      case 'not-found':
        return language === "ar" ? "الصفحة غير موجودة" : "Page Not Found"
      case 'runtime':
        return language === "ar" ? "حدث خطأ" : "Something Went Wrong"
      case 'critical':
        return language === "ar" ? "خطأ حرج" : "Critical Error"
      case 'network':
        return language === "ar" ? "خطأ في الشبكة" : "Network Error"
      case 'server':
        return language === "ar" ? "خطأ في الخادم" : "Server Error"
      default:
        return language === "ar" ? "حدث خطأ" : "Error"
    }
  }

  const getDefaultMessage = () => {
    switch (type) {
      case 'not-found':
        return language === "ar"
          ? "عذراً، لا يمكن العثور على الصفحة المطلوبة. قد تكون الصفحة قد تم حذفها أو نقلها أو غير متاحة مؤقتاً."
          : "Sorry, the page you're looking for doesn't exist. It may have been deleted, moved, or temporarily unavailable."
      case 'runtime':
        return language === "ar"
          ? "نعتذر عن هذا الخطأ غير المتوقع. يرجى المحاولة مرة أخرى أو تحديث الصفحة."
          : "We apologize for this unexpected error. Please try again or refresh the page."
      case 'critical':
        return language === "ar"
          ? "حدث خطأ حرج في التطبيق. يرجى إعادة تحميل الصفحة أو العودة إلى الصفحة الرئيسية."
          : "A critical error occurred in the application. Please reload the page or return to the homepage."
      case 'network':
        return language === "ar"
          ? "حدث خطأ في الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."
          : "A network error occurred. Please check your internet connection and try again."
      case 'server':
        return language === "ar"
          ? "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى بعد قليل."
          : "A server error occurred. Please try again in a few moments."
      default:
        return language === "ar"
          ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
          : "An unexpected error occurred. Please try again."
    }
  }

  const getHelpfulTips = () => {
    switch (type) {
      case 'not-found':
        return [
          language === "ar" ? "تحقق من عنوان URL للتأكد من صحته" : "Check the URL to make sure it's correct",
          language === "ar" ? "جرب البحث عن المحتوى المطلوب" : "Try searching for the content you need",
          language === "ar" ? "ارجع إلى الصفحة الرئيسية" : "Return to the homepage"
        ]
      case 'runtime':
        return [
          language === "ar" ? "جرب إعادة تحميل الصفحة" : "Try refreshing the page",
          language === "ar" ? "تحقق من اتصال الإنترنت" : "Check your internet connection",
          language === "ar" ? "إذا استمر الخطأ، اتصل بالدعم الفني" : "If the error persists, contact technical support"
        ]
      case 'critical':
        return [
          language === "ar" ? "هذا خطأ في مستوى التطبيق الرئيسي" : "This is a root-level application error",
          language === "ar" ? "جرب إعادة تحميل الصفحة بالكامل" : "Try reloading the entire page",
          language === "ar" ? "إذا استمر الخطأ، امسح ذاكرة التخزين المؤقت" : "If the error persists, clear your browser cache"
        ]
      case 'network':
        return [
          language === "ar" ? "تحقق من اتصال الإنترنت" : "Check your internet connection",
          language === "ar" ? "جرب إعادة الاتصال بالشبكة" : "Try reconnecting to the network",
          language === "ar" ? "تحقق من إعدادات الشبكة" : "Check your network settings"
        ]
      case 'server':
        return [
          language === "ar" ? "الخادم قد يكون مشغولاً مؤقتاً" : "The server might be temporarily busy",
          language === "ar" ? "جرب مرة أخرى بعد بضع دقائق" : "Try again in a few minutes",
          language === "ar" ? "إذا استمر الخطأ، اتصل بالدعم الفني" : "If the error persists, contact technical support"
        ]
      default:
        return [
          language === "ar" ? "جرب إعادة تحميل الصفحة" : "Try refreshing the page",
          language === "ar" ? "تحقق من اتصال الإنترنت" : "Check your internet connection",
          language === "ar" ? "اتصل بالدعم الفني إذا استمر الخطأ" : "Contact technical support if the error persists"
        ]
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center relative overflow-hidden`}>
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.3),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.02)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 text-center max-w-2xl mx-auto px-4 ${isRtl ? "text-right" : "text-left"}`}
      >
        {/* Enhanced Error Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-2xl blur-xl opacity-30 animate-pulse`}></div>
            <div className={`relative bg-gradient-to-r ${config.gradient} p-6 rounded-2xl shadow-2xl ${config.shadowColor}`}>
              <IconComponent className="h-16 w-16 text-white" />
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced Error Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r ${config.titleGradient} bg-clip-text text-transparent`}
        >
          {title || getDefaultTitle()}
        </motion.h1>
        
        {/* Enhanced Error Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border ${config.borderColor} shadow-lg ${config.shadowColor}/10 dark:${config.shadowColor}/20 mb-8`}
        >
          <p className="text-lg text-muted-foreground font-medium mb-4">
            {message || getDefaultMessage()}
          </p>
          
          {/* Error Details (only in development or when explicitly requested) */}
          {(process.env.NODE_ENV === 'development' || showErrorDetails) && error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  {language === "ar" ? "تفاصيل الخطأ:" : "Error Details:"}
                </span>
              </div>
              <code className="text-xs text-red-700 dark:text-red-300 break-all">
                {error.message}
              </code>
              {error.digest && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                  Digest: {error.digest}
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2 text-sm text-muted-foreground mt-4">
            {getHelpfulTips().map((tip, index) => (
              <p key={index}>• {tip}</p>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className={`w-full ${isRtl ? "flex-row-reverse" : ""} bg-gradient-to-r ${config.buttonGradient} text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${config.buttonShadow}`}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === "ar" ? "إعادة المحاولة" : "Try Again"}
              </Button>
            )}
            
            <Link href="/" className="block">
              <Button variant="outline" className={`w-full ${isRtl ? "flex-row-reverse" : ""} border ${config.buttonBorder} bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm ${config.buttonHover} rounded-xl transition-all duration-300 font-semibold`}>
                <Home className="h-4 w-4 mr-2" />
                {language === "ar" ? "الصفحة الرئيسية" : "Go Home"}
              </Button>
            </Link>
          </div>
          
          {type === 'not-found' && (
            <Link href="/search" className="block">
              <Button variant="outline" className={`w-full ${isRtl ? "flex-row-reverse" : ""} border ${config.buttonBorder} bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm ${config.buttonHover} rounded-xl transition-all duration-300 font-semibold`}>
                <Search className="h-4 w-4 mr-2" />
                {language === "ar" ? "البحث" : "Search"}
              </Button>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className={`w-full ${isRtl ? "flex-row-reverse" : ""} text-muted-foreground hover:text-foreground transition-all duration-300`}
          >
            {isRtl ? <ArrowLeft className="h-4 w-4 mr-2" /> : <ArrowLeft className="h-4 w-4 mr-2" />}
            {language === "ar" ? "العودة للصفحة السابقة" : "Go Back"}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
