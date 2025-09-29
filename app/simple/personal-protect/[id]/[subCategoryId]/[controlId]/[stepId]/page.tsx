"use client"

import { use } from "react"
import { useLanguage } from "@/components/language-provider"
import { usePersonalProtectControlStep } from "@/core/hooks/use-personal-protect-control-step"
import { usePersonalProtectControlSteps } from "@/core/hooks/use-personal-protect-control-steps"
import { usePersonalProtectControls } from "@/core/hooks/use-personal-protect-controls"
import { usePersonalProtectSubCategories } from "@/core/hooks/use-personal-protect-subcategories"
import { usePersonalProtectCategories } from "@/core/hooks/use-personal-protect-categories"
import { Play, Calendar, ArrowRight, ArrowLeft, Eye, Users, Lock, Home, Settings, FileText, Video, Image, Download, ChevronRight, ChevronLeft, Clock, CheckCircle, Star, Zap, Maximize2, Volume2, VolumeX, Pause, RotateCcw, Share2, Bookmark, Heart, MessageCircle, ThumbsUp, PlayCircle, BookOpen, Target, Shield, Award, TrendingUp, Sparkles, X, ExternalLink, ChevronDown, ChevronUp, Menu, Grid3X3 } from "lucide-react"
import { ShareButton } from "@/components/ui/share-button"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import Breadcrumbs from "@/components/breadcrumbs"
import { usePersonalProtectBreadcrumbs } from "@/hooks/use-breadcrumbs"

interface PersonalProtectControlStepPageProps {
  params: Promise<{
    id: string
    subCategoryId: string
    controlId: string
    stepId: string
  }>
}

export default function PersonalProtectControlStepPage({ params }: PersonalProtectControlStepPageProps) {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const categoryId = resolvedParams.id
  const subCategoryId = resolvedParams.subCategoryId
  const controlId = resolvedParams.controlId
  const stepId = resolvedParams.stepId
  
  // Get breadcrumbs with dynamic data
  const { items: breadcrumbItems, isLoading: breadcrumbLoading } = usePersonalProtectBreadcrumbs(categoryId, subCategoryId, controlId, stepId)
  
  const { step, loading, error } = usePersonalProtectControlStep(stepId)
  
  // Get all steps for navigation
  const { steps: allSteps } = usePersonalProtectControlSteps(controlId, "", 1, 100)
  
  // Get category, subcategory, and control info for breadcrumbs and title
  const { categories } = usePersonalProtectCategories("", 1, 100)
  const { subCategories } = usePersonalProtectSubCategories(categoryId, "", 1, 100)
  const { controls } = usePersonalProtectControls(subCategoryId, "", 1, 100)
  
  const currentCategory = categories.find(cat => cat.id === categoryId)
  const currentSubCategory = subCategories.find(sub => sub.id === subCategoryId)
  const currentControl = controls.find(ctrl => ctrl.id === controlId)

  // Video player state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const handleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted
      setIsVideoMuted(!isVideoMuted)
    }
  }

  const handleVideoProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setVideoProgress(progress)
    }
  }

  const handleVideoSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      videoRef.current.currentTime = percentage * videoRef.current.duration
    }
  }

  // Get navigation steps
  const sortedSteps = allSteps.sort((a, b) => a.order - b.order)
  const currentStepIndex = sortedSteps.findIndex(s => s.id === stepId)
  const prevStep = currentStepIndex > 0 ? sortedSteps[currentStepIndex - 1] : null
  const nextStep = currentStepIndex < sortedSteps.length - 1 ? sortedSteps[currentStepIndex + 1] : null
  const relatedSteps = sortedSteps.filter(s => s.id !== stepId).slice(0, 4)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Breadcrumbs items={breadcrumbItems} isLoading={breadcrumbLoading} />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg h-96 animate-pulse">
                  <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-t-3xl"></div>
                  <div className="p-8 space-y-4">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg h-96 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !step) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Breadcrumbs items={breadcrumbItems} isLoading={breadcrumbLoading} />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل الخطوة" : "Error Loading Step"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل الخطوة. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading the step. Please try again."
              }
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {language === "ar" ? "إعادة المحاولة" : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const categoryName = currentCategory ? (language === "ar" ? currentCategory.name : currentCategory.nameEn || currentCategory.name) : ""
  const subCategoryName = currentSubCategory ? (language === "ar" ? currentSubCategory.name : currentSubCategory.nameEn || currentSubCategory.name) : ""
  const controlName = currentControl ? (language === "ar" ? currentControl.name : currentControl.nameEn || currentControl.name) : ""
  const stepName = language === "ar" ? step.name : (step.nameEn || step.name)
  const stepSummary = language === "ar" ? step.summary : (step.summaryEn || step.summary)
  const stepContent = language === "ar" ? step.content : (step.contentEn || step.content)

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
        {/* Dynamic Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} isLoading={breadcrumbLoading} />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Step Header */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg mb-8 overflow-hidden">
                {/* Hero Media */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-purple-600">
                  {step.videoUrl ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        src={step.videoUrl}
                        className="w-full h-full object-fill"
                        onTimeUpdate={handleVideoProgress}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                        onEnded={() => setIsVideoPlaying(false)}
                      />
                      
                      {/* Video Overlay Controls */}
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={handleVideoPlay}
                          className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          {isVideoPlaying ? (
                            <Pause className="h-8 w-8" />
                          ) : (
                            <Play className="h-8 w-8 ml-1" />
                          )}
                        </button>
                      </div>

                      {/* Video Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div 
                          className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
                          onClick={handleVideoSeek}
                        >
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-300"
                            style={{ width: `${videoProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Video Controls */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={handleVideoMute}
                          className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
                        >
                          {isVideoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => videoRef.current?.requestFullscreen()}
                          className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : step.imageUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={step.imageUrl}
                        alt={stepName}
                        className="w-full h-full object-fill cursor-pointer hover:scale-105 transition-transform duration-700"
                        onClick={() => setIsImageModalOpen(true)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Image Zoom Button */}
                      <button
                        onClick={() => setIsImageModalOpen(true)}
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-8">
                        <FileText className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Step Order Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-full flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    {language === "ar" ? `خطوة ${step.order}` : `Step ${step.order}`}
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-8">
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {stepName}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> 
                            {new Date(step.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {language === "ar" ? "تم التحديث" : "Updated"} {step.updatedAt ? new Date(step.updatedAt).toLocaleDateString() : new Date(step.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Share Button */}
                    <ShareButton
                      title={step?.name || 'Personal Protect Control Step'}
                      url={typeof window !== 'undefined' ? window.location.href : ''}
                      text={language === "ar" ? `خطوة حماية شخصية: ${step?.name}` : `Personal Protect Step: ${step?.name}`}
                      variant="default"
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    />
                  </div>

                  {/* Step Summary */}
                  {stepSummary && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        {language === "ar" ? "ملخص الخطوة" : "Step Summary"}
                      </h2>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed" 
                           dangerouslySetInnerHTML={{ __html: stepSummary }} />
                    </div>
                  )}

                  {/* Step Content */}
                  {stepContent && (
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Zap className="h-6 w-6 text-blue-500" />
                        {language === "ar" ? "تفاصيل الخطوة" : "Step Details"}
                      </h2>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed" 
                           dangerouslySetInnerHTML={{ __html: stepContent }} />
                    </div>
                  )}

                  {/* Download Section */}
                  {step.documentUrl && (
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Download className="h-5 w-5 text-green-600" />
                        {language === "ar" ? "الملفات المرفقة" : "Attached Files"}
                      </h3>
                      <a
                        href={step.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                      >
                        <Download className="h-5 w-5" />
                        {language === "ar" ? "تحميل الملف" : "Download File"}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Previous Step */}
                {prevStep && (
                  <Link
                    href={`/simple/personal-protect/${categoryId}/${subCategoryId}/${controlId}/${prevStep.id}`}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-2 rounded-lg">
                        <ArrowLeft className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {language === "ar" ? "الخطوة السابقة" : "Previous Step"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {language === "ar" ? prevStep.name : (prevStep.nameEn || prevStep.name)}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Target className="h-4 w-4" />
                      {language === "ar" ? `خطوة ${prevStep.order}` : `Step ${prevStep.order}`}
                    </div>
                  </Link>
                )}

                {/* Next Step */}
                {nextStep && (
                  <Link
                    href={`/simple/personal-protect/${categoryId}/${subCategoryId}/${controlId}/${nextStep.id}`}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {language === "ar" ? "الخطوة التالية" : "Next Step"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {language === "ar" ? nextStep.name : (nextStep.nameEn || nextStep.name)}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Target className="h-4 w-4" />
                      {language === "ar" ? `خطوة ${nextStep.order}` : `Step ${nextStep.order}`}
                    </div>
                  </Link>
                )}
              </div>

              {/* Related Steps */}
              {relatedSteps.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-blue-500" />
                    {language === "ar" ? "خطوات أخرى" : "Other Steps"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedSteps.map((relatedStep) => (
                      <Link
                        key={relatedStep.id}
                        href={`/simple/personal-protect/${categoryId}/${subCategoryId}/${controlId}/${relatedStep.id}`}
                        className="group flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                      >
                        <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden flex-shrink-0">
                          {relatedStep.imageUrl ? (
                            <img
                              src={relatedStep.imageUrl}
                              alt={language === "ar" ? relatedStep.name : (relatedStep.nameEn || relatedStep.name)}
                              className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : relatedStep.videoUrl ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PlayCircle className="h-6 w-6 text-white" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div className="absolute top-1 left-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold px-1 py-0.5 rounded">
                            {relatedStep.order}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                            {language === "ar" ? relatedStep.name : (relatedStep.nameEn || relatedStep.name)}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(relatedStep.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Steps Navigation */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Grid3X3 className="h-5 w-5 text-blue-500" />
                      {language === "ar" ? "جميع الخطوات" : "All Steps"}
                    </h3>
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300"
                    >
                      {isSidebarOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <div className={`space-y-2 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                    {sortedSteps.map((stepItem) => {
                      const isCurrentStep = stepItem.id === stepId
                      const stepDisplayName = language === "ar" ? stepItem.name : (stepItem.nameEn || stepItem.name)
                      
                      return (
                        <Link
                          key={stepItem.id}
                          href={`/simple/personal-protect/${categoryId}/${subCategoryId}/${controlId}/${stepItem.id}`}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                            isCurrentStep
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCurrentStep
                              ? 'bg-white/20 text-white'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}>
                            {stepItem.order}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium line-clamp-1 ${
                              isCurrentStep ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}>
                              {stepDisplayName}
                            </div>
                          </div>
                          {isCurrentStep && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Back to Steps */}
                <Link
                  href={`/simple/personal-protect/${categoryId}/${subCategoryId}/${controlId}`}
                  className="block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "العودة للقائمة" : "Back to List"}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {language === "ar" ? "جميع الخطوات" : "All Steps"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="h-4 w-4" />
                    {language === "ar" ? `${sortedSteps.length} خطوة` : `${sortedSteps.length} steps`}
                  </div>
                </Link>

                {/* Step Info */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    {language === "ar" ? "معلومات الخطوة" : "Step Information"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-400">{language === "ar" ? "رقم الخطوة:" : "Step Number:"}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{step.order}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-400">{language === "ar" ? "تاريخ الإنشاء:" : "Created:"}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{new Date(step.createdAt).toLocaleDateString()}</span>
                    </div>
                    {step.updatedAt && (
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400">{language === "ar" ? "آخر تحديث:" : "Updated:"}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{new Date(step.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && step.imageUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setIsImageModalOpen(false)}>
          <div className="relative max-w-6xl max-h-full">
            <img
              src={step.imageUrl}
              alt={stepName}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}