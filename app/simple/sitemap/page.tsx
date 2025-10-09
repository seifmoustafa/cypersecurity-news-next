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
import { useVideoCategories } from "@/core/hooks/use-video-categories";
import { useLectureCategories } from "@/core/hooks/use-lecture-categories";
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
  const { categories: videoCategories, loading: videoLoading } = useVideoCategories(1, 100);
  const { categories: lectureCategories, loading: lectureLoading } = useLectureCategories(1, 100);
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
      "definitions", "awareness", "news", "awareness-bulletins",
      "personal-protect", "videos", "helpers", "media", "lectures", "references"
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
      id: "personal-protect",
      title: language === "ar" ? "الحماية الشخصية" : "Personal Protection",
      icon: ShieldCheck,
      href: "/simple/personal-protect",
      description: language === "ar" ? "فيديوهات وإرشادات الحماية الشخصية" : "Personal protection videos and guides",
      type: 'branch',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      children: [
        {
          id: "videos",
          title: language === "ar" ? "فيديوهات" : "Educational Videos",
          icon: Video,
          href: "/simple/personal-protect/videos",
          description: language === "ar" ? "فيديوهات  للحماية الشخصية" : "Educational videos for personal protection",
          type: 'branch',
        level: 1,
        color: 'text-blue-500',
          children: videoCategories.map(category => ({
            id: `video-cat-${category.id}`,
            title: language === "ar" ? category.name : (category.nameEn || category.name),
            icon: Video,
            href: `/simple/personal-protect/videos/${category.id}`,
            description: language === "ar" ? `فيديوهات ${category.name}` : `Videos for ${category.nameEn || category.name}`,
            type: 'leaf',
            level: 2,
            color: 'text-blue-400',
          })),
          loading: videoLoading,
          count: videoCategories.length,
        },
        {
          id: "helpers",
          title: language === "ar" ? "إرشادات" : "Helpers",
          icon: BookOpen,
          href: "/simple/personal-protect/helpers",
          description: language === "ar" ? "إرشادات وأدلة الحماية الشخصية" : "Personal protection guides and helpers",
          type: 'branch',
          level: 1,
          color: 'text-green-500',
          children: helperCategories.map(category => ({
            id: `helper-cat-${category.id}`,
            title: language === "ar" ? category.title : (category.titleEn || category.title),
            icon: BookOpen,
            href: `/simple/personal-protect/helpers?category=${category.id}`,
            description: language === "ar" ? `إرشادات ${category.title}` : `Helpers for ${category.titleEn || category.title}`,
            type: 'leaf',
            level: 2,
            color: 'text-green-400',
          })),
          loading: helperLoading,
          count: helperCategories.length,
        },
      ],
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
      ],
    },
    {
      id: "media",
      title: language === "ar" ? "المكتبة الثقافية" : "Media",
      icon: Video,
      href: "/simple/media",
      description: language === "ar" ? "المكتبة الثقافية وال" : "Educational media library",
      type: 'branch',
      color: 'text-cyan-600',
      gradient: 'from-cyan-500 to-blue-500',
      children: [
        {
          id: "lectures",
          title: language === "ar" ? "المحاضرات" : "Lectures",
          icon: GraduationCap,
          href: "/simple/media/lectures",
          description: language === "ar" ? "محاضرات  متخصصة" : "Specialized educational lectures",
          type: 'branch',
          level: 1,
              color: 'text-cyan-500',
              children: lectureCategories.map(category => ({
                id: `lecture-cat-${category.id}`,
                title: language === "ar" ? category.name : (category.nameEn || category.name),
            icon: FileText,
            href: `/simple/media/lectures/${category.id}`,
                description: language === "ar" ? `محاضرات ${category.name}` : `Lectures for ${category.nameEn || category.name}`,
                type: 'leaf',
            level: 2,
                color: 'text-cyan-400',
              })),
              loading: lectureLoading,
              count: lectureCategories.length,
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
    // Enhanced indentation - much more space for each level for clearer hierarchy
    const indentLevel = level * 48; // Increased from 32 to 48 for better visual separation
    const lineOffset = 24; // Position of connecting lines

    const getNodeStyles = () => {
      const baseStyles = "relative transition-all duration-200 ease-in-out";
      // Reduced hover animation intensity
      const hoverStyles = isHovered ? "scale-[1.02] shadow-md" : "hover:scale-[1.01]";
      
      if (node.type === 'root') {
        return `${baseStyles} ${hoverStyles} bg-gradient-to-r ${node.gradient} text-white rounded-2xl p-6 shadow-xl border-2 border-white/30 backdrop-blur-sm`;
      } else if (node.type === 'branch') {
        return `${baseStyles} ${hoverStyles} bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl`;
      } else {
        return `${baseStyles} ${hoverStyles} bg-slate-50 dark:bg-slate-700 rounded-lg p-3 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-400 hover:shadow-lg`;
      }
    };

    const getIconStyles = () => {
      if (node.type === 'root') {
        return "h-8 w-8 text-white";
      } else if (node.type === 'branch') {
        return `h-6 w-6 ${node.color}`;
      } else {
        return `h-5 w-5 ${node.color}`;
      }
    };

    return (
      <div key={node.id} className="relative">
        {/* Enhanced Tree Lines - Thicker and more visible */}
        {level > 0 && (
          <>
            {/* Vertical connecting line - thicker and more visible */}
            <div 
              className={`absolute top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-400 dark:from-blue-400 dark:via-blue-500 dark:to-blue-300 shadow-lg ${
                isRtl ? 'right-0' : 'left-0'
              }`}
              style={{ [isRtl ? 'right' : 'left']: `${indentLevel - lineOffset}px` }}
            />
            
            {/* Horizontal connecting line - thicker and longer */}
            <div 
              className={`absolute top-8 w-20 h-2 bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-300 shadow-lg ${
              isRtl ? 'right-0' : 'left-0'
            }`}
              style={{ [isRtl ? 'right' : 'left']: `${indentLevel - 80}px` }}
          />
        
            {/* Connection point - larger circle */}
          <div 
              className={`absolute top-7 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full border-3 border-white dark:border-slate-800 shadow-lg ${
              isRtl ? 'right-0' : 'left-0'
            }`}
              style={{ [isRtl ? 'right' : 'left']: `${indentLevel - lineOffset - 8}px` }}
          />
          </>
        )}

        <div
          className={`${getNodeStyles()} ${isRtl ? 'mr-8' : 'ml-8'} ${
            hasChildren ? 'cursor-pointer' : ''
          }`}
          style={{ [isRtl ? 'marginRight' : 'marginLeft']: `${indentLevel}px` }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={hasChildren ? () => toggleSection(node.id) : undefined}
          role={hasChildren ? "button" : undefined}
          tabIndex={hasChildren ? 0 : undefined}
          onKeyDown={hasChildren ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSection(node.id);
            }
          } : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={hasChildren ? `${node.title} - ${isExpanded ? 'Collapse' : 'Expand'} section` : node.title}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1 min-w-0">
              {/* Enhanced Icon with better styling */}
              <div className="flex-shrink-0 relative">
                 <div className={`p-4 rounded-xl transition-all duration-200 ${
                  node.type === 'root' 
                     ? 'bg-white/25 backdrop-blur-sm shadow-lg' 
                    : node.type === 'branch'
                     ? 'bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 shadow-md'
                     : 'bg-slate-50 dark:bg-slate-600 border-2 border-slate-100 dark:border-slate-500 shadow-sm'
                }`}>
                  <node.icon className={getIconStyles()} />
                </div>
                
                {/* Enhanced Glow Effect */}
                {isHovered && (
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${node.gradient || 'from-blue-500 to-cyan-500'} opacity-20 blur-sm`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {/* Title: if href exists, always navigate on click; otherwise act as toggle for branches */}
                  {node.href ? (
                    <Link
                      href={node.href}
                       className={`font-bold truncate ${
                         node.type === 'root'
                           ? 'text-white text-xl'
                           : hasChildren
                           ? 'text-slate-900 dark:text-slate-100 text-lg'
                           : 'text-slate-800 dark:text-slate-200 text-base'
                       } hover:underline hover:text-blue-600 dark:hover:text-blue-400`}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`فتح ${node.title}`}
                    >
                      {node.title}
                    </Link>
                  ) : hasChildren ? (
                    <button
                      type="button"
                       className={`font-bold truncate text-left ${
                         node.type === 'root'
                           ? 'text-white text-xl'
                           : 'text-slate-900 dark:text-slate-100 text-lg'
                       }`}
                      aria-expanded={isExpanded}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(node.id);
                      }}
                    >
                      {node.title}
                    </button>
                  ) : (
                    <span
                       className={`font-bold truncate ${
                    node.type === 'root' 
                           ? 'text-white text-xl'
                           : 'text-slate-800 dark:text-slate-200 text-base'
                       }`}
                    >
                    {node.title}
                    </span>
                  )}
                  
                  {/* Enhanced Badges */}
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    {node.count !== undefined && (
                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        node.type === 'root' 
                           ? 'bg-white/20 text-white border border-white/30' 
                           : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
                      }`}>
                        {node.count}
                      </span>
                    )}
                    {node.loading && (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    )}
                    {node.error && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
                
                {node.description && (
                  <p className={`mt-2 truncate ${
                    node.type === 'root' 
                      ? 'text-white/90 text-base' 
                      : 'text-slate-600 dark:text-slate-300 text-sm'
                  }`}>
                    {node.description}
                  </p>
                )}
              </div>
            </div>

            {/* Enhanced Actions */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {hasChildren && (
                 <div className={`p-2 rounded-lg transition-all duration-200 ${
                    node.type === 'root' 
                     ? 'text-white/80' 
                     : 'text-slate-500 dark:text-slate-400'
                 }`}>
                  {isExpanded ? (
                     <ChevronDown className="h-5 w-5" />
                  ) : (
                     <ChevronRight className="h-5 w-5" />
                  )}
                 </div>
              )}
              {node.href && (
                <Link
                  href={node.href}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    node.type === 'root' 
                      ? 'hover:bg-white/20 text-white border border-white/20' 
                      : 'hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-500 border border-blue-200 dark:border-blue-700'
                  }`}
                  aria-label={`Navigate to ${node.title}`}
                  onClick={(e) => e.stopPropagation()} // Prevent parent click when clicking link
                >
                  <ExternalLink className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced Children with better spacing and visual separation */}
        {hasChildren && isExpanded && (
          <div className="mt-4 space-y-4 relative">
            {/* Subtle background indicator for children */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 to-blue-100 dark:from-blue-800 dark:to-blue-700 rounded-full opacity-50"></div>
            <div className="pl-2">
            {node.children?.map(child => renderTreeNode(child, level + 1))}
            </div>
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
      const hasGradient = Boolean(node.gradient);
      
      return (
        <div key={node.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors overflow-hidden">
          <div className={`${hasGradient ? `bg-gradient-to-r ${node.gradient} text-white` : 'bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100'} p-4`}> 
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse" style={{ [isRtl ? 'marginRight' : 'marginLeft']: `${indentLevel}px` }}>
                 <node.icon className={`h-7 w-7 ${hasGradient ? 'text-white' : 'text-blue-600 dark:text-blue-300'}`} />
                <div>
                  {node.href ? (
                    <Link
                      href={node.href}
                      className={`text-xl font-bold hover:underline ${hasGradient ? 'text-white hover:text-blue-50' : 'text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-300'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {node.title}
                    </Link>
                  ) : (
                     <h3 className={`text-xl font-bold ${hasGradient ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{node.title}</h3>
                  )}
                  {node.description && (
                    <p className={`${hasGradient ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'} text-base`}>{node.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {node.count !== undefined && (
                   <span className={`${hasGradient ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'} px-3 py-1 rounded-full text-base font-semibold`}>
                    {node.count}
                  </span>
                )}
                {hasChildren && (
                  <button
                    onClick={() => toggleSection(node.id)}
                     className={`${hasGradient ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100'} p-3 rounded-lg transition-all duration-200`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                )}
                {node.href && (
                  <Link href={node.href} className={`${hasGradient ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100'} p-3 rounded-lg transition-all duration-200`} onClick={(e)=>e.stopPropagation()}>
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Show children in list */}
          {hasChildren && isExpanded && (
            <div className="p-4 space-y-2 bg-white dark:bg-slate-800">
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
    videoCategories.length +
    lectureCategories.length;

  const isLoading = [
    newsLoading,
    definitionLoading,
    videoLoading,
    lectureLoading,
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

      {/* Stats removed for a cleaner sitemap layout */}

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
              <div className="space-y-6">
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