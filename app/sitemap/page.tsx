"use client";

import MainLayout from "@/components/layouts/main-layout";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  FileText, 
  BookOpen, 
  Settings, 
  Users, 
  Newspaper, 
  Play, 
  Presentation, 
  GraduationCap,
  Scale,
  Search,
  Globe,
  Database,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Home,
  Menu
} from "lucide-react";

interface Subsection {
  title: string;
  path: string;
}

interface SitemapSection {
  title: string;
  icon: any;
  path: string;
  description: string;
  subsections?: Subsection[];
}

export default function SitemapPage() {
  const { language, isRtl } = useLanguage();

  const sitemapData: Record<string, SitemapSection> = {
    main: {
      title: language === "ar" ? "الصفحة الرئيسية" : "Home",
      icon: Home,
      path: "/",
      description: language === "ar" ? "الصفحة الرئيسية للموقع" : "Main homepage"
    },
    awareness: {
      title: language === "ar" ? "التوعية" : "Awareness",
      icon: Users,
      path: "/awareness",
      description: language === "ar" ? "نشرات التوعية والمقالات" : "Awareness bulletins and articles",
      subsections: [
        { title: language === "ar" ? "الأخبار" : "News", path: "/news" },
        { title: language === "ar" ? "نشرات التوعية" : "Awareness Bulletins", path: "/awareness" },
        { title: language === "ar" ? "المقالات" : "Articles", path: "/articles" },
        { title: language === "ar" ? "سنوات التوعية" : "Awareness Years", path: "/awareness/years" }
      ]
    },
    securityRequirements: {
      title: language === "ar" ? "متطلبات الأمن" : "Security Requirements",
      icon: Shield,
      path: "/instructions",
      description: language === "ar" ? "التعليمات والإجراءات الأمنية" : "Security instructions and procedures",
      subsections: [
        { title: language === "ar" ? "التعليمات" : "Instructions", path: "/instructions" },
        { title: language === "ar" ? "الإجراءات الأمنية" : "Security Procedures", path: "/procedures" },
        { title: language === "ar" ? "فئات التعليمات" : "Instruction Categories", path: "/instructions/category" }
      ]
    },
    cybersecurityConcepts: {
      title: language === "ar" ? "مفاهيم الأمن السيبراني" : "Cybersecurity Concepts",
      icon: BookOpen,
      path: "/definitions",
      description: language === "ar" ? "التعريفات والقوانين والمعايير" : "Definitions, laws, and standards",
      subsections: [
        { title: language === "ar" ? "التعريفات" : "Definitions", path: "/definitions" },
        { title: language === "ar" ? "القوانين واللوائح" : "Laws & Regulations", path: "/laws" },
        { title: language === "ar" ? "التنظيم" : "Regulation", path: "/regulation" },
        { title: language === "ar" ? "إطار العمل" : "Framework", path: "/framework" },
        { title: language === "ar" ? "المعايير" : "Standards", path: "/standards" },
        { title: language === "ar" ? "فئات التعريفات" : "Definition Categories", path: "/definitions/category" },
        { title: language === "ar" ? "فئات القوانين" : "Law Categories", path: "/laws/category" },
        { title: language === "ar" ? "جميع اللوائح" : "All Regulations", path: "/regulation/category/all" },
        { title: language === "ar" ? "فئات اللوائح" : "Regulation Categories", path: "/regulation/category" }
      ]
    },
    documentLibrary: {
      title: language === "ar" ? "المكتبة الوثائقية" : "Document Library",
      icon: FileText,
      path: "/videos",
      description: language === "ar" ? "الفيديوهات والمحاضرات والعروض" : "Videos, lectures, and presentations",
      subsections: [
        { title: language === "ar" ? "الفيديوهات" : "Videos", path: "/videos" },
        { title: language === "ar" ? "المحاضرات" : "Lectures", path: "/lectures" },
        { title: language === "ar" ? "العروض التقديمية" : "Presentations", path: "/presentations" }
      ]
    },
    systems: {
      title: language === "ar" ? "الأنظمة" : "Systems",
      icon: Settings,
      path: "/systems",
      description: language === "ar" ? "المنظومات الرئيسية والمساعدة" : "Main and helper systems",
      subsections: [
        { title: language === "ar" ? "المنظومات الرئيسية" : "Main Systems", path: "/systems" },
        { title: language === "ar" ? "الأنظمة المساعدة" : "Helper Systems", path: "/helper-systems" }
      ]
    },
    personalProtect: {
      title: language === "ar" ? "الحماية الشخصية" : "Personal Protection",
      icon: Shield,
      path: "/personal-protect",
      description: language === "ar" ? "إجراءات الحماية الشخصية" : "Personal protection procedures"
    }
  };

  const mainSections = [
    sitemapData.main,
    sitemapData.awareness,
    sitemapData.securityRequirements,
    sitemapData.cybersecurityConcepts,
    sitemapData.documentLibrary,
    sitemapData.systems,
    sitemapData.personalProtect
  ];

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <Menu className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold">
                {language === "ar" ? "خريطة الموقع" : "Site Map"}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === "ar" 
                ? "استكشف جميع صفحات ومحتويات بوابة الأمن السيبراني بطريقة منظمة ومرتبة"
                : "Explore all pages and content of the cybersecurity portal in an organized and structured way"
              }
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary">{mainSections.length}</div>
                <div className="text-sm text-muted-foreground">
                  {language === "ar" ? "المجموعات الرئيسية" : "Main Groups"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary">18</div>
                <div className="text-sm text-muted-foreground">
                  {language === "ar" ? "الصفحات الرئيسية" : "Main Pages"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary">15</div>
                <div className="text-sm text-muted-foreground">
                  {language === "ar" ? "الصفحات الفرعية" : "Sub Pages"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">
                  {language === "ar" ? "المحتويات المتاحة" : "Available Contents"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainSections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link 
                      href={section.path}
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium mb-4 group"
                    >
                      {language === "ar" ? "زيارة الصفحة" : "Visit Page"}
                      <ArrowRight className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    
                    {section.subsections && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          {language === "ar" ? "الأقسام الفرعية:" : "Subsections:"}
                        </div>
                        {section.subsections.map((subsection: Subsection, subIndex: number) => (
                          <Link
                            key={subIndex}
                            href={subsection.path}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                          >
                            • {subsection.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Information */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {language === "ar" ? "بوابة الأمن السيبراني" : "Cybersecurity Portal"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === "ar" 
                    ? "منصة شاملة للأمن السيبراني توفر المعرفة والأدوات والموارد اللازمة لحماية البنية التحتية الرقمية"
                    : "A comprehensive cybersecurity platform providing knowledge, tools, and resources to protect digital infrastructure"
                  }
                </p>
                <Link 
                  href="/"
                  className="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
                  <ArrowRight className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
