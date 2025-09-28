"use client";

import MainLayout from "@/components/layouts/main-layout";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Menu,
  Map,
  ChevronRight,
  Building2,
  Calendar,
  Zap,
  Target,
  Layers,
  Network,
  Lock,
  Eye,
  TrendingUp,
  Star,
  Clock,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface Subsection {
  title: string;
  path: string;
  icon?: any;
  description?: string;
}

interface SitemapSection {
  title: string;
  icon: any;
  path: string;
  description: string;
  color: string;
  bgColor: string;
  gradient: string;
  subsections?: Subsection[];
}

export default function SitemapPage() {
  const { language, isRtl, t } = useLanguage();

  const sitemapData: Record<string, SitemapSection> = {
    main: {
      title: language === "ar" ? "الصفحة الرئيسية" : "Home",
      icon: Home,
      path: "/",
      description: language === "ar" ? "الصفحة الرئيسية للموقع" : "Main homepage",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600"
    },
    awareness: {
      title: language === "ar" ? "التوعية" : "Awareness",
      icon: Users,
      path: "/advanced/awareness",
      description: language === "ar" ? "نشرات التوعية والمقالات والأخبار" : "Awareness bulletins, articles, and news",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      gradient: "from-orange-500 to-orange-600",
      subsections: [
        { title: language === "ar" ? "الأخبار" : "News", path: "/advanced/news", icon: Newspaper, description: language === "ar" ? "آخر الأخبار الأمنية" : "Latest security news" },
        { title: language === "ar" ? "نشرات التوعية" : "Awareness Bulletins", path: "/advanced/awareness", icon: AlertTriangle, description: language === "ar" ? "نشرات التوعية الأمنية" : "Security awareness bulletins" },
        { title: language === "ar" ? "المقالات" : "Articles", path: "/advanced/articles", icon: FileText, description: language === "ar" ? "مقالات متخصصة" : "Specialized articles" },
        { title: language === "ar" ? "سنوات التوعية" : "Awareness Years", path: "/advanced/awareness/years", icon: Calendar, description: language === "ar" ? "أرشيف سنوات التوعية" : "Awareness years archive" }
      ]
    },
    securityRequirements: {
      title: language === "ar" ? "متطلبات الأمن" : "Security Requirements",
      icon: Shield,
      path: "/advanced/instructions/category",
      description: language === "ar" ? "التعليمات والإجراءات الأمنية" : "Security instructions and procedures",
      color: "text-green-600",
      bgColor: "bg-green-50",
      gradient: "from-green-500 to-green-600",
      subsections: [
        { title: language === "ar" ? "التعليمات" : "Instructions", path: "/advanced/instructions/category", icon: FileText, description: language === "ar" ? "تعليمات الأمن السيبراني" : "Cybersecurity instructions" },
        { title: language === "ar" ? "الإجراءات الأمنية" : "Security Procedures", path: "/advanced/procedures", icon: Settings, description: language === "ar" ? "إجراءات تنفيذية" : "Executive procedures" },
        { title: language === "ar" ? "الحماية الشخصية" : "Personal Protection", path: "/advanced/personal-protect", icon: Lock, description: language === "ar" ? "إجراءات الحماية الشخصية" : "Personal protection procedures" }
      ]
    },
    cybersecurityConcepts: {
      title: language === "ar" ? "مفاهيم الأمن السيبراني" : "Cybersecurity Concepts",
      icon: BookOpen,
      path: "/advanced/definitions",
      description: language === "ar" ? "التعريفات والقوانين والمعايير" : "Definitions, laws, and standards",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      gradient: "from-purple-500 to-purple-600",
      subsections: [
        { title: language === "ar" ? "التعريفات" : "Definitions", path: "/advanced/definitions", icon: BookOpen, description: language === "ar" ? "مصطلحات الأمن السيبراني" : "Cybersecurity terms" },
        { title: language === "ar" ? "القوانين واللوائح" : "Laws & Regulations", path: "/advanced/laws", icon: Scale, description: language === "ar" ? "القوانين التنفيذية" : "Executive laws" },
        { title: language === "ar" ? "التنظيم" : "Regulation", path: "/advanced/regulation", icon: Settings, description: language === "ar" ? "الإطار التنظيمي" : "Regulatory framework" },
        { title: language === "ar" ? "إطار العمل" : "Framework", path: "/advanced/framework", icon: Building2, description: language === "ar" ? "إطار العمل الشامل" : "Comprehensive framework" },
        { title: language === "ar" ? "المعايير" : "Standards", path: "/advanced/standards", icon: CheckCircle, description: language === "ar" ? "المعايير المعتمدة" : "Approved standards" }
      ]
    },
    documentLibrary: {
      title: language === "ar" ? "المكتبة الوثائقية" : "Document Library",
      icon: FileText,
      path: "/advanced/videos",
      description: language === "ar" ? "الفيديوهات والمحاضرات والعروض" : "Videos, lectures, and presentations",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      gradient: "from-cyan-500 to-cyan-600",
      subsections: [
        { title: language === "ar" ? "الفيديوهات" : "Videos", path: "/advanced/videos", icon: Play, description: language === "ar" ? "مقاطع فيديو تعليمية" : "Educational videos" },
        { title: language === "ar" ? "المحاضرات" : "Lectures", path: "/advanced/lectures", icon: GraduationCap, description: language === "ar" ? "محاضرات متخصصة" : "Specialized lectures" },
        { title: language === "ar" ? "العروض التقديمية" : "Presentations", path: "/advanced/presentations", icon: Presentation, description: language === "ar" ? "عروض تقديمية" : "Presentations" }
      ]
    },
    procedures: {
      title: language === "ar" ? "الإجراءات الأمنية" : "Security Procedures",
      icon: Settings,
      path: "/advanced/procedures",
      description: language === "ar" ? "الإجراءات والضوابط والضمانات" : "Procedures, controls, and safeguards",
      color: "text-red-600",
      bgColor: "bg-red-50",
      gradient: "from-red-500 to-red-600",
      subsections: [
        { title: language === "ar" ? "الإجراءات" : "Procedures", path: "/advanced/procedures", icon: Settings, description: language === "ar" ? "الإجراءات الأمنية" : "Security procedures" },
        { title: language === "ar" ? "الضوابط" : "Controls", path: "/advanced/procedures", icon: Shield, description: language === "ar" ? "ضوابط الإجراءات" : "Procedure controls" },
        { title: language === "ar" ? "الضمانات" : "Safeguards", path: "/advanced/procedures", icon: ShieldCheck, description: language === "ar" ? "ضمانات الحماية" : "Protection safeguards" }
      ]
    },
    systems: {
      title: language === "ar" ? "الأنظمة" : "Systems",
      icon: Database,
      path: "/advanced/systems",
      description: language === "ar" ? "المنظومات الرئيسية والمساعدة" : "Main and helper systems",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      gradient: "from-indigo-500 to-indigo-600",
      subsections: [
        { title: language === "ar" ? "المنظومات الرئيسية" : "Main Systems", path: "/advanced/systems", icon: Database, description: language === "ar" ? "الأنظمة الأساسية" : "Core systems" },
        { title: language === "ar" ? "الأنظمة المساعدة" : "Helper Systems", path: "/advanced/helper-systems", icon: Settings, description: language === "ar" ? "أنظمة الدعم" : "Support systems" }
      ]
    }
  };

  const mainSections = Object.values(sitemapData);

  const totalStats = {
    sections: mainSections.length,
    subsections: mainSections.reduce((sum, section) => sum + (section.subsections?.length || 0), 0)
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-blue-950/30 dark:via-slate-900 dark:to-purple-950/30">
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.3),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.02)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
        </div>
        
        <div className="relative pt-36 pb-16">
          <div className="container mx-auto px-4">
            {/* Enhanced Hero Header */}
            <div className="text-center mb-16">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-30 dark:opacity-40 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-full shadow-2xl shadow-blue-500/30">
                  <Map className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                {language === "ar" ? "خريطة الموقع" : "Site Map"}
              </h1>
              
              <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 dark:border-blue-800/30 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {language === "ar" 
                      ? "استكشف جميع صفحات ومحتويات بوابة الأمن السيبراني بطريقة منظمة ومرتبة. تصفح المحتوى بسهولة ووضوح"
                      : "Explore all pages and content of the cybersecurity portal in an organized and structured way. Browse content with ease and clarity"
                    }
                  </p>
                </div>
              </div>

              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 dark:border-blue-800/30 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">{totalStats.sections}</div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    {language === "ar" ? "المجموعات الرئيسية" : "Main Groups"}
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-200/30 dark:border-purple-800/30 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 transition-all duration-300">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-3">{totalStats.subsections}</div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    {language === "ar" ? "الصفحات الفرعية" : "Sub Pages"}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {mainSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
                    {/* Header with Gradient */}
                    <div className={`bg-gradient-to-r ${section.gradient} p-6 text-white relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            <div className="p-3 bg-white/20 dark:bg-white/30 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="h-8 w-8" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{section.title}</h3>
                              <p className="text-white/90 dark:text-white/80 text-sm">{section.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 bg-white/80 dark:bg-slate-800/80">
                      {/* Main Action Button */}
                      <Link href={section.path} className="block mb-6">
                        <Button className={`w-full bg-gradient-to-r ${section.gradient} hover:opacity-90 text-white border-0 group/btn`}>
                          <span className="mr-2">{language === "ar" ? "زيارة الصفحة" : "Visit Page"}</span>
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      
                      {/* Subsections */}
                      {section.subsections && (
                        <div>
                          <div className="flex items-center mb-4">
                            <Layers className="h-5 w-5 text-slate-500 dark:text-slate-400 mr-2" />
                            <h4 className="font-semibold text-slate-700 dark:text-slate-200">
                              {language === "ar" ? "الأقسام الفرعية" : "Subsections"}
                            </h4>
                            <Badge variant="secondary" className="ml-auto bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                              {section.subsections.length}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            {section.subsections.map((subsection, subIndex) => {
                              const SubIcon = subsection.icon;
                              return (
                                <Link
                                  key={subIndex}
                                  href={subsection.path}
                                  className="flex items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group/sub"
                                >
                                  <div className={`p-2 rounded-lg ${section.bgColor} dark:bg-slate-700/50 mr-3 group-hover/sub:scale-110 transition-transform`}>
                                    <SubIcon className={`h-4 w-4 ${section.color} dark:text-white`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-slate-700 dark:text-slate-200 group-hover/sub:text-slate-900 dark:group-hover/sub:text-white">
                                      {subsection.title}
                                    </div>
                                    {subsection.description && (
                                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {subsection.description}
                                      </div>
                                    )}
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-1 transition-all" />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white text-center mb-16">
              <h3 className="text-2xl font-bold mb-4">
                {language === "ar" ? "روابط سريعة" : "Quick Actions"}
              </h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                {language === "ar" 
                  ? "الوصول السريع إلى الأقسام الأكثر استخداماً في البوابة"
                  : "Quick access to the most frequently used sections of the portal"
                }
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/advanced/search">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Search className="h-5 w-5 mr-2" />
                    {language === "ar" ? "البحث المتقدم" : "Advanced Search"}
                  </Button>
                </Link>
                <Link href="/simple">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Users className="h-5 w-5 mr-2" />
                    {language === "ar" ? "واجهة المبتدئين": "Simple Mode"}
                  </Button>
                </Link>
                <Link href="/advanced/news">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Newspaper className="h-5 w-5 mr-2" />
                    {language === "ar" ? "الأخبار" : "News"}
                  </Button>
                </Link>
                <Link href="/advanced/definitions">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {language === "ar" ? "التعريفات" : "Definitions"}
                  </Button>
                </Link>
                <Link href="/advanced/videos">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Play className="h-5 w-5 mr-2" />
                    {language === "ar" ? "الفيديوهات" : "Videos"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="text-center">
              <Card className="max-w-2xl mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-slate-900/50">
                <CardContent className="pt-8 pb-8">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30 dark:opacity-40"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                    {language === "ar" ? "بوابة الأمن السيبراني" : "Cybersecurity Portal"}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {language === "ar" 
                      ? "منصة شاملة للأمن السيبراني توفر المعرفة والأدوات والموارد اللازمة لحماية البنية التحتية الرقمية وتعزيز الوعي الأمني"
                      : "A comprehensive cybersecurity platform providing knowledge, tools, and resources to protect digital infrastructure and enhance security awareness"
                    }
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/advanced">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white border-0">
                        <Home className="h-5 w-5 mr-2" />
                        {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
                      </Button>
                    </Link>
                    <Link href="/simple">
                      <Button variant="outline" className="border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-700 text-green-700 dark:text-green-200">
                        <Users className="h-5 w-5 mr-2" />
                        {language === "ar" ? "واجهة المبتدئين" : "Simple Mode"}
                      </Button>
                    </Link>
                    <Link href="/advanced/search">
                      <Button variant="outline" className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
                        <Search className="h-5 w-5 mr-2" />
                        {language === "ar" ? "البحث المتقدم" : "Advanced Search"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
