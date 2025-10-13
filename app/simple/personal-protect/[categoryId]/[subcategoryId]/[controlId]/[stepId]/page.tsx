"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Calendar, 
  Eye, 
  Download, 
  Play, 
  FileText, 
  Image as ImageIcon,
  Video,
  Clock,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import VideoImageCarousel from "@/components/video-image-carousel"
import { usePersonalProtectControlSteps } from "@/core/hooks/use-personal-protect-control-steps"
import { usePersonalProtectControlStep } from "@/core/hooks/use-personal-protect-control-step"
import { getLocalizedText, purifyHtml, isValidHtmlContent } from "@/lib/utils"
import type { PersonalProtectControlStep } from "@/core/domain/models/personal-protect"

interface PersonalProtectControlStepDetailPageProps {
  params: Promise<{
    categoryId: string
    subcategoryId: string
    controlId: string
    stepId: string
  }>
}

export default function PersonalProtectControlStepDetailPage({ 
  params 
}: PersonalProtectControlStepDetailPageProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const isRtl = language === "ar"
  
  // Unwrap the params Promise
  const resolvedParams = use(params)
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  
  // Fetch all steps for the control
  const { steps, loading: stepsLoading, error: stepsError } = usePersonalProtectControlSteps(
    resolvedParams.controlId,
    undefined, // no search
    1,
    100 // get all steps
  )
  
  // Fetch current step details
  const { step, loading: stepLoading, error: stepError } = usePersonalProtectControlStep(
    resolvedParams.stepId
  )

  // Find current step index in the steps array
  useEffect(() => {
    if (steps && resolvedParams.stepId) {
      const index = steps.findIndex(s => s.id === resolvedParams.stepId)
      if (index !== -1) {
        setCurrentStepIndex(index)
      }
    }
  }, [steps, resolvedParams.stepId])

  // Navigation functions
  const goToPreviousStep = () => {
    if (steps && currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1]
      router.push(`/simple/personal-protect/${resolvedParams.categoryId}/${resolvedParams.subcategoryId}/${resolvedParams.controlId}/${prevStep.id}`)
    }
  }

  const goToNextStep = () => {
    if (steps && currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1]
      router.push(`/simple/personal-protect/${resolvedParams.categoryId}/${resolvedParams.subcategoryId}/${resolvedParams.controlId}/${nextStep.id}`)
    }
  }

  const goToStep = (stepId: string) => {
    router.push(`/simple/personal-protect/${resolvedParams.categoryId}/${resolvedParams.subcategoryId}/${resolvedParams.controlId}/${stepId}`)
  }

  // Handle carousel item change
  const handleCarouselItemChange = (item: PersonalProtectControlStep, index: number) => {
    goToStep(item.id)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPreviousStep()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNextStep()
      } else if (e.key === 'Escape') {
        router.push(`/simple/personal-protect/${resolvedParams.categoryId}/${resolvedParams.subcategoryId}/${resolvedParams.controlId}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStepIndex, steps])

  if (stepsLoading || stepLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        {/* Cybersecurity Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "الحماية الشخصية" : "Personal Protection", href: "/simple/personal-protect" },
              { label: language === "ar" ? "جاري التحميل..." : "Loading..." }
            ]} 
          />

          {/* Loading Content */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg p-8 animate-pulse">
              <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl mb-6"></div>
              <div className="space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (stepsError || stepError || !step || !steps) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {language === "ar" ? "حدث خطأ في تحميل الخطوة" : "Error loading step"}
          </h3>
          <p className="text-muted-foreground mb-4">{stepsError || stepError || "Step not found"}</p>
          <Link
            href="/simple/personal-protect"
            className="inline-flex items-center px-6 py-3 bg-teal-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-300"
          >
            {language === "ar" ? "العودة للحماية الشخصية" : "Back to Personal Protection"}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: language === "ar" ? "الحماية الشخصية" : "Personal Protection", href: "/simple/personal-protect" },
            { label: language === "ar" ? "خطوات الحماية" : "Protection Steps", href: `/simple/personal-protect/${resolvedParams.categoryId}/${resolvedParams.subcategoryId}/${resolvedParams.controlId}` },
            { label: language === "ar" ? step.name : step.nameEn || step.name }
          ]} 
        />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
            
            {/* Video/Image Carousel */}
            <VideoImageCarousel
              items={steps}
              initialIndex={currentStepIndex}
              onItemChange={handleCarouselItemChange}
              className="w-full"
            />

            {/* Step Information */}
            <div className="p-8">
              {/* Step Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-3 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(step.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {language === "ar" ? "خطوة حماية" : "Protection Step"}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {step.order} / {steps.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Media Type Badges */}
                <div className="flex gap-2">
                  {step.videoUrl && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      {language === "ar" ? "فيديو" : "Video"}
                    </span>
                  )}
                  {step.imageUrl && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {language === "ar" ? "صورة" : "Image"}
                    </span>
                  )}
                  {step.documentUrl && (
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {language === "ar" ? "مستند" : "Document"}
                    </span>
                  )}
                </div>
              </div>

              {/* Step Title */}
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                {language === "ar" ? step.name : step.nameEn || step.name}
              </h1>

              {/* Step Summary */}
              {(step.summary || step.summaryEn) && (
                <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {language === "ar" ? "ملخص الخطوة" : "Step Summary"}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {language === "ar" ? step.summary : step.summaryEn || step.summary}
                  </div>
                </div>
              )}

              {/* Step Content */}
              {(step.content || step.contentEn) && (
                <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {language === "ar" ? "تفاصيل الخطوة" : "Step Details"}
                  </h3>
                  <div 
                    className="text-gray-600 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: purifyHtml(language === "ar" ? step.content : step.contentEn || step.content)
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {/* Previous Step */}
                {currentStepIndex > 0 && (
                  <button
                    onClick={goToPreviousStep}
                    className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors duration-300"
                  >
                    {isRtl ? (
                      <ArrowRight className="h-5 w-5 mr-2" />
                    ) : (
                      <ArrowLeft className="h-5 w-5 mr-2" />
                    )}
                    {language === "ar" ? "الخطوة السابقة" : "Previous Step"}
                  </button>
                )}

                {/* Next Step */}
                {currentStepIndex < steps.length - 1 && (
                  <button
                    onClick={goToNextStep}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-blue-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {language === "ar" ? "الخطوة التالية" : "Next Step"}
                    {isRtl ? (
                      <ArrowLeft className="h-5 w-5 ml-2" />
                    ) : (
                      <ArrowRight className="h-5 w-5 ml-2" />
                    )}
                  </button>
                )}

                {/* Download Document */}
                {step.documentUrl && (
                  <a
                    href={step.documentUrl}
                    download
                    className="inline-flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors duration-300"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    {language === "ar" ? "تحميل المستند" : "Download Document"}
                  </a>
                )}

                {/* Back to Control */}
                <Link
                  href={`/simple/personal-protect/${resolvedParams.categoryId}/${resolvedParams.subcategoryId}/${resolvedParams.controlId}`}
                  className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors duration-300"
                >
                  {isRtl ? (
                    <ArrowRight className="h-5 w-5 mr-2" />
                  ) : (
                    <ArrowLeft className="h-5 w-5 mr-2" />
                  )}
                  {language === "ar" ? "العودة للتحكم" : "Back to Control"}
                </Link>
              </div>
            </div>
          </div>

          {/* Steps Navigation */}
          {steps.length > 1 && (
            <div className="mt-8 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {language === "ar" ? "جميع الخطوات" : "All Steps"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {steps.map((stepItem, index) => (
                  <button
                    key={stepItem.id}
                    onClick={() => goToStep(stepItem.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      stepItem.id === step.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        stepItem.id === step.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex gap-1">
                        {stepItem.videoUrl && <Video className="h-4 w-4 text-blue-500" />}
                        {stepItem.imageUrl && <ImageIcon className="h-4 w-4 text-green-500" />}
                        {stepItem.documentUrl && <FileText className="h-4 w-4 text-purple-500" />}
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1">
                      {language === "ar" ? stepItem.name : stepItem.nameEn || stepItem.name}
                    </h4>
                    {(stepItem.summary || stepItem.summaryEn) && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {language === "ar" ? stepItem.summary : stepItem.summaryEn || stepItem.summary}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
