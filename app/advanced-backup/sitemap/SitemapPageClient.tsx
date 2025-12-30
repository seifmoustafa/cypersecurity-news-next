"use client";

import MainLayout from "@/components/layouts/main-layout";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
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
  Scale,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { container } from "@/core/di/container";
import type { DefinitionCategory } from "@/core/domain/models/definition";
import type { NewsCategory } from "@/core/domain/models/news";
import type { VideoCategory } from "@/core/domain/models/media";
import type {
  Procedure,
  ProcedureControl,
  ProcedureSafeguard,
  ProcedureTechnique,
} from "@/core/domain/models/procedure";
import type { AwarenessYear } from "@/core/domain/models/awareness";
import type {
  Instruction,
  InstructionsPaginatedResponse,
} from "@/core/domain/models/instruction";
import type { LawCategory } from "@/core/domain/models/law-category";
import type { Law } from "@/core/domain/models/law";
import type { RegulationCategory } from "@/core/domain/models/regulation-category";
import type { Regulation } from "@/core/domain/models/regulation";
import type {
  FrameworkFunction,
  FrameworkCategory,
} from "@/core/domain/models/framework";
import type { StandardCategory } from "@/core/domain/models/standard";
import type { InstructionCategory } from "@/core/domain/models/instruction-category";
import type { InstructionYear } from "@/core/domain/models/instruction-year";

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
  type?: "root" | "branch" | "leaf";
  color?: string;
  gradient?: string;
}

export default function SitemapPageClient() {
  const { language, isRtl, t } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");

  // Categories and basic data
  const [definitionCategories, setDefinitionCategories] = useState<
    DefinitionCategory[]
  >([]);
  const [newsCategories, setNewsCategories] = useState<NewsCategory[]>([]);
  const [videoCategories, setVideoCategories] = useState<VideoCategory[]>([]);
  const [awarenessYears, setAwarenessYears] = useState<AwarenessYear[]>([]);
  const [instructionCategories, setInstructionCategories] = useState<
    InstructionCategory[]
  >([]);
  const [lawCategories, setLawCategories] = useState<LawCategory[]>([]);
  const [regulationCategories, setRegulationCategories] = useState<
    RegulationCategory[]
  >([]);
  const [frameworkFunctions, setFrameworkFunctions] = useState<
    FrameworkFunction[]
  >([]);
  const [standardCategories, setStandardCategories] = useState<
    StandardCategory[]
  >([]);

  // Hierarchical data
  const [procedures, setProcedures] = useState<
    Array<
      Procedure & {
        controls: ProcedureControl[];
        safeguards: Record<string, ProcedureSafeguard[]>;
        techniques: Record<string, ProcedureTechnique[]>;
      }
    >
  >([]);

  const [instructions, setInstructions] = useState<
    Array<
      InstructionCategory & {
        years: InstructionYear[];
      }
    >
  >([]);

  const [laws, setLaws] = useState<
    Array<
      LawCategory & {
        laws: Law[];
      }
    >
  >([]);

  const [regulations, setRegulations] = useState<
    Array<
      RegulationCategory & {
        regulations: Regulation[];
      }
    >
  >([]);

  const [frameworks, setFrameworks] = useState<
    Array<
      FrameworkFunction & {
        categories: FrameworkCategory[];
      }
    >
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch basic categories
        const definitionCategoriesResponse =
          await container.services.definitions.getAllCategoriesForProfessionals(
            1,
            100
          );
        setDefinitionCategories(definitionCategoriesResponse.data);

        const newsCategoriesResponse =
          await container.services.news.getNewsCategories(1, 100);
        setNewsCategories(newsCategoriesResponse.data);

        const videoCategoriesResponse =
          await container.services.media.getVideoCategoriesForProfessionals(
            1,
            100
          );
        setVideoCategories(videoCategoriesResponse.data);

        const awarenessYearsResponse =
          await container.services.awareness.getAllAwarenessYears("", 1, 100);
        setAwarenessYears(awarenessYearsResponse.data);

        const instructionCategoriesResponse =
          await container.services.instructionCategories.getAllCategories(
            1,
            100
          );
        setInstructionCategories(instructionCategoriesResponse.data);

        const lawCategoriesResponse =
          await container.services.laws.getAllCategories(1, 100);
        setLawCategories(lawCategoriesResponse.data);

        const regulationCategoriesResponse =
          await container.services.regulationCategories.getAllCategories(
            1,
            100
          );
        setRegulationCategories(regulationCategoriesResponse.data);

        const frameworkFunctionsResponse =
          await container.services.framework.getFrameworkFunctions();
        setFrameworkFunctions(frameworkFunctionsResponse);

        const standardCategoriesResponse =
          await container.services.standards.getAllStandardCategories(1, 100);
        setStandardCategories(standardCategoriesResponse.data);

        // Fetch hierarchical data
        // Procedures with controls, safeguards, and techniques
        const proceduresResponse =
          await container.services.procedures.getAllProcedures(1, 100);
        const proceduresWithHierarchy = await Promise.all(
          proceduresResponse.data.map(async (procedure: Procedure) => {
            // Get controls for this procedure
            const controlsResponse =
              await container.services.procedures.getControlsByProcedureId(
                procedure.id,
                1,
                100
              );
            const controls = controlsResponse.data;

            // Get safeguards for each control
            const safeguards: Record<string, ProcedureSafeguard[]> = {};
            const techniques: Record<string, ProcedureTechnique[]> = {};

            await Promise.all(
              controls.map(async (control: ProcedureControl) => {
                // Get safeguards for this control
                const safeguardsResponse =
                  await container.services.procedures.getSafeguardsByControlId(
                    control.id,
                    1,
                    100
                  );
                safeguards[control.id] = safeguardsResponse.data;

                // Get techniques for each safeguard
                await Promise.all(
                  safeguardsResponse.data.map(
                    async (safeguard: ProcedureSafeguard) => {
                      const techniquesResponse =
                        await container.services.procedures.getTechniquesBySafeguardId(
                          safeguard.id,
                          1,
                          100
                        );
                      techniques[safeguard.id] = techniquesResponse.data;
                    }
                  )
                );
              })
            );

            return {
              ...procedure,
              controls,
              safeguards,
              techniques,
            };
          })
        );
        setProcedures(proceduresWithHierarchy);

        // Instructions with years
        const instructionsWithYears = await Promise.all(
          instructionCategoriesResponse.data.map(
            async (category: InstructionCategory) => {
              const yearsResponse =
                await container.services.instructionYears.getYearsByCategory(
                  category.id,
                  1,
                  100
                );
              return {
                ...category,
                years: yearsResponse.data,
              };
            }
          )
        );
        setInstructions(instructionsWithYears);

        // Laws with laws
        const lawsWithLaws = await Promise.all(
          lawCategoriesResponse.data.map(async (category: LawCategory) => {
            // For simplicity, we'll just show the category - in a real implementation,
            // we would fetch laws by category
            return {
              ...category,
              laws: [], // In a real implementation, we would fetch actual laws
            };
          })
        );
        setLaws(lawsWithLaws);

        // Regulations with regulations
        const regulationsWithRegulations = await Promise.all(
          regulationCategoriesResponse.data.map(
            async (category: RegulationCategory) => {
              const regulationsResponse =
                await container.services.regulations.getRegulationsByCategory(
                  category.id,
                  1,
                  100
                );
              return {
                ...category,
                regulations: regulationsResponse.data,
              };
            }
          )
        );
        setRegulations(regulationsWithRegulations);

        // Frameworks with categories
        const frameworksWithCategories = await Promise.all(
          frameworkFunctionsResponse.map(async (func: FrameworkFunction) => {
            const categories =
              await container.services.framework.getFrameworkCategories(
                func.id
              );
            return {
              ...func,
              categories,
            };
          })
        );
        setFrameworks(frameworksWithCategories);
      } catch (error) {
        console.error("Error fetching sitemap data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const expandAll = () => {
    const allIds = [
      "definitions",
      "awareness",
      "news",
      "awareness-bulletins",
      "personal-protect",
      "videos",
      "helpers",
      "media",
      "lectures",
      "references",
      "concepts",
      "requirements",
      "procedures",
      "systems",
      "instructions",
      "laws",
      "regulations",
      "framework",
      "standards",
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
      href: "/advanced",
      description:
        language === "ar" ? "الصفحة الرئيسية للموقع" : "Main homepage",
      type: "root",
      color: "text-blue-600",
      gradient: "from-blue-500 to-blue-500",
    },
    {
      id: "awareness",
      title: language === "ar" ? "التوعية" : "Awareness",
      icon: Eye,
      href: "/advanced#awareness",
      description:
        language === "ar"
          ? "الأخبار ونشرات التوعية"
          : "News and awareness bulletins",
      type: "branch",
      color: "text-blue-600",
      gradient: "from-blue-500 to-blue-500",
      children: [
        {
          id: "news",
          title: language === "ar" ? "الأخبار" : "News",
          icon: Newspaper,
          href: "/advanced/news",
          description:
            language === "ar" ? "أخبار الأمن السيبراني" : "Cybersecurity news",
          type: "branch",
          level: 1,
          color: "text-blue-500",
          children: newsCategories.map((category) => ({
            id: `news-cat-${category.id}`,
            title:
              language === "ar"
                ? category.name
                : category.nameEn || category.name,
            icon: AlertTriangle,
            href: `/advanced/news/category/${category.id}`,
            description:
              language === "ar"
                ? `أخبار ${category.name}`
                : `News for ${category.nameEn || category.name}`,
            type: "leaf",
            level: 2,
            color: "text-blue-400",
          })),
          loading: loading,
          count: newsCategories.length,
        },
        // {
        //   id: "articles",
        //   title: language === "ar" ? "المقالات" : "Articles",
        //   icon: FileText,
        //   href: "/advanced/articles",
        //   description:
        //     language === "ar" ? "مقالات متخصصة" : "Specialized articles",
        //   type: "leaf",
        //   level: 1,
        //   color: "text-blue-500",
        // },
        {
          id: "awareness-years",
          title: language === "ar" ? "نشرات التوعية" : "Awareness Articles",
          icon: Calendar,
          href: "/advanced/awareness/years",
          description:
            language === "ar"
              ? "أرشيف سنوات التوعية"
              : "Awareness years archive",
          type: "branch",
          level: 1,
          color: "text-blue-500",
          children: awarenessYears.map((year) => ({
            id: `awareness-year-${year.id}`,
            title: year.year.toString(),
            icon: Calendar,
            href: `/advanced/awareness/years/${year.id}`,
            description:
              language === "ar"
                ? `نشرات توعية ${year.year}`
                : `Awareness bulletins for ${year.year}`,
            type: "leaf",
            level: 2,
            color: "text-blue-400",
          })),
          loading: loading,
          count: awarenessYears.length,
        },
      ],
    },
    {
      id: "concepts",
      title:
        language === "ar" ? "مفاهيم الأمن السيبراني" : "Cybersecurity Concepts",
      icon: BookOpen,
      href: "/advanced#concepts",
      description:
        language === "ar"
          ? "التعريفات والقوانين والمعايير"
          : "Definitions, laws, and standards",
      type: "branch",
      color: "text-purple-600",
      gradient: "from-purple-500 to-blue-500",
      children: [
        {
          id: "definitions",
          title: language === "ar" ? "التعريفات" : "Definitions",
          icon: BookOpen,
          href: "/advanced/definitions",
          description:
            language === "ar"
              ? "مصطلحات الأمن السيبراني"
              : "Cybersecurity terms",
          type: "branch",
          level: 1,
          color: "text-purple-500",
          children: definitionCategories.map((category) => ({
            id: `def-cat-${category.id}`,
            title:
              language === "ar"
                ? category.name
                : category.nameEn || category.name,
            icon: CheckCircle,
            href: `/advanced/definitions/category/${category.id}`,
            description:
              language === "ar"
                ? `تعريفات ${category.name}`
                : `Definitions for ${category.nameEn || category.name}`,
            type: "leaf",
            level: 2,
            color: "text-purple-400",
          })),
          loading: loading,
          count: definitionCategories.length,
        },
        {
          id: "laws",
          title: language === "ar" ? "القوانين واللوائح" : "Laws & Regulations",
          icon: Scale,
          href: "/advanced/laws",
          description:
            language === "ar" ? "القوانين التنفيذية" : "Executive laws",
          type: "branch",
          level: 1,
          color: "text-purple-500",
          children: lawCategories.map((category) => ({
            id: `law-cat-${category.id}`,
            title:
              language === "ar"
                ? category.name
                : category.nameEn || category.name,
            icon: Scale,
            href: `/advanced/laws/category/${category.id}`,
            description:
              language === "ar"
                ? `قوانين ${category.name}`
                : `Laws for ${category.nameEn || category.name}`,
            type: "leaf",
            level: 2,
            color: "text-purple-400",
          })),
          loading: loading,
          count: lawCategories.length,
        },
        {
          id: "regulations",
          title: language === "ar" ? "التنظيم" : "Regulation",
          icon: Settings,
          href: "/advanced/regulation",
          description:
            language === "ar" ? "الإطار التنظيمي" : "Regulatory framework",
          type: "branch",
          level: 1,
          color: "text-purple-500",
          children: regulationCategories.map((category) => ({
            id: `regulation-cat-${category.id}`,
            title:
              language === "ar"
                ? category.name
                : category.name_En || category.name,
            icon: Settings,
            href: `/advanced/regulation/category/${category.id}`,
            description:
              language === "ar"
                ? `تنظيم ${category.name}`
                : `Regulation for ${category.name_En || category.name}`,
            type: "branch",
            level: 2,
            color: "text-purple-400",
            children: regulations
              .filter((reg) => reg.id === category.id)
              .flatMap((reg) =>
                reg.regulations.map((regulation) => ({
                  id: `regulation-${regulation.id}`,
                  title:
                    language === "ar"
                      ? regulation.title
                      : regulation.titleEn || regulation.title,
                  icon: FileText,
                  href: `/advanced/regulation/${regulation.id}`,
                  description:
                    language === "ar"
                      ? `تنظيم ${regulation.title}`
                      : `Regulation ${regulation.titleEn || regulation.title}`,
                  type: "leaf" as const,
                  level: 3,
                  color: "text-purple-300",
                }))
              ),
          })),
          loading: loading,
          count: regulationCategories.length,
        },
        {
          id: "framework",
          title: language === "ar" ? "إطار العمل" : "Framework",
          icon: Building2,
          href: "/advanced/framework",
          description:
            language === "ar" ? "إطار العمل الشامل" : "Comprehensive framework",
          type: "leaf",
          level: 1,
          color: "text-purple-500",
        },
        //   {
        //     id: "standards",
        //     title: language === "ar" ? "المعايير" : "Standards",
        //     icon: CheckCircle,
        //     href: "/advanced/standards",
        //     description: language === "ar" ? "المعايير المعتمدة" : "Approved standards",
        //     type: 'branch',
        //     level: 1,
        //     color: 'text-purple-500',
        //     children: standardCategories.map(category => ({
        //       id: `standard-cat-${category.id}`,
        //       title: language === "ar" ? category.nameAr : (category.nameEn || category.nameAr),
        //       icon: CheckCircle,
        //       href: `/advanced/standards/category/${category.id}`,
        //       description: language === "ar" ? `معيار ${category.nameAr}` : `Standard ${category.nameEn || category.nameAr}`,
        //       type: 'leaf',
        //       level: 2,
        //       color: 'text-purple-400',
        //     })),
        //     loading: loading,
        //     count: standardCategories.length,
        //   }
      ],
    },
    {
      id: "requirements",
      title: language === "ar" ? "متطلبات الأمن" : "Security Requirements",
      icon: ShieldCheck,
      href: "/advanced/instructions/category",
      description:
        language === "ar"
          ? "التعليمات والإجراءات الأمنية"
          : "Security instructions and procedures",
      type: "branch",
      color: "text-green-600",
      gradient: "from-green-500 to-emerald-500",
      children: [
        {
          id: "instructions",
          title: language === "ar" ? "التعليمات" : "Instructions",
          icon: FileText,
          href: "/advanced/instructions/category",
          description:
            language === "ar"
              ? "تعليمات الأمن السيبراني"
              : "Cybersecurity instructions",
          type: "branch",
          level: 1,
          color: "text-green-500",
          children: instructions.map((instructionCat) => ({
            id: `instruction-cat-${instructionCat.id}`,
            title:
              language === "ar"
                ? instructionCat.name
                : instructionCat.nameEn || instructionCat.name,
            icon: FileText,
            href: `/advanced/instructions/category/${instructionCat.id}`,
            description:
              language === "ar"
                ? `تعليمات ${instructionCat.name}`
                : `Instructions for ${
                    instructionCat.nameEn || instructionCat.name
                  }`,
            type: "branch",
            level: 2,
            color: "text-green-400",
            children: instructionCat.years.map((year) => ({
              id: `instruction-year-${instructionCat.id}-${year.id}`,
              title: year.year.toString(),
              icon: Calendar,
              href: `/advanced/instructions/category/${instructionCat.id}/year/${year.id}`,
              description:
                language === "ar"
                  ? `تعليمات ${year.year}`
                  : `Instructions for ${year.year}`,
              type: "leaf" as const,
              level: 3,
              color: "text-green-300",
            })),
          })),
          loading: loading,
          count: instructions.length,
        },
        {
          id: "procedures",
          title:
            language === "ar" ? "الإجراءات الأمنية" : "Security Procedures",
          icon: Settings,
          href: "/advanced/procedures",
          description:
            language === "ar" ? "إجراءات تنفيذية" : "Executive procedures",
          type: "branch",
          level: 1,
          color: "text-green-500",
          children: procedures.map((procedure) => ({
            id: `procedure-${procedure.id}`,
            title:
              language === "ar"
                ? procedure.nameAr || procedure.nameEn || ""
                : procedure.nameEn || procedure.nameAr || "",
            icon: Settings,
            href: `/advanced/procedures/${procedure.id}`,
            description:
              language === "ar"
                ? `إجراءات ${procedure.nameAr || procedure.nameEn || ""}`
                : `Procedures for ${
                    procedure.nameEn || procedure.nameAr || ""
                  }`,
            type: "branch" as const,
            level: 2,
            color: "text-green-400",
            children: procedure.controls.map((control) => ({
              id: `procedure-control-${procedure.id}-${control.id}`,
              title:
                language === "ar"
                  ? control.nameAr || control.nameEn || ""
                  : control.nameEn || control.nameAr || "",
              icon: Shield,
              href: `/advanced/procedures/${procedure.id}#control-${control.id}`,
              description:
                language === "ar"
                  ? `ضبط ${control.nameAr || control.nameEn || ""}`
                  : `Control ${control.nameEn || control.nameAr || ""}`,
              type: "branch" as const,
              level: 3,
              color: "text-green-300",
              children: (procedure.safeguards[control.id] || []).map(
                (safeguard) => ({
                  id: `procedure-safeguard-${procedure.id}-${control.id}-${safeguard.id}`,
                  title:
                    language === "ar"
                      ? safeguard.nameAr || safeguard.nameEn || ""
                      : safeguard.nameEn || safeguard.nameAr || "",
                  icon: ShieldCheck,
                  href: `/advanced/procedures/${procedure.id}#safeguard-${safeguard.id}`,
                  description:
                    language === "ar"
                      ? `ضمان ${safeguard.nameAr || safeguard.nameEn || ""}`
                      : `Safeguard ${
                          safeguard.nameEn || safeguard.nameAr || ""
                        }`,
                  type: "branch" as const,
                  level: 4,
                  color: "text-green-200",
                  children: (procedure.techniques[safeguard.id] || []).map(
                    (technique) => ({
                      id: `procedure-technique-${procedure.id}-${control.id}-${safeguard.id}-${technique.id}`,
                      title:
                        language === "ar"
                          ? technique.nameAr || technique.nameEn || ""
                          : technique.nameEn || technique.nameAr || "",
                      icon: Target,
                      href: `/advanced/procedures/${procedure.id}#technique-${technique.id}`,
                      description:
                        language === "ar"
                          ? `تقنية ${
                              technique.nameAr || technique.nameEn || ""
                            }`
                          : `Technique ${
                              technique.nameEn || technique.nameAr || ""
                            }`,
                      type: "leaf" as const,
                      level: 5,
                      color: "text-green-100",
                    })
                  ),
                })
              ),
            })),
          })),
        },
        //   {
        //     id: "personal-protection",
        //     title: language === "ar" ? "الحماية الشخصية" : "Personal Protection",
        //     icon: Lock,
        //     href: "/advanced/personal-protect",
        //     description: language === "ar" ? "إجراءات الحماية الشخصية" : "Personal protection procedures",
        //     type: 'leaf',
        //     level: 1,
        //     color: 'text-green-500',
        //   },
      ],
    },
    {
      id: "media",
      title: language === "ar" ? "المكتبة الوثائقية" : "Document Library",
      icon: Video,
      href: "/advanced/videos",
      description:
        language === "ar"
          ? "المكتبة الثقافية وال"
          : "Educational media library",
      type: "branch",
      color: "text-blue-600",
      gradient: "from-blue-500 to-blue-500",
      children: [
        {
          id: "videos",
          title: language === "ar" ? "فيديوهات" : "Videos",
          icon: Play,
          href: "/advanced/videos",
          description:
            language === "ar" ? "مقاطع فيديو " : "Educational videos",
          type: "branch",
          level: 1,
          color: "text-blue-500",
          children: videoCategories.map((category) => ({
            id: `video-cat-${category.id}`,
            title:
              language === "ar"
                ? category.name
                : category.nameEn || category.name,
            icon: Play,
            href: `/advanced/videos/category/${category.id}`,
            description:
              language === "ar"
                ? `فيديوهات ${category.name}`
                : `Videos for ${category.nameEn || category.name}`,
            type: "leaf",
            level: 2,
            color: "text-blue-400",
          })),
          loading: loading,
          count: videoCategories.length,
        },
        {
          id: "lectures",
          title: language === "ar" ? "المحاضرات" : "Lectures",
          icon: GraduationCap,
          href: "/advanced/lectures",
          description:
            language === "ar"
              ? "محاضرات متخصصة"
              : "Specialized educational lectures",
          type: "leaf",
          level: 1,
          color: "text-blue-500",
        },
      ],
    },
    {
      id: "systems",
      title: language === "ar" ? "الأنظمة" : "Systems",
      icon: Database,
      href: "/advanced/systems",
      description:
        language === "ar"
          ? "المنظومات الرئيسية والمساعدة"
          : "Main and helper systems",
      type: "branch",
      color: "text-indigo-600",
      gradient: "from-indigo-500 to-purple-500",
      children: [
        {
          id: "main-systems",
          title: language === "ar" ? "المنظومات الرئيسية" : "Main Systems",
          icon: Database,
          href: "/advanced/systems",
          description: language === "ar" ? "الأنظمة الأساسية" : "Core systems",
          type: "leaf",
          level: 1,
          color: "text-indigo-500",
        },
        {
          id: "helper-systems",
          title: language === "ar" ? "الأنظمة المساعدة" : "Helper Systems",
          icon: Settings,
          href: "/advanced/helper-systems",
          description: language === "ar" ? "أنظمة الدعم" : "Support systems",
          type: "leaf",
          level: 1,
          color: "text-indigo-500",
        },
      ],
    },
    {
      id: "search",
      title: language === "ar" ? "البحث" : "Search",
      icon: Search,
      href: "/advanced/search",
      description: language === "ar" ? "البحث في المحتوى" : "Search content",
      type: "root",
      color: "text-blue-600",
      gradient: "from-blue-500 to-blue-500",
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
      const hoverStyles = isHovered
        ? "scale-[1.02] shadow-md"
        : "hover:scale-[1.01]";

      if (node.type === "root") {
        return `${baseStyles} ${hoverStyles} bg-gradient-to-r ${node.gradient} text-white rounded-2xl p-6 shadow-xl border-2 border-white/30 backdrop-blur-sm`;
      } else if (node.type === "branch") {
        return `${baseStyles} ${hoverStyles} bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl`;
      } else {
        // Add margin bottom for leaf nodes (categories)
        return `${baseStyles} ${hoverStyles} bg-slate-50 dark:bg-slate-700 rounded-lg p-3 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-400 hover:shadow-lg mb-3`;
      }
    };

    const getIconStyles = () => {
      if (node.type === "root") {
        return "h-8 w-8 text-white";
      } else if (node.type === "branch") {
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
                isRtl ? "right-0" : "left-0"
              }`}
              style={{
                [isRtl ? "right" : "left"]: `${indentLevel - lineOffset}px`,
              }}
            />

            {/* Horizontal connecting line - thicker and longer */}
            <div
              className={`absolute top-8 w-20 h-2 bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-300 shadow-lg ${
                isRtl ? "right-0" : "left-0"
              }`}
              style={{ [isRtl ? "right" : "left"]: `${indentLevel - 80}px` }}
            />

            {/* Connection point - larger circle */}
            <div
              className={`absolute top-7 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full border-3 border-white dark:border-slate-800 shadow-lg ${
                isRtl ? "right-0" : "left-0"
              }`}
              style={{
                [isRtl ? "right" : "left"]: `${indentLevel - lineOffset - 8}px`,
              }}
            />
          </>
        )}

        <div
          className={`${getNodeStyles()} ${isRtl ? "mr-8" : "ml-8"} ${
            hasChildren ? "cursor-pointer" : ""
          }`}
          style={{ [isRtl ? "marginRight" : "marginLeft"]: `${indentLevel}px` }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={hasChildren ? () => toggleSection(node.id) : undefined}
          role={hasChildren ? "button" : undefined}
          tabIndex={hasChildren ? 0 : undefined}
          onKeyDown={
            hasChildren
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleSection(node.id);
                  }
                }
              : undefined
          }
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={
            hasChildren
              ? `${node.title} - ${isExpanded ? "Collapse" : "Expand"} section`
              : node.title
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1 min-w-0">
              {/* Enhanced Icon with better styling */}
              <div className="flex-shrink-0 relative">
                <div
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    node.type === "root"
                      ? "bg-white/25 backdrop-blur-sm shadow-lg"
                      : node.type === "branch"
                      ? "bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 shadow-md"
                      : "bg-slate-50 dark:bg-slate-600 border-2 border-slate-100 dark:border-slate-500 shadow-sm"
                  }`}
                >
                  <node.icon className={getIconStyles()} />
                </div>

                {/* Enhanced Glow Effect */}
                {isHovered && (
                  <div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-r ${
                      node.gradient || "from-blue-500 to-blue-500"
                    } opacity-20 blur-sm`}
                  />
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
                        node.type === "root"
                          ? "text-white text-xl"
                          : hasChildren
                          ? "text-slate-900 dark:text-slate-100 text-lg"
                          : "text-slate-800 dark:text-slate-200 text-base"
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
                        node.type === "root"
                          ? "text-white text-xl"
                          : "text-slate-900 dark:text-slate-100 text-lg"
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
                        node.type === "root"
                          ? "text-white text-xl"
                          : "text-slate-800 dark:text-slate-200 text-base"
                      }`}
                    >
                      {node.title}
                    </span>
                  )}

                  {/* Enhanced Badges */}
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    {node.count !== undefined && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          node.type === "root"
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
                        }`}
                      >
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
                  <p
                    className={`mt-2 truncate ${
                      node.type === "root"
                        ? "text-white/90 text-base"
                        : "text-slate-600 dark:text-slate-300 text-sm"
                    }`}
                  >
                    {node.description}
                  </p>
                )}
              </div>
            </div>

            {/* Enhanced Actions */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {hasChildren && (
                <div
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    node.type === "root"
                      ? "text-white/80"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
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
                    node.type === "root"
                      ? "hover:bg-white/20 text-white border border-white/20"
                      : "hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-500 border border-blue-200 dark:border-blue-700"
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
              {node.children?.map((child) => renderTreeNode(child, level + 1))}
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
        <div
          key={node.id}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors overflow-hidden mb-4"
        >
          <div
            className={`${
              hasGradient
                ? `bg-gradient-to-r ${node.gradient} text-white`
                : "bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            } p-4`}
          >
            <div className="flex items-center justify-between">
              <div
                className="flex items-center space-x-3 rtl:space-x-reverse"
                style={{
                  [isRtl ? "marginRight" : "marginLeft"]: `${indentLevel}px`,
                }}
              >
                <node.icon
                  className={`h-7 w-7 ${
                    hasGradient
                      ? "text-white"
                      : "text-blue-600 dark:text-blue-300"
                  }`}
                />
                <div>
                  {node.href ? (
                    <Link
                      href={node.href}
                      className={`text-xl font-bold hover:underline ${
                        hasGradient
                          ? "text-white hover:text-blue-50"
                          : "text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-300"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {node.title}
                    </Link>
                  ) : (
                    <h3
                      className={`text-xl font-bold ${
                        hasGradient
                          ? "text-white"
                          : "text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {node.title}
                    </h3>
                  )}
                  {node.description && (
                    <p
                      className={`${
                        hasGradient
                          ? "text-white/90"
                          : "text-slate-600 dark:text-slate-300"
                      } text-base`}
                    >
                      {node.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {node.count !== undefined && (
                  <span
                    className={`${
                      hasGradient
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    } px-3 py-1 rounded-full text-base font-semibold`}
                  >
                    {node.count}
                  </span>
                )}
                {hasChildren && (
                  <button
                    onClick={() => toggleSection(node.id)}
                    className={`${
                      hasGradient
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100"
                    } p-3 rounded-lg transition-all duration-200`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                )}
                {node.href && (
                  <Link
                    href={node.href}
                    className={`${
                      hasGradient
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100"
                    } p-3 rounded-lg transition-all duration-200`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Show children in list */}
          {hasChildren && isExpanded && (
            <div className="p-4 space-y-3 bg-white dark:bg-slate-800">
              {node.children?.map((child) =>
                renderNodeInList(child, level + 1)
              )}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {sitemapData.map((section) => renderNodeInList(section))}
      </div>
    );
  };

  const totalCategories =
    definitionCategories.length +
    newsCategories.length +
    videoCategories.length;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Header */}
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-6">
                <div className="relative">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-500 shadow-lg">
                    <Map className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 p-1 rounded-full bg-blue-400">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                    {language === "ar"
                      ? "خريطة الموقع التفاعلية"
                      : "Interactive Site Map"}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                    {language === "ar"
                      ? "استكشف جميع صفحات ومحتويات الموقع بطريقة تفاعلية ومرتبة"
                      : "Explore all website pages and content in an interactive and organized way"}
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
                    placeholder={
                      language === "ar"
                        ? "البحث في الموقع..."
                        : "Search the site..."
                    }
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
                  {(["tree", "list"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        viewMode === mode
                          ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {mode === "tree"
                        ? language === "ar"
                          ? "شجرة"
                          : "Tree"
                        : language === "ar"
                        ? "قائمة"
                        : "List"}
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
                  className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Minus className="h-4 w-4" />
                  <span>{language === "ar" ? "طي الكل" : "Collapse All"}</span>
                </button>
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
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-500">
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
              {viewMode === "tree" && (
                <div className="space-y-6">
                  {sitemapData.map((section) => renderTreeNode(section))}
                </div>
              )}

              {viewMode === "list" && renderListView()}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
