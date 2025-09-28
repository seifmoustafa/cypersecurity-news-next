"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Shield, Send, User, Building, FileText, Hash } from "lucide-react"

export default function IncidentReportPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    rank: "",
    name: "",
    militaryNumber: "",
    nationalNumber: "",
    unit: "",
    email: "",
    phoneNumber: "",
    title: "",
    description: "",
    priority: "",
    category: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateNumber = (value: string): boolean => {
    const numberRegex = /^\d+$/
    return numberRegex.test(value)
  }

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    // Validate email
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = t("beginners.incidentReport.validationErrors.emailInvalid")
    }

    // Validate military number
    if (formData.militaryNumber && !validateNumber(formData.militaryNumber)) {
      newErrors.militaryNumber = t("beginners.incidentReport.validationErrors.militaryNumberInvalid")
    }

    // Validate national number
    if (formData.nationalNumber && !validateNumber(formData.nationalNumber)) {
      newErrors.nationalNumber = t("beginners.incidentReport.validationErrors.nationalNumberInvalid")
    }

    // Validate phone number
    if (formData.phoneNumber && !validateNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = t("beginners.incidentReport.validationErrors.phoneNumberInvalid")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submitting
    if (!validateForm()) {
      toast({
        title: t("beginners.incidentReport.errorTitle"),
        description: "Please fix the validation errors before submitting",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success toast
      toast({
        title: t("beginners.incidentReport.successTitle"),
        description: t("beginners.incidentReport.successDescription"),
        variant: "default"
      })

      // Clear form
      setFormData({
        rank: "",
        name: "",
        militaryNumber: "",
        nationalNumber: "",
        unit: "",
        email: "",
        phoneNumber: "",
        title: "",
        description: "",
        priority: "",
        category: ""
      })
      
      // Clear errors
      setErrors({})

    } catch (error) {
      toast({
        title: t("beginners.incidentReport.errorTitle"),
        description: t("beginners.incidentReport.errorDescription"),
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const ranks = [
    { value: "private", label: t("beginners.incidentReport.ranks.private") },
    { value: "corporal", label: t("beginners.incidentReport.ranks.corporal") },
    { value: "sergeant", label: t("beginners.incidentReport.ranks.sergeant") },
    { value: "staff-sergeant", label: t("beginners.incidentReport.ranks.staffSergeant") },
    { value: "warrant-officer", label: t("beginners.incidentReport.ranks.warrantOfficer") },
    { value: "second-lieutenant", label: t("beginners.incidentReport.ranks.secondLieutenant") },
    { value: "first-lieutenant", label: t("beginners.incidentReport.ranks.firstLieutenant") },
    { value: "captain", label: t("beginners.incidentReport.ranks.captain") },
    { value: "major", label: t("beginners.incidentReport.ranks.major") },
    { value: "lieutenant-colonel", label: t("beginners.incidentReport.ranks.lieutenantColonel") },
    { value: "colonel", label: t("beginners.incidentReport.ranks.colonel") },
    { value: "brigadier-general", label: t("beginners.incidentReport.ranks.brigadierGeneral") },
    { value: "major-general", label: t("beginners.incidentReport.ranks.majorGeneral") },
    { value: "lieutenant-general", label: t("beginners.incidentReport.ranks.lieutenantGeneral") },
    { value: "general", label: t("beginners.incidentReport.ranks.general") }
  ]

  const priorities = [
    { value: "low", label: t("beginners.incidentReport.priorities.low") },
    { value: "medium", label: t("beginners.incidentReport.priorities.medium") },
    { value: "high", label: t("beginners.incidentReport.priorities.high") },
    { value: "critical", label: t("beginners.incidentReport.priorities.critical") }
  ]

  const categories = [
    { value: "malware", label: t("beginners.incidentReport.categories.malware") },
    { value: "phishing", label: t("beginners.incidentReport.categories.phishing") },
    { value: "data-breach", label: t("beginners.incidentReport.categories.dataBreach") },
    { value: "unauthorized-access", label: t("beginners.incidentReport.categories.unauthorizedAccess") },
    { value: "system-compromise", label: t("beginners.incidentReport.categories.systemCompromise") },
    { value: "network-intrusion", label: t("beginners.incidentReport.categories.networkIntrusion") },
    { value: "social-engineering", label: t("beginners.incidentReport.categories.socialEngineering") },
    { value: "insider-threat", label: t("beginners.incidentReport.categories.insiderThreat") },
    { value: "other", label: t("beginners.incidentReport.categories.other") }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t("beginners.incidentReport.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("beginners.incidentReport.subtitle")}
          </p>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                {t("beginners.incidentReport.reportInformation")}
              </CardTitle>
              <CardDescription>
                {t("beginners.incidentReport.reportInformationDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {t("beginners.incidentReport.personalInformation")}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Rank */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("beginners.incidentReport.rank")} *
                      </label>
                      <Select value={formData.rank} onValueChange={(value) => handleInputChange("rank", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("beginners.incidentReport.selectRank")} />
                        </SelectTrigger>
                        <SelectContent>
                          {ranks.map((rank) => (
                            <SelectItem key={rank.value} value={rank.value}>
                              {rank.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("beginners.incidentReport.fullName")} *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder={t("beginners.incidentReport.enterFullName")}
                        required
                      />
                    </div>

                    {/* Military Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("beginners.incidentReport.militaryNumber")} *
                      </label>
                      <Input
                        value={formData.militaryNumber}
                        onChange={(e) => handleInputChange("militaryNumber", e.target.value)}
                        placeholder={t("beginners.incidentReport.enterMilitaryNumber")}
                        className={errors.militaryNumber ? "border-red-500 focus:border-red-500" : ""}
                        required
                      />
                      {errors.militaryNumber && (
                        <p className="text-sm text-red-500">{errors.militaryNumber}</p>
                      )}
                    </div>

                    {/* National Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("beginners.incidentReport.nationalNumber")} *
                      </label>
                      <Input
                        value={formData.nationalNumber}
                        onChange={(e) => handleInputChange("nationalNumber", e.target.value)}
                        placeholder={t("beginners.incidentReport.enterNationalNumber")}
                        className={errors.nationalNumber ? "border-red-500 focus:border-red-500" : ""}
                        required
                      />
                      {errors.nationalNumber && (
                        <p className="text-sm text-red-500">{errors.nationalNumber}</p>
                      )}
                    </div>

                    {/* Unit */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("beginners.incidentReport.unit")} *
                      </label>
                      <Input
                        value={formData.unit}
                        onChange={(e) => handleInputChange("unit", e.target.value)}
                        placeholder={t("beginners.incidentReport.enterUnitName")}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("beginners.incidentReport.email")} *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder={t("beginners.incidentReport.enterEmail")}
                        className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("beginners.incidentReport.phoneNumber")} *
                      </label>
                      <Input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        placeholder={t("beginners.incidentReport.enterPhoneNumber")}
                        className={errors.phoneNumber ? "border-red-500 focus:border-red-500" : ""}
                        required
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Incident Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                    {t("beginners.incidentReport.incidentInformation")}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("beginners.incidentReport.incidentCategory")} *
                      </label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("beginners.incidentReport.selectIncidentCategory")} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("beginners.incidentReport.priority")} *
                      </label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("beginners.incidentReport.selectPriority")} />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("beginners.incidentReport.incidentTitle")} *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder={t("beginners.incidentReport.enterIncidentTitle")}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("beginners.incidentReport.incidentDescription")} *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder={t("beginners.incidentReport.enterIncidentDescription")}
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t("beginners.incidentReport.submitting")}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        {t("beginners.incidentReport.submitReport")}
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("beginners.incidentReport.securityNote")}
          </p>
        </div>
      </div>
    </div>
  )
}
