"use client";

import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useFramework } from "@/core/hooks/use-framework";
import type {
  FrameworkFunction,
  FrameworkCategory,
  ImplementationStep,
  FrameworkBenefit,
} from "@/core/domain/models/framework";

export default function FrameworkPage() {
  const { language, isRtl } = useLanguage();
  const router = useRouter();
  const [activeFunction, setActiveFunction] = useState("identify");
  const {
    domains,
    functions,
    loading,
    error,
    getFunctionById,
    getCategoriesByFunctionId,
    getFrameworkBenefits,
    getImplementationSteps,
  } = useFramework();

  const [frameworkFunctions, setFrameworkFunctions] = useState<
    FrameworkFunction[]
  >([]);
  const [functionCategories, setFunctionCategories] = useState<
    Record<string, FrameworkCategory[]>
  >({});
  const [implementationSteps, setImplementationSteps] = useState<
    ImplementationStep[]
  >([]);
  const [benefits, setBenefits] = useState<FrameworkBenefit[]>([]);

  useEffect(() => {
    // Prefetch domain pages
    if (domains && domains.length > 0) {
      domains.forEach((domain) => {
        router.prefetch(`/framework/${domain.id}`);
      });
    }

    // Handle hash navigation
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      if (
        hash &&
        ["identify", "protect", "detect", "respond", "recover"].includes(hash)
      ) {
        setActiveFunction(hash);

        // Scroll to the section after a short delay
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      }
    }
  }, [router, domains]);

  useEffect(() => {
    // Load framework functions
    if (functions && functions.length > 0) {
      setFrameworkFunctions(functions);

      // Load categories for each function
      const loadCategories = async () => {
        const categoriesMap: Record<string, FrameworkCategory[]> = {};

        for (const func of functions) {
          const categories = await getCategoriesByFunctionId(func.id);
          categoriesMap[func.id] = categories;
        }

        setFunctionCategories(categoriesMap);
      };

      loadCategories();
    }

    // Load implementation steps
    const loadImplementationSteps = async () => {
      try {
        const steps = await getImplementationSteps();
        setImplementationSteps(steps);
      } catch (error) {
        console.error("Failed to load implementation steps:", error);
      }
    };

    // Load benefits
    const loadBenefits = async () => {
      try {
        const benefitsData = await getFrameworkBenefits();
        setBenefits(benefitsData);
      } catch (error) {
        console.error("Failed to load benefits:", error);
      }
    };

    loadImplementationSteps();
    loadBenefits();
  }, [
    functions,
    getCategoriesByFunctionId,
    getImplementationSteps,
    getFrameworkBenefits,
  ]);

  if (loading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
          <div className="text-red-500">
            Error loading framework data. Please try again later.
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === "ar"
                ? "إطار عمل الأمن السيبراني"
                : "Cybersecurity Framework"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === "ar"
                ? "نموذج شامل لإدارة وتنفيذ الأمن السيبراني"
                : "Comprehensive model for managing and implementing cybersecurity"}
            </p>
          </div>

          {/* Framework Overview */}
          <div className="mb-16">
            <Card>
              <CardContent className="pt-6">
                <div
                  className={`prose dark:prose-invert max-w-none ${
                    isRtl ? "text-right" : "text-left"
                  }`}
                >
                  <p className="text-lg">
                    {language === "ar"
                      ? "يوفر إطار عمل الأمن السيبراني نهجًا منظمًا لفهم وإدارة وتقليل مخاطر الأمن السيبراني. يتكون الإطار من خمس وظائف أساسية تعمل معًا لتشكيل نهج استراتيجي للأمن السيبراني. تم تصميم هذا الإطار ليكون مرنًا وقابلًا للتكيف مع احتياجات مختلف المؤسسات، بغض النظر عن حجمها أو قطاعها."
                      : "The Cybersecurity Framework provides a structured approach to understanding, managing, and reducing cybersecurity risks. The framework consists of five core functions that work together to form a strategic approach to cybersecurity. This framework is designed to be flexible and adaptable to the needs of different organizations, regardless of their size or sector."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Framework Functions Visualization */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {language === "ar"
                ? "الوظائف الأساسية للإطار"
                : "Core Framework Functions"}
            </h2>

            {/* Framework Diagram */}
            <div className="flex justify-center mb-12">
              <div className="relative w-full max-w-2xl">
                <Image
                  src="/images/cybersecurity-framework-circle.png"
                  alt="Cybersecurity Framework"
                  width={600}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Interactive Framework Function Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {frameworkFunctions.map((func) => (
                <motion.div
                  key={func.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer p-4 rounded-lg ${
                    activeFunction === func.id
                      ? func.color + " text-white"
                      : "bg-muted"
                  } transition-all duration-300 w-full sm:w-auto flex-1 max-w-xs`}
                  onClick={() => {
                    setActiveFunction(func.id);
                    document
                      .getElementById(func.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-lg">
                      {language === "ar" ? func.nameAr : func.nameEn}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Framework Function Details */}
            {frameworkFunctions.map((func) => (
              <div
                key={func.id}
                id={func.id}
                className={`mb-12 scroll-mt-24 ${
                  activeFunction === func.id ? "opacity-100" : "opacity-70"
                } transition-opacity duration-300`}
              >
                <Card className={`border-2 ${func.borderColor}`}>
                  <CardHeader className={func.color}>
                    <CardTitle className="text-2xl text-white">
                      {language === "ar" ? func.nameAr : func.nameEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div
                      className={`prose dark:prose-invert max-w-none ${
                        isRtl ? "text-right" : "text-left"
                      }`}
                    >
                      <p className="text-lg mb-6">
                        {language === "ar"
                          ? func.descriptionAr
                          : func.descriptionEn}
                      </p>

                      <h3
                        className={`text-xl font-semibold mb-4 ${func.textColor}`}
                      >
                        {language === "ar" ? "الفئات" : "Categories"}
                      </h3>

                      {functionCategories[func.id] &&
                      functionCategories[func.id].length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead
                                className={isRtl ? "text-right" : "text-left"}
                              >
                                {language === "ar" ? "الفئة" : "Category"}
                              </TableHead>
                              <TableHead
                                className={isRtl ? "text-right" : "text-left"}
                              >
                                {language === "ar" ? "الوصف" : "Description"}
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {functionCategories[func.id].map((category) => (
                              <TableRow key={category.id}>
                                <TableCell
                                  className={`font-medium ${func.textColor}`}
                                >
                                  {language === "ar"
                                    ? category.nameAr
                                    : category.nameEn}
                                </TableCell>
                                <TableCell
                                  className={isRtl ? "text-right" : "text-left"}
                                >
                                  {language === "ar"
                                    ? category.descriptionAr
                                    : category.descriptionEn}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4">
                          {language === "ar"
                            ? "جاري تحميل الفئات..."
                            : "Loading categories..."}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Framework Implementation Steps */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {language === "ar"
                ? "خطوات تنفيذ الإطار"
                : "Framework Implementation Steps"}
            </h2>

            <div className="relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary hidden md:block"></div>

              {implementationSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="mb-8 relative"
                >
                  <div className="flex items-start">
                    <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold mr-4 z-10">
                      {step.step}
                    </div>
                    <Card className="w-full">
                      <CardHeader>
                        <div className="flex items-center">
                          <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold mr-4">
                            {step.step}
                          </div>
                          <CardTitle
                            className={isRtl ? "text-right" : "text-left"}
                          >
                            {language === "ar" ? step.titleAr : step.titleEn}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className={isRtl ? "text-right" : "text-left"}>
                          {language === "ar"
                            ? step.descriptionAr
                            : step.descriptionEn}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Framework Benefits */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {language === "ar"
                ? "فوائد تطبيق الإطار"
                : "Benefits of Implementing the Framework"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle
                        className={`text-xl flex items-center gap-2 ${
                          isRtl ? "text-right" : "justify-start"
                        }`}
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        {language === "ar" ? benefit.titleAr : benefit.titleEn}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={isRtl ? "text-right" : "text-left"}>
                      <p>
                        {language === "ar"
                          ? benefit.descriptionAr
                          : benefit.descriptionEn}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Framework Summary Table */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {language === "ar"
                ? "ملخص إطار عمل الأمن السيبراني"
                : "Cybersecurity Framework Summary"}
            </h2>

            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-5 gap-2">
                  {/* Header Row */}
                  <div className="bg-blue-500 text-white p-3 rounded-md text-center font-bold">
                    {language === "ar" ? "تحديد" : "Identify"}
                  </div>
                  <div className="bg-purple-600 text-white p-3 rounded-md text-center font-bold">
                    {language === "ar" ? "حماية" : "Protect"}
                  </div>
                  <div className="bg-yellow-500 text-white p-3 rounded-md text-center font-bold">
                    {language === "ar" ? "كشف" : "Detect"}
                  </div>
                  <div className="bg-red-600 text-white p-3 rounded-md text-center font-bold">
                    {language === "ar" ? "استجابة" : "Respond"}
                  </div>
                  <div className="bg-green-500 text-white p-3 rounded-md text-center font-bold">
                    {language === "ar" ? "تعافي" : "Recover"}
                  </div>

                  {/* Asset Management */}
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "إدارة الأصول" : "Asset Management"}
                  </div>

                  {/* Access Control */}
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "التحكم في الوصول" : "Access Control"}
                  </div>

                  {/* Anomalies and Events */}
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-md text-sm">
                    {language === "ar"
                      ? "الإنحرافات والأحداث"
                      : "Anomalies and Events"}
                  </div>

                  {/* Response Planning */}
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-sm">
                    {language === "ar"
                      ? "تخطيط الاستجابة"
                      : "Response Planning"}
                  </div>

                  {/* Recovery Planning */}
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "تخطيط التعافي" : "Recovery Planning"}
                  </div>

                  {/* Business Environment */}
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "بيئة العمل" : "Business Environment"}
                  </div>

                  {/* Awareness and Training */}
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md text-sm">
                    {language === "ar"
                      ? "التوعية والتدريب"
                      : "Awareness and Training"}
                  </div>

                  {/* Security Continuous Monitoring */}
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-md text-sm">
                    {language === "ar"
                      ? "المراقبة الأمنية المستمرة"
                      : "Security Continuous Monitoring"}
                  </div>

                  {/* Communications */}
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "الاتصالات" : "Communications"}
                  </div>

                  {/* Improvements */}
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "التحسينات" : "Improvements"}
                  </div>

                  {/* Governance */}
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "الحوكمة" : "Governance"}
                  </div>

                  {/* Data Security */}
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "أمن البيانات" : "Data Security"}
                  </div>

                  {/* Detection Processes */}
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "عمليات الكشف" : "Detection Processes"}
                  </div>

                  {/* Analysis */}
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "التحليل" : "Analysis"}
                  </div>

                  {/* Communications */}
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "الاتصالات" : "Communications"}
                  </div>

                  {/* Risk Assessment */}
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "تقييم المخاطر" : "Risk Assessment"}
                  </div>

                  {/* Info Protection Processes */}
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md text-sm">
                    {language === "ar"
                      ? "عمليات وإجراءات حماية المعلومات"
                      : "Info Protection Processes and Procedures"}
                  </div>

                  {/* Empty cell for Detect */}
                  <div className="bg-transparent"></div>

                  {/* Mitigation */}
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "التخفيف" : "Mitigation"}
                  </div>

                  {/* Empty cell for Recover */}
                  <div className="bg-transparent"></div>

                  {/* Risk Management Strategy */}
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-sm">
                    {language === "ar"
                      ? "استراتيجية إدارة المخاطر"
                      : "Risk Management Strategy"}
                  </div>

                  {/* Maintenance */}
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "الصيانة" : "Maintenance"}
                  </div>

                  {/* Empty cell for Detect */}
                  <div className="bg-transparent"></div>

                  {/* Improvements */}
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "التحسينات" : "Improvements"}
                  </div>

                  {/* Empty cell for Recover */}
                  <div className="bg-transparent"></div>

                  {/* Empty cell for Identify */}
                  <div className="bg-transparent"></div>

                  {/* Protective Technology */}
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md text-sm">
                    {language === "ar"
                      ? "التكنولوجيا الوقائية"
                      : "Protective Technology"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Framework Domains */}
          {/* <h2 className="text-2xl font-bold mb-8 text-center">
            {language === "ar" ? "مجالات إطار العمل" : "Framework Domains"}
          </h2> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain, index) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/framework/${domain.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle
                        className={`text-xl ${
                          isRtl ? "text-right" : "text-left"
                        } flex items-center gap-2`}
                      >
                        <Shield className="h-5 w-5 text-primary" />
                        {language === "ar" ? domain.nameAr : domain.nameEn}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={isRtl ? "text-right" : "text-left"}>
                      <p className="text-muted-foreground mb-4">
                        {language === "ar"
                          ? domain.descriptionAr
                          : domain.descriptionEn}
                      </p>
                      <div
                        className={`mt-4 flex ${
                          isRtl ? "justify-start" : "justify-end"
                        }`}
                      >
                        <span className="text-primary flex items-center text-sm font-medium">
                          {language === "ar" ? "عرض التفاصيل" : "View details"}
                          <ArrowRight
                            className={`h-4 w-4 ${
                              isRtl ? "mr-1 rotate-180" : "ml-1"
                            }`}
                          />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div> */}
        </div>
      </div>
    </MainLayout>
  );
}
