"use client";

import { useLanguage } from "@/components/language-provider";
import { Shield, ArrowRight, Map } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const footerColumns = [
    {
      title: language === "ar" ? "التوعية" : "Awareness",
      links: [
        { title: language === "ar" ? "الرئيسية" : "Home", href: "/" },
        { title: language === "ar" ? "الأخبار" : "News", href: "/news" },
        { title: language === "ar" ? "التوعية" : "Awareness", href: "/awareness" },
        { title: language === "ar" ? "المقالات" : "Articles", href: "/articles" },
        { title: language === "ar" ? "سنوات التوعية" : "Awareness Years", href: "/awareness/years" }
      ]
    },
    {
      title: language === "ar" ? "متطلبات الأمن" : "Security Requirements",
      links: [
        { title: language === "ar" ? "التعليمات" : "Instructions", href: "/instructions" },
        { title: language === "ar" ? "الإجراءات الأمنية" : "Security Procedures", href: "/procedures" },
        { title: language === "ar" ? "فئات التعليمات" : "Instruction Categories", href: "/instructions/category" },
        { title: language === "ar" ? "الحماية الشخصية" : "Personal Protection", href: "/personal-protect" }
      ]
    },
    {
      title: language === "ar" ? "مفاهيم الأمن السيبراني" : "Cybersecurity Concepts",
      links: [
        { title: language === "ar" ? "التعريفات" : "Definitions", href: "/definitions" },
        { title: language === "ar" ? "القوانين واللوائح" : "Laws & Regulations", href: "/laws" },
        { title: language === "ar" ? "التنظيم" : "Regulation", href: "/regulation" },
        { title: language === "ar" ? "إطار العمل" : "Framework", href: "/framework" },
        { title: language === "ar" ? "المعايير" : "Standards", href: "/standards" }
      ]
    },
    {
      title: language === "ar" ? "المكتبة والأنظمة" : "Library & Systems",
      links: [
        { title: language === "ar" ? "الفيديوهات" : "Videos", href: "/videos" },
        { title: language === "ar" ? "المحاضرات" : "Lectures", href: "/lectures" },
        { title: language === "ar" ? "العروض التقديمية" : "Presentations", href: "/presentations" },
        { title: language === "ar" ? "المنظومات الرئيسية" : "Main Systems", href: "/systems" },
        { title: language === "ar" ? "الأنظمة المساعدة" : "Helper Systems", href: "/helper-systems" },
        { title: language === "ar" ? "خريطة الموقع" : "Site Map", href: "/sitemap" }
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-blue-400 mr-3" />
              <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {language === "ar"
                  ? "بوابة الأمن السيبراني"
                  : "Cybersecurity Portal"}
              </span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              {language === "ar"
                ? "منصة شاملة للأمن السيبراني توفر المعرفة والأدوات والموارد اللازمة لحماية البنية التحتية الرقمية"
                : "A comprehensive cybersecurity platform providing knowledge, tools, and resources to protect digital infrastructure"}
            </p>
            <Link 
              href="/sitemap"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-sm group"
            >
              <Map className="h-4 w-4 mr-2" />
              {language === "ar" ? "خريطة الموقع" : "Site Map"}
              <ArrowRight className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Footer Columns */}
          {footerColumns.map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold text-orange-400 mb-4 text-lg">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-slate-300 hover:text-white transition-colors text-sm block py-1"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-right rtl:md:text-left mb-4 md:mb-0">
              <p className="text-slate-400 text-sm">
                {language === "ar"
                  ? "حقوق النشر © 2025 / مركز التأمين الفني MMC جميع الحقوق محفوظة"
                  : "Copyright © 2025 / Technical Security Center MMC. All rights reserved"}
              </p>
            </div>
            
            {/* Additional Links */}
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <Link 
                href="/sitemap"
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                {language === "ar" ? "خريطة الموقع" : "Site Map"}
              </Link>
              <Link 
                href="/"
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                {language === "ar" ? "الرئيسية" : "Home"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
