"use client";

import { useLanguage } from "@/components/language-provider";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Video,
  BookOpen,
  ShieldCheck,
  Search,
  Map,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle,
  Eye,
  Lock,
  FileText,
  Home,
} from "lucide-react";
import Link from "next/link";

export default function SimpleFooter() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";

  // Sectioned sitemap like previous style but showing only actual pages
  const footerSections = [
    {
      title: language === "ar" ? "المفاهيم" : "Definitions",
      icon: BookOpen,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
      borderColor: "border-indigo-400/20",
      links: [
        {
          title: language === "ar" ? "جميع التعريفات" : "All Definitions",
          href: "/simple/definitions-categories",
          icon: BookOpen,
        },
        {
          title: language === "ar" ? "فئات التعريفات" : "Definition Categories",
          href: "/simple/definitions-categories",
          icon: CheckCircle,
        },
      ],
    },
    {
      title: language === "ar" ? "التوعية" : "Awareness",
      icon: Eye,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20",
      links: [
        {
          title: language === "ar" ? "الأخبار" : "News",
          href: "/simple/news",
          icon: CheckCircle,
        },
        {
          title: language === "ar" ? "نشرات التوعية" : "Awareness",
          href: "/simple/awareness",
          icon: Eye,
        },
      ],
    },
    {
      title: language === "ar" ? "الحماية الشخصية" : "Personal Protection",
      icon: ShieldCheck,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
      links: [
        {
          title: language === "ar" ? "فئات الحماية" : "Protection Categories",
          href: "/simple/personal-protect",
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: language === "ar" ? "المكتبة الثقافية" : "Media",
      icon: Video,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
      links: [
        {
          title: language === "ar" ? "دروس تعليمية" : "Educational Lessons",
          href: "/simple/media/lessons",
          icon: BookOpen,
        },
        {
          title: language === "ar" ? "مقالات" : "Articles",
          href: "/simple/media/articles",
          icon: FileText,
        },
        {
          title: language === "ar" ? "مراجع" : "References",
          href: "/simple/media/references",
          icon: BookOpen,
        },
      ],
    },
  ];
  const quickLinks = [
    {
      title: language === "ar" ? "البحث" : "Search",
      href: "/simple/search",
      icon: Search,
    },
    {
      title: language === "ar" ? "خريطة الموقع" : "Site Map",
      href: "/simple/sitemap",
      icon: Map,
    },
    {
      title: language === "ar" ? "واجهة المتخصصين" : "Advanced Mode",
      href: "/advanced",
      icon: Users,
    },
    {
      title: language === "ar" ? "الصفحة الرئيسية" : "Home",
      href: "/",
      icon: Home,
    },
  ];

  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: language === "ar" ? "حماية متقدمة" : "Advanced Protection",
      description:
        language === "ar"
          ? "أنظمة حماية متطورة ضد التهديدات السيبرانية"
          : "Advanced protection systems against cyber threats",
    },
    {
      icon: Eye,
      title: language === "ar" ? "مراقبة مستمرة" : "Continuous Monitoring",
      description:
        language === "ar"
          ? "مراقبة مستمرة للأنظمة والشبكات"
          : "Continuous monitoring of systems and networks",
    },
    {
      icon: Lock,
      title: language === "ar" ? "تشفير قوي" : "Strong Encryption",
      description:
        language === "ar"
          ? "تشفير قوي لحماية البيانات الحساسة"
          : "Strong encryption to protect sensitive data",
    },
    {
      icon: AlertTriangle,
      title: language === "ar" ? "استجابة سريعة" : "Rapid Response",
      description:
        language === "ar"
          ? "استجابة سريعة للحوادث الأمنية"
          : "Rapid response to security incidents",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 text-gray-800 dark:text-white overflow-hidden">
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.03)_50%,transparent_75%)] dark:bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      {/* Floating Security Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-10 left-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-20 right-20 w-16 h-16 bg-blue-500/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
        <div
          className="absolute bottom-10 right-10 w-18 h-18 bg-green-400/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Top Section - Main Content */}
        <div className="container mx-auto px-4 py-20">
          {/* Header Section */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <img
                src="/assets/app-icon"
                alt="Cybersecurity Portal"
                className="h-12 w-12 object-contain mx-4"
              />
              <h2 className="ml-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-300 dark:to-blue-300">
                {t("beginners.footer.title")}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-slate-300 text-xl max-w-4xl mx-auto leading-relaxed">
              {t("beginners.footer.subtitle")}
            </p>
          </div>

          {/* Sectioned Sitemap */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {footerSections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={index} className="group">
                  <div className="flex items-center mb-8">
                    <div
                      className={`p-4 rounded-2xl ${section.bgColor} mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg border ${section.borderColor}`}
                    >
                      <IconComponent className={`h-8 w-8 ${section.color}`} />
                    </div>
                    <h3
                      className={`font-bold text-2xl ${section.color} group-hover:scale-105 transition-transform duration-500`}
                    >
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
                            className="flex items-center text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 group/link py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/50 shadow-sm hover:shadow-lg border border-transparent hover:border-gray-200 dark:hover:border-slate-700/50"
                          >
                            <LinkIcon
                              className={`h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3 text-gray-500 dark:text-slate-400 group-hover/link:text-green-500 dark:group-hover/link:text-green-400 transition-colors duration-300`}
                            />
                            <span className="text-sm font-medium">
                              {link.title}
                            </span>
                            {isRtl ? (
                              <ArrowLeft className="h-4 w-4 mr-auto opacity-0 group-hover/link:opacity-100 group-hover/link:-translate-x-1 transition-all duration-300" />
                            ) : (
                              <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300" />
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
          <div className="bg-gradient-to-r from-gray-200/50 to-gray-100/50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-3xl p-10 mb-16 backdrop-blur-sm border border-gray-300/50 dark:border-slate-700/50 shadow-2xl shadow-gray-900/10 dark:shadow-slate-900/20">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              {t("beginners.footer.quickLinks")}
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {quickLinks.map((link, index) => {
                const LinkIcon = link.icon;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-slate-700/50 dark:to-gray-700/50 hover:from-green-500/20 hover:to-blue-500/20 rounded-2xl transition-all duration-300 group border border-gray-400/50 dark:border-slate-600/50 hover:border-green-500/30 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <LinkIcon
                      className={`h-6 w-6 mr-3 rtl:mr-0 rtl:ml-3 text-gray-600 dark:text-slate-300 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300`}
                    />
                    <span className="font-medium text-gray-700 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-white">
                      {link.title}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-5 w-5 mr-2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                    ) : (
                      <ArrowRight className="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex justify-center mb-16">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {t("beginners.footer.contactInfo")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Building2
                    className={`h-6 w-6 text-green-600 dark:text-green-400 mr-3 rtl:mr-0 rtl:ml-3`}
                  />
                  <span className="text-gray-600 dark:text-slate-300">
                    {language === "ar"
                      ? "فرع حرب المعلومات من إدارة نظم المعلومات"
                      : "Technical Insurance Center MMC"}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <Mail
                    className={`h-6 w-6 text-green-600 dark:text-green-400 mr-3 rtl:mr-0 rtl:ml-3`}
                  />
                  <span className="text-gray-600 dark:text-slate-300">
                    info@cybersecurity.gov
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <Phone
                    className={`h-6 w-6 text-green-600 dark:text-green-400 mr-3 rtl:mr-0 rtl:ml-3`}
                  />
                  <span className="text-gray-600 dark:text-slate-300">
                    +966 11 123 4567
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300/50 dark:border-slate-700/50 bg-gradient-to-r from-gray-200/50 to-gray-100/50 dark:from-slate-800/50 dark:to-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-center md:text-right rtl:md:text-left">
                <p className="text-gray-500 dark:text-slate-400 text-sm">
                  {t("beginners.footer.copyright")}
                </p>
              </div>

              {/* No social links as requested */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
