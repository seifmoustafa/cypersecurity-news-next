"use client"

import { frameworkData } from "@/data/standards-hierarchy-data"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

export default function FrameworkPage() {
  const { language, isRtl } = useLanguage()
  const router = useRouter()
  const [activeFunction, setActiveFunction] = useState("identify")

  useEffect(() => {
    // Prefetch domain pages
    frameworkData.domains.forEach((domain) => {
      router.prefetch(`/framework/${domain.id}`)
    })

    // Handle hash navigation
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1)
      if (hash && ["identify", "protect", "detect", "respond", "recover"].includes(hash)) {
        setActiveFunction(hash)

        // Scroll to the section after a short delay
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ behavior: "smooth" })
          }
        }, 300)
      }
    }
  }, [router])

  const frameworkFunctions = [
    {
      id: "identify",
      title: {
        ar: "تحديد",
        en: "Identify",
      },
      color: "bg-blue-500",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
      description: {
        ar: "تطوير فهم تنظيمي لإدارة مخاطر الأمن السيبراني للأنظمة والأصول والبيانات والقدرات.",
        en: "Develop organizational understanding to manage cybersecurity risks to systems, people, assets, data, and capabilities.",
      },
      categories: [
        {
          id: "asset-management",
          name: {
            ar: "إدارة الأصول",
            en: "Asset Management",
          },
          description: {
            ar: "البيانات والأجهزة والأنظمة والمرافق التي تمكن المؤسسة من تحقيق أهداف العمل يتم تحديدها وإدارتها بما يتناسب مع أهميتها النسبية للأهداف التنظيمية والاستراتيجية المخاطر للمؤسسة.",
            en: "The data, devices, systems, and facilities that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization's risk strategy.",
          },
        },
        {
          id: "business-environment",
          name: {
            ar: "بيئة العمل",
            en: "Business Environment",
          },
          description: {
            ar: "يتم فهم مهمة المؤسسة وأهدافها وأصحاب المصلحة والأنشطة وتحديد أولوياتها؛ تستخدم هذه المعلومات لإبلاغ أدوار الأمن السيبراني والمسؤوليات وقرارات إدارة مخاطر الأمن السيبراني.",
            en: "The organization's mission, objectives, stakeholders, and activities are understood and prioritized; this information is used to inform cybersecurity roles, responsibilities, and risk management decisions.",
          },
        },
        {
          id: "governance",
          name: {
            ar: "الحوكمة",
            en: "Governance",
          },
          description: {
            ar: "يتم فهم السياسات والإجراءات والعمليات لإدارة وتحديد المخاطر الأمنية السيبرانية وتوثيقها.",
            en: "The policies, procedures, and processes to manage and monitor the organization's regulatory, legal, risk, environmental, and operational requirements are understood and inform the management of cybersecurity risk.",
          },
        },
        {
          id: "risk-assessment",
          name: {
            ar: "تقييم المخاطر",
            en: "Risk Assessment",
          },
          description: {
            ar: "تفهم المؤسسة المخاطر السيبرانية على عملياتها (بما في ذلك المهمة والوظائف والصورة أو السمعة) وأصولها التنظيمية والأفراد.",
            en: "The organization understands the cybersecurity risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals.",
          },
        },
        {
          id: "risk-management-strategy",
          name: {
            ar: "استراتيجية إدارة المخاطر",
            en: "Risk Management Strategy",
          },
          description: {
            ar: "يتم تحديد أولويات المؤسسة وقيودها وتسامحها مع المخاطر وافتراضاتها وتستخدم لدعم قرارات المخاطر التشغيلية.",
            en: "The organization's priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions.",
          },
        },
      ],
    },
    {
      id: "protect",
      title: {
        ar: "حماية",
        en: "Protect",
      },
      color: "bg-purple-600",
      textColor: "text-purple-600",
      borderColor: "border-purple-600",
      description: {
        ar: "تطوير وتنفيذ الضمانات المناسبة لضمان تقديم الخدمات الحيوية.",
        en: "Develop and implement appropriate safeguards to ensure delivery of critical services.",
      },
      categories: [
        {
          id: "access-control",
          name: {
            ar: "التحكم في الوصول",
            en: "Access Control",
          },
          description: {
            ar: "يتم تقييد الوصول إلى الأصول والمرافق المرتبطة بها ويتم إدارته بما يتفق مع المخاطر المقبولة.",
            en: "Access to physical and logical assets and associated facilities is limited to authorized users, processes, and devices, and is managed consistent with the assessed risk of unauthorized access.",
          },
        },
        {
          id: "awareness-training",
          name: {
            ar: "التوعية والتدريب",
            en: "Awareness and Training",
          },
          description: {
            ar: "يتم توفير التعليم والتدريب للموظفين والشركاء لأداء واجباتهم ومسؤولياتهم المتعلقة بالأمن السيبراني بما يتماشى مع السياسات والإجراءات والاتفاقيات ذات الصلة.",
            en: "The organization's personnel and partners are provided cybersecurity awareness education and are trained to perform their cybersecurity-related duties and responsibilities consistent with related policies, procedures, and agreements.",
          },
        },
        {
          id: "data-security",
          name: {
            ar: "أمن البيانات",
            en: "Data Security",
          },
          description: {
            ar: "تتم إدارة المعلومات والسجلات (البيانات) بما يتفق مع استراتيجية المؤسسة لإدارة المخاطر لحماية سرية المعلومات وسلامتها وتوافرها.",
            en: "Information and records (data) are managed consistent with the organization's risk strategy to protect the confidentiality, integrity, and availability of information.",
          },
        },
        {
          id: "info-protection",
          name: {
            ar: "عمليات وإجراءات حماية المعلومات",
            en: "Info Protection Processes and Procedures",
          },
          description: {
            ar: "يتم الحفاظ على سياسات الأمن (تتناول الغرض والنطاق والأدوار والمسؤوليات والالتزام الإداري والتنسيق بين كيانات المؤسسة) والعمليات والإجراءات وتستخدم لإدارة حماية أنظمة المعلومات والأصول.",
            en: "Security policies (that address purpose, scope, roles, responsibilities, management commitment, and coordination among organizational entities), processes, and procedures are maintained and used to manage protection of information systems and assets.",
          },
        },
        {
          id: "maintenance",
          name: {
            ar: "الصيانة",
            en: "Maintenance",
          },
          description: {
            ar: "يتم إجراء صيانة وإصلاحات لمكونات نظام التحكم الصناعي والمعلومات بما يتفق مع السياسات والإجراءات.",
            en: "Maintenance and repairs of industrial control and information system components are performed consistent with policies and procedures.",
          },
        },
        {
          id: "protective-technology",
          name: {
            ar: "التكنولوجيا الوقائية",
            en: "Protective Technology",
          },
          description: {
            ar: "يتم تشغيل الحلول التقنية الأمنية وإدارتها لضمان أمن وصمود الأنظمة والأصول، بما يتفق مع السياسات والإجراءات والاتفاقيات ذات الصلة.",
            en: "Technical security solutions are managed to ensure the security and resilience of systems and assets, consistent with related policies, procedures, and agreements.",
          },
        },
      ],
    },
    {
      id: "detect",
      title: {
        ar: "كشف",
        en: "Detect",
      },
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
      borderColor: "border-yellow-500",
      description: {
        ar: "تطوير وتنفيذ الأنشطة المناسبة للكشف عن وقوع حدث أمني سيبراني.",
        en: "Develop and implement appropriate activities to identify the occurrence of a cybersecurity event.",
      },
      categories: [
        {
          id: "anomalies-events",
          name: {
            ar: "الشذوذ والأحداث",
            en: "Anomalies and Events",
          },
          description: {
            ar: "يتم اكتشاف النشاط الشاذ في الوقت المناسب وفهم التأثير المحتمل للأحداث.",
            en: "Anomalous activity is detected and the potential impact of events is understood.",
          },
        },
        {
          id: "security-monitoring",
          name: {
            ar: "المراقبة الأمنية المستمرة",
            en: "Security Continuous Monitoring",
          },
          description: {
            ar: "تتم مراقبة نظام المعلومات والأصول في فترات زمنية محددة للتعرف على الأحداث الأمنية السيبرانية والتحقق من فعالية تدابير الحماية.",
            en: "The information system and assets are monitored to identify cybersecurity events and verify the effectiveness of protective measures.",
          },
        },
        {
          id: "detection-processes",
          name: {
            ar: "عمليات الكشف",
            en: "Detection Processes",
          },
          description: {
            ar: "يتم الحفاظ على عمليات وإجراءات الكشف واختبارها لضمان الوعي في الوقت المناسب بالأحداث الشاذة.",
            en: "Detection processes and procedures are maintained and tested to ensure awareness of anomalous events.",
          },
        },
      ],
    },
    {
      id: "respond",
      title: {
        ar: "استجابة",
        en: "Respond",
      },
      color: "bg-red-600",
      textColor: "text-red-600",
      borderColor: "border-red-600",
      description: {
        ar: "تطوير وتنفيذ الأنشطة المناسبة لاتخاذ إجراءات بشأن حدث أمني سيبراني تم اكتشافه.",
        en: "Develop and implement appropriate activities to take action regarding a detected cybersecurity incident.",
      },
      categories: [
        {
          id: "response-planning",
          name: {
            ar: "تخطيط الاستجابة",
            en: "Response Planning",
          },
          description: {
            ar: "يتم تنفيذ عمليات وإجراءات الاستجابة وصيانتها للتأكد من الاستجابة في الوقت المناسب للأحداث الأمنية السيبرانية المكتشفة.",
            en: "Response processes and procedures are executed and maintained, to ensure response to detected cybersecurity incidents.",
          },
        },
        {
          id: "communications",
          name: {
            ar: "الاتصالات",
            en: "Communications",
          },
          description: {
            ar: "يتم تنسيق أنشطة الاستجابة مع أصحاب المصلحة الداخليين والخارجيين (مثل الدعم الخارجي من وكالات إنفاذ القانون).",
            en: "Response activities are coordinated with internal and external stakeholders (e.g. external support from law enforcement agencies).",
          },
        },
        {
          id: "analysis",
          name: {
            ar: "التحليل",
            en: "Analysis",
          },
          description: {
            ar: "يتم إجراء التحليل لضمان استجابة فعالة واستعادة الدعم.",
            en: "Analysis is conducted to ensure effective response and support recovery activities.",
          },
        },
        {
          id: "mitigation",
          name: {
            ar: "التخفيف",
            en: "Mitigation",
          },
          description: {
            ar: "يتم تنفيذ الأنشطة لمنع توسع الحدث، وتخفيف آثاره، وحل الحادث.",
            en: "Activities are performed to prevent expansion of an event, mitigate its effects, and resolve the incident.",
          },
        },
        {
          id: "improvements",
          name: {
            ar: "التحسينات",
            en: "Improvements",
          },
          description: {
            ar: "يتم تحسين أنشطة استجابة المؤسسة من خلال دمج الدروس المستفادة من أنشطة الكشف/الاستجابة الحالية والسابقة.",
            en: "Organizational response activities are improved by incorporating lessons learned from current and previous detection/response activities.",
          },
        },
      ],
    },
    {
      id: "recover",
      title: {
        ar: "تعافي",
        en: "Recover",
      },
      color: "bg-green-500",
      textColor: "text-green-500",
      borderColor: "border-green-500",
      description: {
        ar: "تطوير وتنفيذ الأنشطة المناسبة للحفاظ على خطط المرونة واستعادة أي قدرات أو خدمات تضررت بسبب حدث أمني سيبراني.",
        en: "Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity incident.",
      },
      categories: [
        {
          id: "recovery-planning",
          name: {
            ar: "تخطيط التعافي",
            en: "Recovery Planning",
          },
          description: {
            ar: "يتم تنفيذ عمليات وإجراءات الاستعادة وصيانتها لضمان استعادة الأنظمة أو الأصول المتأثرة بحوادث الأمن السيبراني.",
            en: "Recovery processes and procedures are executed and maintained to ensure restoration of systems or assets affected by cybersecurity incidents.",
          },
        },
        {
          id: "recovery-improvements",
          name: {
            ar: "التحسينات",
            en: "Improvements",
          },
          description: {
            ar: "يتم تحسين تخطيط وعمليات الاستعادة من خلال دمج الدروس المستفادة في الأنشطة المستقبلية.",
            en: "Recovery planning and processes are improved by incorporating lessons learned into future activities.",
          },
        },
        {
          id: "recovery-communications",
          name: {
            ar: "الاتصالات",
            en: "Communications",
          },
          description: {
            ar: "يتم تنسيق أنشطة الاستعادة مع الأطراف الداخلية والخارجية (مثل مراكز التنسيق وأصحاب الأنظمة المتأثرة والمالكين والموردين والشركاء).",
            en: "Recovery activities are coordinated with internal and external parties (e.g. coordinating centers, Internet Service Providers, owners of attacking systems, victims, other CSIRTs, and vendors).",
          },
        },
      ],
    },
  ]

  // Framework implementation steps
  const implementationSteps = [
    {
      step: 1,
      title: {
        ar: "تحديد النطاق",
        en: "Determine Scope",
      },
      description: {
        ar: "تحديد الأنظمة والأصول الحرجة التي تحتاج إلى حماية",
        en: "Identify critical systems and assets that need protection",
      },
    },
    {
      step: 2,
      title: {
        ar: "تحديد الملف التعريفي المستهدف",
        en: "Define Target Profile",
      },
      description: {
        ar: "تحديد الأهداف الأمنية المرجوة والنتائج المطلوبة",
        en: "Define desired security outcomes and objectives",
      },
    },
    {
      step: 3,
      title: {
        ar: "إنشاء ملف تعريف حالي",
        en: "Create Current Profile",
      },
      description: {
        ar: "تقييم الوضع الحالي للأمن السيبراني في المؤسسة",
        en: "Assess the current state of cybersecurity in the organization",
      },
    },
    {
      step: 4,
      title: {
        ar: "تحليل الفجوات",
        en: "Conduct Gap Analysis",
      },
      description: {
        ar: "مقارنة الملف الحالي بالملف المستهدف لتحديد الفجوات",
        en: "Compare current profile to target profile to identify gaps",
      },
    },
    {
      step: 5,
      title: {
        ar: "تنفيذ خطة العمل",
        en: "Implement Action Plan",
      },
      description: {
        ar: "تطوير وتنفيذ خطة لمعالجة الفجوات المحددة",
        en: "Develop and implement a plan to address identified gaps",
      },
    },
  ]

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === "ar" ? "إطار عمل الأمن السيبراني" : "Cybersecurity Framework"}
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
                <div className={`prose dark:prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}>
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
              {language === "ar" ? "الوظائف الأساسية للإطار" : "Core Framework Functions"}
            </h2>

            {/* Framework Diagram */}
            <div className="flex justify-center mb-12">
              <div className="relative w-full max-w-2xl">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dI27cBudyF5803ufbRQIQ74OVrIoKr.png"
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
                    activeFunction === func.id ? func.color + " text-white" : "bg-muted"
                  } transition-all duration-300 w-full sm:w-auto flex-1 max-w-xs`}
                  onClick={() => {
                    setActiveFunction(func.id)
                    document.getElementById(func.id)?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{func.title[language]}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Framework Function Details */}
            {frameworkFunctions.map((func) => (
              <div
                key={func.id}
                id={func.id}
                className={`mb-12 scroll-mt-24 ${activeFunction === func.id ? "opacity-100" : "opacity-70"} transition-opacity duration-300`}
              >
                <Card className={`border-2 ${func.borderColor}`}>
                  <CardHeader className={func.color}>
                    <CardTitle className="text-2xl text-white">{func.title[language]}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className={`prose dark:prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}>
                      <p className="text-lg mb-6">{func.description[language]}</p>

                      <h3 className={`text-xl font-semibold mb-4 ${func.textColor}`}>
                        {language === "ar" ? "الفئات" : "Categories"}
                      </h3>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className={isRtl ? "text-right" : "text-left"}>
                              {language === "ar" ? "الفئة" : "Category"}
                            </TableHead>
                            <TableHead className={isRtl ? "text-right" : "text-left"}>
                              {language === "ar" ? "الوصف" : "Description"}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {func.categories.map((category) => (
                            <TableRow key={category.id}>
                              <TableCell className={`font-medium ${func.textColor}`}>
                                {category.name[language]}
                              </TableCell>
                              <TableCell className={isRtl ? "text-right" : "text-left"}>
                                {category.description[language]}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Framework Implementation Steps */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {language === "ar" ? "خطوات تنفيذ الإطار" : "Framework Implementation Steps"}
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
                          <CardTitle className={isRtl ? "text-right" : "text-left"}>{step.title[language]}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className={isRtl ? "text-right" : "text-left"}>{step.description[language]}</p>
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
              {language === "ar" ? "فوائد تطبيق الإطار" : "Benefits of Implementing the Framework"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: { ar: "إدارة المخاطر المحسنة", en: "Improved Risk Management" },
                  description: {
                    ar: "تحديد وتقييم وإدارة مخاطر الأمن السيبراني بشكل أكثر فعالية",
                    en: "Identify, assess, and manage cybersecurity risks more effectively",
                  },
                },
                {
                  title: { ar: "تعزيز الأمن", en: "Enhanced Security" },
                  description: {
                    ar: "تحسين الموقف الأمني العام للمؤسسة وحماية الأصول الحيوية",
                    en: "Improve the overall security posture of the organization and protect critical assets",
                  },
                },
                {
                  title: { ar: "الامتثال التنظيمي", en: "Regulatory Compliance" },
                  description: {
                    ar: "المساعدة في تلبية متطلبات الامتثال التنظيمية والقانونية",
                    en: "Help meet regulatory and legal compliance requirements",
                  },
                },
                {
                  title: { ar: "تحسين الاتصال", en: "Improved Communication" },
                  description: {
                    ar: "تعزيز التواصل حول مخاطر الأمن السيبراني داخل المؤسسة وخارجها",
                    en: "Enhance communication about cybersecurity risks within and outside the organization",
                  },
                },
                {
                  title: { ar: "اتخاذ قرارات أفضل", en: "Better Decision Making" },
                  description: {
                    ar: "توفير معلومات لاتخاذ قرارات أفضل بشأن استثمارات الأمن السيبراني",
                    en: "Inform better decisions about cybersecurity investments",
                  },
                },
                {
                  title: { ar: "المرونة التنظيمية", en: "Organizational Resilience" },
                  description: {
                    ar: "تعزيز قدرة المؤسسة على التعافي من الحوادث الأمنية",
                    en: "Enhance the organization's ability to recover from security incidents",
                  },
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle
                        className={`text-xl flex items-center gap-2 ${isRtl ? "justify-end" : "justify-start"}`}
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        {benefit.title[language]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={isRtl ? "text-right" : "text-left"}>
                      <p>{benefit.description[language]}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Framework Summary Table */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {language === "ar" ? "ملخص إطار عمل الأمن السيبراني" : "Cybersecurity Framework Summary"}
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
                    {language === "ar" ? "الشذوذ والأحداث" : "Anomalies and Events"}
                  </div>

                  {/* Response Planning */}
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "تخطيط الاستجابة" : "Response Planning"}
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
                    {language === "ar" ? "التوعية والتدريب" : "Awareness and Training"}
                  </div>

                  {/* Security Continuous Monitoring */}
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-md text-sm">
                    {language === "ar" ? "المراقبة الأمنية المستمرة" : "Security Continuous Monitoring"}
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
                    {language === "ar" ? "عمليات وإجراءات حماية المعلومات" : "Info Protection Processes and Procedures"}
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
                    {language === "ar" ? "استراتيجية إدارة المخاطر" : "Risk Management Strategy"}
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
                    {language === "ar" ? "التكنولوجيا الوقائية" : "Protective Technology"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Framework Domains */}
          <h2 className="text-2xl font-bold mb-8 text-center">
            {language === "ar" ? "مجالات إطار العمل" : "Framework Domains"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworkData.domains.map((domain, index) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/framework/${domain.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"} flex items-center gap-2`}>
                        <Shield className="h-5 w-5 text-primary" />
                        {domain.title[language]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={isRtl ? "text-right" : "text-left"}>
                      <p className="text-muted-foreground mb-4">{domain.description[language]}</p>
                      <div className="space-y-2">
                        {domain.components.slice(0, 2).map((component) => (
                          <div key={component.id} className="p-2 bg-muted rounded-md">
                            <p className="font-medium">{component.title[language]}</p>
                          </div>
                        ))}
                        {domain.components.length > 2 && (
                          <div className="text-primary text-sm font-medium">
                            +{domain.components.length - 2} {language === "ar" ? "المزيد" : "more"}
                          </div>
                        )}
                      </div>
                      <div className={`mt-4 flex ${isRtl ? "justify-start" : "justify-end"}`}>
                        <span className="text-primary flex items-center text-sm font-medium">
                          {language === "ar" ? "عرض التفاصيل" : "View details"}
                          <ArrowRight className={`h-4 w-4 ${isRtl ? "mr-1 rotate-180" : "ml-1"}`} />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
