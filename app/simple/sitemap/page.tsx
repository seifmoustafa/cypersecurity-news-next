"use client";

import { useLanguage } from "@/components/language-provider";
import {
  Map,
  Home,
  Video,
  BookOpen,
  ShieldCheck,
  Search,
  FileText,
  GraduationCap,
  Eye,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  CheckCircle,
  Target,
  Layers,
  Grid3X3,
  Zap,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  Calendar,
  Plus,
  Minus,
  ArrowRight,
  ArrowDown,
  Network,
  Globe,
  Star,
  Heart,
  Crown,
  Gem,
  Flame,
  Snowflake,
  Sun,
  Moon,
  Cloud,
  Mountain,
  Waves,
  Play,
  Presentation,
  Shield,
  Users,
  Lock,
  AlertTriangle,
  Settings,
  Database,
  Server,
  Key,
  Lightbulb,
  Newspaper,
  Clock,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useNewsCategories } from "@/core/hooks/use-news-categories";
import { useDefinitionCategories } from "@/core/hooks/use-definition-categories";
import { usePersonalProtectCategories } from "@/core/hooks/use-personal-protect-categories";
import { useVideoCategories } from "@/core/hooks/use-video-categories";
import { useLectureCategories } from "@/core/hooks/use-lecture-categories";
import { usePresentationCategories } from "@/core/hooks/use-presentation-categories";
import { useHelperCategories } from "@/hooks/use-helper-categories";
import { useAwarenessYears } from "@/core/hooks/use-awareness";

interface TreeNode {
  id: string;
  title: string;
  titleEn?: string;
  icon: any;
  href?: string;
  description?: string;
  children?: TreeNode[];
  loading?: boolean;
  error?: boolean;
  count?: number;
  level?: number;
  isExpanded?: boolean;
  type?: 'root' | 'branch' | 'leaf';
  color?: string;
  gradient?: string;
}

export default function BeginnersSitemapPage() {
  const { language, t } = useLanguage();
  const isRtl = language === "ar";
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');

  // Fetch all categories
  const { categories: newsCategories, loading: newsLoading } = useNewsCategories(1, 100);
  const { categories: definitionCategories, loading: definitionLoading } = useDefinitionCategories(1, 100);
  const { categories: personalProtectCategories, loading: personalProtectLoading } = usePersonalProtectCategories("", 1, 100);
  const { categories: videoCategories, loading: videoLoading } = useVideoCategories(1, 100);
  const { categories: lectureCategories, loading: lectureLoading } = useLectureCategories(1, 100);
  const { categories: presentationCategories, loading: presentationLoading } = usePresentationCategories(1, 100);
  const { categories: helperCategories, loading: helperLoading } = useHelperCategories(1, 100);
  const { data: awarenessYearsData, loading: awarenessYearsLoading } = useAwarenessYears();

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const expandAll = () => {
    const allIds = [
      "definitions", "awareness", "news", "awareness-bulletins", "helpers",
      "personal-protect", "media", "lessons", "videos", "lectures", "presentations"
    ];
    setExpandedSections(allIds);
  };

  const collapseAll = () => {
    setExpandedSections([]);
  };

  // Build dynamic tree structure with app's color scheme
  const sitemapData: TreeNode[] = [
    {
      id: "main",
      title: language === "ar" ? "الصفحة الرئيسية" : "Home",
      icon: Home,
      href: "/simple",
      description: language === "ar" ? "الصفحة الرئيسية للموقع" : "Main homepage",
      type: 'root',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: "definitions",
      title: language === "ar" ? "المفاهيم" : "Definitions",
      icon: BookOpen,
      href: "/simple/definitions-categories",
      description: language === "ar" ? "تعريفات الأمن السيبراني" : "Cybersecurity definitions",
      type: 'branch',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      children: definitionCategories.map(category => ({
        id: `def-cat-${category.id}`,
        title: language === "ar" ? category.name : (category.nameEn || category.name),
        icon: CheckCircle,
        href: `/simple/definitions-categories?category=${category.id}`,
        description: language === "ar" ? `تعريفات ${category.name}` : `Definitions for ${category.nameEn || category.name}`,
        type: 'leaf',
        level: 1,
        color: 'text-blue-500',
      })),
      loading: definitionLoading,
      count: definitionCategories.length,
    },
    {
      id: "awareness",
      title: language === "ar" ? "التوعية" : "Awareness",
      icon: Eye,
      href: "/simple/awareness",
      description: language === "ar" ? "الأخبار ونشرات التوعية" : "News and awareness bulletins",
      type: 'branch',
      color: 'text-cyan-600',
      gradient: 'from-cyan-500 to-blue-500',
      children: [
        {
          id: "news",
          title: language === "ar" ? "الأخبار" : "News",
          icon: Newspaper,
          href: "/simple/news-categories",
          description: language === "ar" ? "أخبار الأمن السيبراني" : "Cybersecurity news",
          type: 'branch',
          level: 1,
          color: 'text-blue-500',
          children: newsCategories.map(category => ({
            id: `news-cat-${category.id}`,
            title: language === "ar" ? category.name : (category.nameEn || category.name),
            icon: AlertTriangle,
            href: `/simple/news-categories?category=${category.id}`,
            description: language === "ar" ? `أخبار ${category.name}` : `News for ${category.nameEn || category.name}`,
            type: 'leaf',
            level: 2,
            color: 'text-blue-400',
          })),
          loading: newsLoading,
          count: newsCategories.length,
        },
        {
          id: "awareness-bulletins",
          title: language === "ar" ? "نشرات التوعية" : "Awareness",
          icon: Eye,
          href: "/simple/awareness-years",
          description: language === "ar" ? "نشرات توعية مبسطة" : "Simplified awareness bulletins",
          type: 'branch',
          level: 1,
          color: 'text-cyan-500',
          children: awarenessYearsData?.data?.map((year: any) => ({
            id: `awareness-year-${year.id}`,
            title: year.year.toString(),
            icon: Calendar,
            href: `/simple/awareness-years/${year.id}`,
            description: language === "ar" ? `نشرات توعية ${year.year}` : `Awareness bulletins for ${year.year}`,
            type: 'leaf',
            level: 2,
            color: 'text-cyan-400',
          })) || [],
          loading: awarenessYearsLoading,
          count: awarenessYearsData?.data?.length || 0,
        },
        {
          id: "helpers",
          title: language === "ar" ? "الإرشادات" : "Helpers",
          icon: Lightbulb,
          href: "/simple/helper-categories",
          description: language === "ar" ? "إرشادات وأدلة مساعدة" : "Guides and helpful instructions",
          type: 'branch',
          level: 1,
          color: 'text-blue-500',
          children: helperCategories.map(category => ({
            id: `helper-cat-${category.id}`,
            title: language === "ar" ? category.title : (category.titleEn || category.title),
            icon: Target,
            href: `/simple/helper-categories?category=${category.id}`,
            description: language === "ar" ? `إرشادات ${category.title}` : `Guides for ${category.titleEn || category.title}`,
            type: 'leaf',
            level: 2,
            color: 'text-blue-400',
          })),
          loading: helperLoading,
          count: helperCategories.length,
        },
      ],
    },
    {
      id: "personal-protect",
      title: language === "ar" ? "الحماية الشخصية" : "Personal Protection",
      icon: ShieldCheck,
      href: "/simple/personal-protect",
      description: language === "ar" ? "فئات الحماية الشخصية" : "Personal protection categories",
      type: 'branch',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      children: personalProtectCategories.map(category => ({
        id: `protect-cat-${category.id}`,
        title: language === "ar" ? category.name : (category.nameEn || category.name),
        icon: Shield,
        href: `/simple/personal-protect?category=${category.id}`,
        description: language === "ar" ? `حماية ${category.name}` : `Protection for ${category.nameEn || category.name}`,
        type: 'leaf',
        level: 1,
        color: 'text-blue-500',
      })),
      loading: personalProtectLoading,
      count: personalProtectCategories.length,
    },
    {
      id: "media",
      title: language === "ar" ? "المكتبة الثقافية" : "Media",
      icon: Video,
      href: "/simple/media",
      description: language === "ar" ? "المكتبة الثقافية والتعليمية" : "Educational media library",
      type: 'branch',
      color: 'text-cyan-600',
      gradient: 'from-cyan-500 to-blue-500',
      children: [
        {
          id: "lessons",
          title: language === "ar" ? "دروس تعليمية" : "Educational Lessons",
          icon: GraduationCap,
          href: "/simple/media/lessons",
          description: language === "ar" ? "دروس تعليمية متخصصة" : "Specialized educational lessons",
          type: 'branch',
          level: 1,
          color: 'text-cyan-500',
          children: [
            {
              id: "videos",
              title: language === "ar" ? "الفيديوهات" : "Videos",
              icon: Video,
              href: "/simple/media/lessons/videos",
              description: language === "ar" ? "فيديوهات تعليمية" : "Educational videos",
              type: 'branch',
              level: 2,
              color: 'text-blue-500',
              children: videoCategories.map(category => ({
                id: `video-cat-${category.id}`,
                title: language === "ar" ? category.name : (category.nameEn || category.name),
                icon: Play,
                href: `/simple/media/lessons/videos?category=${category.id}`,
                description: language === "ar" ? `فيديوهات ${category.name}` : `Videos for ${category.nameEn || category.name}`,
                type: 'leaf',
                level: 3,
                color: 'text-blue-400',
              })),
              loading: videoLoading,
              count: videoCategories.length,
            },
            {
              id: "lectures",
              title: language === "ar" ? "المحاضرات" : "Lectures",
              icon: GraduationCap,
              href: "/simple/media/lessons/lectures",
              description: language === "ar" ? "محاضرات تعليمية" : "Educational lectures",
              type: 'branch',
              level: 2,
              color: 'text-cyan-500',
              children: lectureCategories.map(category => ({
                id: `lecture-cat-${category.id}`,
                title: language === "ar" ? category.name : (category.nameEn || category.name),
                icon: BookOpen,
                href: `/simple/media/lessons/lectures?category=${category.id}`,
                description: language === "ar" ? `محاضرات ${category.name}` : `Lectures for ${category.nameEn || category.name}`,
                type: 'leaf',
                level: 3,
                color: 'text-cyan-400',
              })),
              loading: lectureLoading,
              count: lectureCategories.length,
            },
            {
              id: "presentations",
              title: language === "ar" ? "العروض التقديمية" : "Presentations",
              icon: Presentation,
              href: "/simple/media/lessons/presentations",
              description: language === "ar" ? "عروض تقديمية تعليمية" : "Educational presentations",
              type: 'branch',
              level: 2,
              color: 'text-blue-500',
              children: presentationCategories.map(category => ({
                id: `presentation-cat-${category.id}`,
                title: language === "ar" ? category.name : (category.nameEn || category.name),
                icon: FileText,
                href: `/simple/media/lessons/presentations?category=${category.id}`,
                description: language === "ar" ? `عروض ${category.name}` : `Presentations for ${category.nameEn || category.name}`,
                type: 'leaf',
                level: 3,
                color: 'text-blue-400',
              })),
              loading: presentationLoading,
              count: presentationCategories.length,
            },
          ],
        },
        {
          id: "articles",
          title: language === "ar" ? "المقالات" : "Articles",
          icon: FileText,
          href: "/simple/media/articles",
          description: language === "ar" ? "مقالات متخصصة" : "Specialized articles",
          type: 'leaf',
          level: 1,
          color: 'text-slate-500',
        },
        {
          id: "references",
          title: language === "ar" ? "المراجع" : "References",
          icon: BookOpen,
          href: "/simple/media/references",
          description: language === "ar" ? "مراجع علمية" : "Scientific references",
          type: 'leaf',
          level: 1,
          color: 'text-slate-500',
        },
      ],
    },
    {
      id: "search",
      title: language === "ar" ? "البحث" : "Search",
      icon: Search,
      href: "/simple/search",
      description: language === "ar" ? "البحث في المحتوى" : "Search content",
      type: 'root',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
    },
  ];

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedSections.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isHovered = hoveredNode === node.id;
    const indentLevel = level * 24;

    const getNodeStyles = () => {
      const baseStyles = "relative transition-all duration-300 ease-in-out";
      const hoverStyles = isHovered ? "scale-105 shadow-lg" : "hover:scale-102";
      
      if (node.type === 'root') {
        return `${baseStyles} ${hoverStyles} bg-gradient-to-r ${node.gradient} text-white rounded-xl p-4 shadow-md`;
      } else if (node.type === 'branch') {
        return `${baseStyles} ${hoverStyles} bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700`;
      } else {
        return `${baseStyles} ${hoverStyles} bg-slate-50 dark:bg-slate-700 rounded-md p-2 border border-slate-100 dark:border-slate-600`;
      }
    };

    const getIconStyles = () => {
      if (node.type === 'root') {
        return "h-6 w-6 text-white";
      } else if (node.type === 'branch') {
        return `h-5 w-5 ${node.color}`;
      } else {
        return `h-4 w-4 ${node.color}`;
      }
    };

    return (
      <div key={node.id} className="relative">
        {/* Tree Lines */}
        {level > 0 && (
          <div 
            className={`absolute top-0 bottom-0 w-px bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700 ${
              isRtl ? 'right-0' : 'left-0'
            }`}
            style={{ [isRtl ? 'right' : 'left']: `${indentLevel - 12}px` }}
          />
        )}
        
        {/* Horizontal Line */}
        {level > 0 && (
          <div 
            className={`absolute top-6 w-12 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600 ${
              isRtl ? 'right-0' : 'left-0'
            }`}
            style={{ [isRtl ? 'right' : 'left']: `${indentLevel - 48}px` }}
          />
        )}

        <div
          className={`${getNodeStyles()} ${isRtl ? 'mr-4' : 'ml-4'}`}
          style={{ [isRtl ? 'marginRight' : 'marginLeft']: `${indentLevel}px` }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1 min-w-0">
              {/* Icon with Animation */}
              <div className="flex-shrink-0 relative">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  node.type === 'root' 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : node.type === 'branch'
                    ? 'bg-slate-100 dark:bg-slate-700'
                    : 'bg-slate-50 dark:bg-slate-600'
                }`}>
                  <node.icon className={getIconStyles()} />
                </div>
                
                {/* Subtle Glow Effect */}
                {isHovered && (
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${node.gradient || 'from-blue-500 to-cyan-500'} opacity-10 blur-sm`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <h3 className={`font-semibold truncate ${
                    node.type === 'root' 
                      ? 'text-white text-lg' 
                      : node.type === 'branch'
                      ? 'text-slate-900 dark:text-slate-100 text-base'
                      : 'text-slate-700 dark:text-slate-300 text-sm'
                  }`}>
                    {node.title}
                  </h3>
                  
                  {/* Badges */}
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    {node.count !== undefined && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        node.type === 'root' 
                          ? 'bg-white/20 text-white' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {node.count}
                      </span>
                    )}
                    {node.loading && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                    {node.error && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                
                {node.description && (
                  <p className={`mt-1 truncate ${
                    node.type === 'root' 
                      ? 'text-white/80 text-sm' 
                      : 'text-slate-500 dark:text-slate-400 text-xs'
                  }`}>
                    {node.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {hasChildren && (
                <button
                  onClick={() => toggleSection(node.id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    node.type === 'root' 
                      ? 'hover:bg-white/20 text-white' 
                      : 'hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {node.href && (
                <Link
                  href={node.href}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    node.type === 'root' 
                      ? 'hover:bg-white/20 text-white' 
                      : 'hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-500'
                  }`}
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2">
            {node.children?.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderListView = () => {
    const renderNodeInList = (node: TreeNode, level: number = 0) => {
      const isExpanded = expandedSections.includes(node.id);
      const hasChildren = node.children && node.children.length > 0;
      const indentLevel = level * 20;
      
      return (
        <div key={node.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className={`bg-gradient-to-r ${node.gradient} p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse" style={{ [isRtl ? 'marginRight' : 'marginLeft']: `${indentLevel}px` }}>
                <node.icon className="h-6 w-6 text-white" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{node.title}</h3>
                  <p className="text-white/80 text-sm">{node.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {node.count !== undefined && (
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {node.count}
                  </span>
                )}
                {hasChildren && (
                  <button
                    onClick={() => toggleSection(node.id)}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
                {node.href && (
                  <Link href={node.href} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Show children in list */}
          {hasChildren && isExpanded && (
            <div className="p-4 space-y-2">
              {node.children?.map(child => renderNodeInList(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {sitemapData.map(section => renderNodeInList(section))}
      </div>
    );
  };

  const totalCategories = 
    definitionCategories.length +
    newsCategories.length +
    (awarenessYearsData?.data?.length || 0) +
    helperCategories.length +
    personalProtectCategories.length +
    videoCategories.length +
    lectureCategories.length +
    presentationCategories.length;

  const isLoading = [
    newsLoading,
    definitionLoading,
    personalProtectLoading,
    videoLoading,
    lectureLoading,
    presentationLoading,
    helperLoading,
    awarenessYearsLoading
  ].some(loading => loading);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-6">
            <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                  <Map className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 p-1 rounded-full bg-blue-400">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {language === "ar" ? "خريطة الموقع التفاعلية" : "Interactive Site Map"}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                  {language === "ar" 
                    ? "استكشف جميع صفحات ومحتويات الموقع بطريقة تفاعلية ومرتبة"
                    : "Explore all website pages and content in an interactive and organized way"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>

      {/* Controls */}
      <div className="relative container mx-auto px-4 py-6">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={language === "ar" ? "البحث في الموقع..." : "Search the site..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {language === "ar" ? "عرض:" : "View:"}
              </span>
              <div className="flex rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
                {(['tree', 'list'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === mode
                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {mode === 'tree' ? (language === "ar" ? "شجرة" : "Tree") :
                     (language === "ar" ? "قائمة" : "List")}
                  </button>
                ))}
              </div>
                      </div>

            {/* Expand/Collapse */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={expandAll}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>{language === "ar" ? "توسيع الكل" : "Expand All"}</span>
              </button>
                        <button
                onClick={collapseAll}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Minus className="h-4 w-4" />
                <span>{language === "ar" ? "طي الكل" : "Collapse All"}</span>
                        </button>
            </div>
          </div>
        </div>
                    </div>

      {/* Stats */}
      <div className="relative container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <Grid3X3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {language === "ar" ? "الأقسام الرئيسية" : "Main Sections"}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {sitemapData.length}
                </p>
              </div>
            </div>
                    </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {language === "ar" ? "إجمالي الفئات" : "Total Categories"}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalCategories}
                </p>
                    </div>
                  </div>
                </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600">
                <Network className="h-6 w-6 text-white" />
                              </div>
                              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {language === "ar" ? "المستويات" : "Tree Levels"}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  4
                                </p>
                              </div>
                            </div>
                        </div>
          
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <Zap className="h-6 w-6 text-white" />
                  </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {language === "ar" ? "حالة التحميل" : "Loading Status"}
                </p>
                <div className="text-2xl">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tree Structure */}
      <div className="relative container mx-auto px-4 pb-12">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              {/* <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Network className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {language === "ar" ? "هيكل الموقع التفاعلي" : "Interactive Website Structure"}
                </h2>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-slate-500 dark:text-slate-400">
                <Globe className="h-4 w-4" />
                <span>{language === "ar" ? "تصميم متجاوب" : "Responsive Design"}</span>
              </div> */}
            </div>
            
            {/* Content based on view mode */}
            {viewMode === 'tree' && (
              <div className="space-y-4">
                {sitemapData.map(section => renderTreeNode(section))}
              </div>
            )}
            
            {viewMode === 'list' && renderListView()}
          </div>
        </div>
      </div>
    </div>
  );
}