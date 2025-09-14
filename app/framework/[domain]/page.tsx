"use client";

import { notFound } from "next/navigation";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFramework } from "@/core/hooks/use-framework";
import type { Component, Domain } from "@/core/domain/models/framework";

export default function FrameworkDomainPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <FrameworkDomainContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse">Loading...</div>
      </div>
    </MainLayout>
  );
}

function FrameworkDomainContent() {
  const params = useParams();
  const domainId = params.domain as string;
  const { language, isRtl } = useLanguage();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const { getDomainById, getComponentsByDomainId } = useFramework();

  useEffect(() => {
    const fetchDomainData = async () => {
      const domainData = await getDomainById(domainId);
      if (!domainData) {
        notFound();
      }
      setDomain(domainData);

      const componentsData = await getComponentsByDomainId(domainId);
      setComponents(componentsData);
    };

    fetchDomainData();
  }, [domainId, getDomainById, getComponentsByDomainId]);

  if (!domain) {
    return <LoadingState />;
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href="/framework">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              {language === "ar" ? domain.nameAr : domain.nameEn}
            </h1>
          </div>

          <div
            className={`prose dark:prose-invert max-w-none mb-12 ${
              isRtl ? "text-right" : "text-left"
            }`}
          >
            <p className="text-lg">
              {language === "ar" ? domain.descriptionAr : domain.descriptionEn}
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-8"
          >
            <TabsList
              className={`w-full max-w-md mx-auto ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              <TabsTrigger value="overview">
                {language === "ar" ? "نظرة عامة" : "Overview"}
              </TabsTrigger>
              <TabsTrigger value="components">
                {language === "ar" ? "المكونات" : "Components"}
              </TabsTrigger>
              <TabsTrigger value="implementation">
                {language === "ar" ? "التنفيذ" : "Implementation"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className={isRtl ? "text-right" : "text-left"}>
                    {language === "ar" ? "نظرة عامة على " : "Overview of "}{" "}
                    {language === "ar" ? domain.nameAr : domain.nameEn}
                  </CardTitle>
                </CardHeader>
                <CardContent className={isRtl ? "text-right" : "text-left"}>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      {language === "ar"
                        ? `يعد ${domain.nameAr} جزءًا أساسيًا من إطار عمل الأمن السيبراني، حيث يوفر الأساس لـ ${components.length} مكونات رئيسية تساعد المؤسسات على تعزيز موقفها الأمني.`
                        : `${domain.nameEn} is a critical part of the cybersecurity framework, providing the foundation for ${components.length} key components that help organizations strengthen their security posture.`}
                    </p>
                    <p>
                      {language === "ar"
                        ? "يتطلب التنفيذ الفعال لهذا المجال تعاونًا بين أصحاب المصلحة المختلفين في المؤسسة، بما في ذلك فرق تكنولوجيا المعلومات والأمن والإدارة العليا."
                        : "Effective implementation of this domain requires collaboration between different stakeholders in the organization, including IT teams, security teams, and senior management."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="components" className="mt-6">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {language === "ar" ? "المكونات" : "Components"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {components.map((component, index) => (
                  <motion.div
                    key={component.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card key={component.id} className="h-full">
                      <CardHeader className="pb-2">
                        <CardTitle
                          className={`text-xl ${
                            isRtl ? "text-right" : "text-left"
                          }`}
                        >
                          {language === "ar"
                            ? component.nameAr
                            : component.nameEn}
                        </CardTitle>
                      </CardHeader>
                      <CardContent
                        className={isRtl ? "text-right" : "text-left"}
                      >
                        <p className="text-muted-foreground mb-4">
                          {language === "ar"
                            ? component.descriptionAr
                            : component.descriptionEn}
                        </p>
                        <div className="mt-4 p-4 bg-muted rounded-md">
                          <h4 className="font-medium mb-2">
                            {language === "ar"
                              ? "أفضل الممارسات"
                              : "Best Practices"}
                            :
                          </h4>
                          <ul
                            className={`list-disc ${
                              isRtl ? "mr-5" : "ml-5"
                            } space-y-1`}
                          >
                            <li>
                              {language === "ar"
                                ? "تطوير سياسات وإجراءات واضحة"
                                : "Develop clear policies and procedures"}
                            </li>
                            <li>
                              {language === "ar"
                                ? "تنفيذ ضوابط تقنية مناسبة"
                                : "Implement appropriate technical controls"}
                            </li>
                            <li>
                              {language === "ar"
                                ? "تدريب الموظفين بانتظام"
                                : "Regularly train employees"}
                            </li>
                            <li>
                              {language === "ar"
                                ? "مراجعة وتحديث النهج بشكل دوري"
                                : "Periodically review and update approach"}
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="implementation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className={isRtl ? "text-right" : "text-left"}>
                    {language === "ar"
                      ? "دليل التنفيذ"
                      : "Implementation Guide"}
                  </CardTitle>
                </CardHeader>
                <CardContent className={isRtl ? "text-right" : "text-left"}>
                  <div className="prose dark:prose-invert max-w-none">
                    <h3>
                      {language === "ar"
                        ? "خطوات التنفيذ الرئيسية"
                        : "Key Implementation Steps"}
                    </h3>
                    <ol className="space-y-4">
                      <li>
                        <strong>
                          {language === "ar"
                            ? "تقييم الوضع الحالي"
                            : "Assess Current State"}
                        </strong>
                        <p>
                          {language === "ar"
                            ? "قم بتقييم شامل للممارسات الحالية وحدد الفجوات في الامتثال."
                            : "Conduct a comprehensive assessment of current practices and identify compliance gaps."}
                        </p>
                      </li>
                      <li>
                        <strong>
                          {language === "ar"
                            ? "تطوير خطة التنفيذ"
                            : "Develop Implementation Plan"}
                        </strong>
                        <p>
                          {language === "ar"
                            ? "قم بإنشاء خطة تفصيلية تحدد الأنشطة والموارد والجداول الزمنية."
                            : "Create a detailed plan outlining activities, resources, and timelines."}
                        </p>
                      </li>
                      <li>
                        <strong>
                          {language === "ar"
                            ? "تنفيذ إجراءات التحكم"
                            : "Implement Controls"}
                        </strong>
                        <p>
                          {language === "ar"
                            ? "قم بتنفيذ إجراءات التحكم التقنية والتنظيمية اللازمة."
                            : "Implement necessary technical and organizational controls."}
                        </p>
                      </li>
                      <li>
                        <strong>
                          {language === "ar"
                            ? "التدريب والتوعية"
                            : "Training and Awareness"}
                        </strong>
                        <p>
                          {language === "ar"
                            ? "قم بتدريب الموظفين على السياسات والإجراءات الجديدة."
                            : "Train employees on new policies and procedures."}
                        </p>
                      </li>
                      <li>
                        <strong>
                          {language === "ar"
                            ? "المراقبة والتحسين"
                            : "Monitor and Improve"}
                        </strong>
                        <p>
                          {language === "ar"
                            ? "قم بمراقبة الامتثال وفعالية إجراءات التحكم وإجراء التحسينات المستمرة."
                            : "Monitor compliance and control effectiveness and make continuous improvements."}
                        </p>
                      </li>
                    </ol>

                    <h3 className="mt-6">
                      {language === "ar"
                        ? "التحديات الشائعة والحلول"
                        : "Common Challenges and Solutions"}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">
                          {language === "ar"
                            ? "نقص الموارد"
                            : "Resource Constraints"}
                        </h4>
                        <p>
                          {language === "ar"
                            ? "الحل: حدد أولويات إجراءات التحكم بناءً على تقييم المخاطر وقم بالتنفيذ على مراحل."
                            : "Solution: Prioritize controls based on risk assessment and implement in phases."}
                        </p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">
                          {language === "ar"
                            ? "مقاومة التغيير"
                            : "Resistance to Change"}
                        </h4>
                        <p>
                          {language === "ar"
                            ? "الحل: قم بإشراك أصحاب المصلحة مبكرًا وشرح فوائد الامتثال."
                            : "Solution: Engage stakeholders early and explain the benefits of compliance."}
                        </p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">
                          {language === "ar"
                            ? "تعقيد التكامل"
                            : "Integration Complexity"}
                        </h4>
                        <p>
                          {language === "ar"
                            ? "الحل: استخدم نهجًا تدريجيًا وقم بتوثيق التبعيات بين الأنظمة."
                            : "Solution: Use an incremental approach and document dependencies between systems."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
