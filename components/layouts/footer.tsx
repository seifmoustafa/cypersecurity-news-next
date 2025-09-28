"use client";

import { useLanguage } from "@/components/language-provider";
import { 
  ArrowRight, 
  ArrowLeft,
  Map, 
  Mail, 
  Phone, 
  Globe, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  ChevronRight,
  ChevronLeft,
  Building2,
  Users,
  BookOpen,
  Settings,
  FileText,
  Play,
  GraduationCap,
  Presentation,
  Scale,
  Database,
  AlertTriangle,
  CheckCircle,
  Home,
  Search,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const footerSections = [
    {
      title: language === "ar" ? "التوعية" : "Awareness",
      icon: Users,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      links: [
        { title: language === "ar" ? "الرئيسية" : "Home", href: "/advanced", icon: Home },
        { title: language === "ar" ? "الأخبار" : "News", href: "/advanced/news", icon: AlertTriangle },
        { title: language === "ar" ? "التوعية للعام الحالي" : "Awareness current year", href: "/advanced/awareness", icon: Users },
        { title: language === "ar" ? "المقالات" : "Articles", href: "/advanced/articles", icon: FileText },
        { title: language === "ar" ? "سنوات التوعية" : "Awareness Years", href: "/advanced/awareness/years", icon: Calendar }
      ]
    },
    {
      title: language === "ar" ? "متطلبات الأمن" : "Security Requirements",
      icon: Settings,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      links: [
        { title: language === "ar" ? "التعليمات" : "Instructions", href: "/advanced/instructions/category", icon: FileText },
        { title: language === "ar" ? "الإجراءات الأمنية" : "Security Procedures", href: "/advanced/procedures", icon: Settings },
        { title: language === "ar" ? "الحماية الشخصية" : "Personal Protection", href: "/advanced/personal-protect", icon: Settings }
      ]
    },
    {
      title: language === "ar" ? "مفاهيم الأمن السيبراني" : "Cybersecurity Concepts",
      icon: BookOpen,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      links: [
        { title: language === "ar" ? "المفاهيم" : "Definitions", href: "/advanced/definitions", icon: BookOpen },
        { title: language === "ar" ? "القوانين واللوائح" : "Laws & Regulations", href: "/advanced/laws", icon: Scale },
        { title: language === "ar" ? "التنظيم" : "Regulation", href: "/advanced/regulation", icon: Settings },
        { title: language === "ar" ? "إطار العمل" : "Framework", href: "/advanced/framework", icon: Building2 },
        { title: language === "ar" ? "المعايير" : "Standards", href: "/advanced/standards", icon: CheckCircle }
      ]
    },
    {
      title: language === "ar" ? "المكتبة والأنظمة" : "Library & Systems",
      icon: Database,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      links: [
        { title: language === "ar" ? "الفيديوهات" : "Videos", href: "/advanced/videos", icon: Play },
        { title: language === "ar" ? "المحاضرات" : "Lectures", href: "/advanced/lectures", icon: GraduationCap },
        { title: language === "ar" ? "العروض التقديمية" : "Presentations", href: "/advanced/presentations", icon: Presentation },
        { title: language === "ar" ? "المنظومات الرئيسية" : "Main Systems", href: "/advanced/systems", icon: Database },
        { title: language === "ar" ? "الأنظمة المساعدة" : "Helper Systems", href: "/advanced/helper-systems", icon: Settings }
      ]
    },
    {
      title: language === "ar" ? "الإجراءات الأمنية" : "Security Procedures",
      icon: Settings,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      links: [
        { title: language === "ar" ? "الإجراءات" : "Procedures", href: "/advanced/procedures", icon: Settings },
        { title: language === "ar" ? "الضوابط" : "Controls", href: "/advanced/procedures", icon: Settings },
        { title: language === "ar" ? "الضمانات" : "Safeguards", href: "/advanced/procedures", icon: Settings }
      ]
    }
  ];

  const quickLinks = [
    { title: language === "ar" ? "خريطة الموقع" : "Site Map", href: "/advanced/sitemap", icon: Map },
    { title: language === "ar" ? "البحث المتقدم" : "Advanced Search", href: "/advanced/search", icon: Search },
    { title: language === "ar" ? "واجهة المبتدئين" : "Simple Mode", href: "/simple", icon: Users },
    { title: language === "ar" ? "الرئيسية" : "Home", href: "/advanced", icon: Home }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-500" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-500" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-600" },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-500" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white overflow-hidden">
      {/* Light mode background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:hidden"></div>
      
      {/* Dark mode background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
      </div>

      {/* Light mode background pattern */}
      <div className="absolute inset-0 opacity-20 dark:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.08),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.03)_50%,transparent_75%)] bg-[length:30px_30px]"></div>
      </div>

      <div className="relative z-10">
        {/* Top Section - Main Content */}
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/app-icon.png"
                alt="Cybersecurity Portal"
                className="h-12 w-12 object-contain mx-4"
              />
              <h2 className="ml-4 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                {language === "ar" ? "بوابة الأمن السيبراني" : "Cybersecurity Portal"}
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
              {language === "ar"
                ? "منصة شاملة للأمن السيبراني توفر المعرفة والأدوات والموارد اللازمة لحماية البنية التحتية الرقمية وتعزيز الوعي الأمني"
                : "A comprehensive cybersecurity platform providing knowledge, tools, and resources to protect digital infrastructure and enhance security awareness"}
            </p>
          </div>

          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {footerSections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={index} className="group">
                  <div className="flex items-center mb-6">
                    <div className={`p-3 rounded-xl ${section.bgColor} dark:bg-slate-700/50 mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <IconComponent className={`h-6 w-6 ${section.color}`} />
                    </div>
                    <h3 className={`font-bold text-xl ${section.color} group-hover:scale-105 transition-transform duration-300`}>
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => {
                      const LinkIcon = link.icon;
                      return (
                        <li key={linkIndex}>
                          <Link 
                            href={link.href}
                            className="flex items-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all duration-300 group/link py-2 px-3 rounded-lg hover:bg-white/60 dark:hover:bg-white/5 shadow-sm hover:shadow-md"
                          >
                            <LinkIcon className={`h-4 w-4 mr-3 rtl:mr-0 rtl:ml-3 text-slate-600 dark:text-slate-400 group-hover/link:text-blue-600 dark:group-hover/link:text-white transition-colors duration-300`} />
                            <span className="text-sm font-medium">{link.title}</span>
                            {isRtl ? (
                              <ChevronLeft className="h-4 w-4 mr-auto opacity-0 group-hover/link:opacity-100 group-hover/link:-translate-x-1 transition-all duration-300" />
                            ) : (
                              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Quick Links Section */}
          <div className="bg-gradient-to-r from-white/90 to-blue-50/90 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-8 mb-12 backdrop-blur-sm border border-blue-200/50 dark:border-slate-700/50 shadow-lg">
            <h3 className="text-xl font-bold text-center mb-6 text-slate-800 dark:text-white">
              {language === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {quickLinks.map((link, index) => {
                const LinkIcon = link.icon;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center px-6 py-3 bg-white dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-white/20 rounded-xl transition-all duration-300 group border border-blue-200/50 dark:border-white/10 hover:border-blue-300 dark:hover:border-white/20 shadow-sm hover:shadow-md"
                  >
                    <LinkIcon className={`h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300`} />
                    <span className="font-medium text-slate-700 dark:text-slate-200">{link.title}</span>
                    {isRtl ? (
                      <ArrowLeft className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                    ) : (
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex justify-center mb-12">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
                {language === "ar" ? "معلومات الاتصال" : "Contact Information"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <Building2 className={`h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 rtl:mr-0 rtl:ml-3`} />
                  <span className="text-slate-700 dark:text-white">
                    {language === "ar" ? "مركز التأمين الفني MMC" : "Technical Insurance Center MMC"}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <Mail className={`h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 rtl:mr-0 rtl:ml-3`} />
                  <span className="text-slate-700 dark:text-white">info@cybersecurity.gov</span>
                </div>
                <div className="flex items-center justify-center">
                  <Phone className={`h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 rtl:mr-0 rtl:ml-3`} />
                  <span className="text-slate-700 dark:text-white">+966 11 123 4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-center md:text-right rtl:md:text-left">
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {language === "ar"
                    ? "حقوق النشر © 2025 / مركز التأمين الفني MMC جميع الحقوق محفوظة"
                    : "Copyright © 2025 / Technical Insurance Center MMC. All rights reserved"}
                </p>
              </div>
              
              {/* Additional Links */}
              <div className="flex items-center space-x-6 rtl:space-x-reverse">
                <Link 
                  href="/advanced/sitemap"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium flex items-center group"
                >
                  <Map className={`h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2`} />
                  {language === "ar" ? "خريطة الموقع" : "Site Map"}
                </Link>
                <div className="w-px h-4 bg-blue-200 dark:bg-slate-600"></div>
                <Link 
                  href="/advanced"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium flex items-center group"
                >
                  <Home className={`h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2`} />
                  {language === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
