"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/components/language-provider";
import { useSecurityProcedures } from "@/core/hooks/use-security-procedures";
import {
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Calendar,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  findEntityBySlugOrId,
  generateSecurityProcedureUrls,
} from "@/lib/security-procedures-utils";

interface ImplementationStepDetailPageClientProps {
  standardSlug: string;
  controlSlug: string;
  safeguardSlug: string;
  techniqueSlug: string;
  implementationSlug: string;
}

export default function ImplementationStepDetailPageClient({
  standardSlug,
  controlSlug,
  safeguardSlug,
  techniqueSlug,
  implementationSlug,
}: ImplementationStepDetailPageClientProps) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [standard, setStandard] = useState<any>(null);
  const [control, setControl] = useState<any>(null);
  const [safeguard, setSafeguard] = useState<any>(null);
  const [technique, setTechnique] = useState<any>(null);
  const [implementationStep, setImplementationStep] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    getStandards,
    getControlsByStandardId,
    getSafeguardsByControlId,
    getTechniquesBySafeguardId,
    getImplementationStepsByTechniqueId,
  } = useSecurityProcedures();

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get standards
        const standards = await getStandards();
        const foundStandard = findEntityBySlugOrId(standards, standardSlug);

        if (!foundStandard) {
          setError("Standard not found");
          return;
        }

        setStandard(foundStandard);

        // Get controls for this standard
        const controls = await getControlsByStandardId(foundStandard.id);
        const foundControl = findEntityBySlugOrId(
          controls.map((c: any) => ({ id: c.control.id, nameEn: c.control.nameEn })),
          controlSlug
        );

        if (!foundControl) {
          setError("Control not found");
          return;
        }

        // Find the full control object
        const fullControl = controls.find(
          (c: any) => c.control.id === foundControl.id
        )?.control;
        setControl(fullControl);

        // Get safeguards for this control
        const safeguards = await getSafeguardsByControlId(foundControl.id);
        const foundSafeguard = findEntityBySlugOrId(safeguards, safeguardSlug);

        if (!foundSafeguard) {
          setError("Safeguard not found");
          return;
        }

        setSafeguard(foundSafeguard);

        // Get techniques for this safeguard
        const techniques = await getTechniquesBySafeguardId(foundSafeguard.id);
        const foundTechnique = findEntityBySlugOrId(
          techniques.map((t: any) => ({
            id: t.technique.id,
            nameEn: t.technique.nameEn,
          })),
          techniqueSlug
        );

        if (!foundTechnique) {
          setError("Technique not found");
          return;
        }

        // Find the full technique object
        const fullTechnique = techniques.find(
          (t: any) => t.technique.id === foundTechnique.id
        )?.technique;
        setTechnique(fullTechnique);

        // Get implementation steps for this technique
        const implementationStepsResult = await getImplementationStepsByTechniqueId(
          foundTechnique.id
        );
        const implementationSteps = implementationStepsResult.implementationSteps || implementationStepsResult;
        const foundImplementationStep = findEntityBySlugOrId(
          implementationSteps,
          implementationSlug
        );

        if (!foundImplementationStep) {
          setError("Implementation step not found");
          return;
        }

        setImplementationStep(foundImplementationStep);
      } catch (err) {
        console.error("Error loading implementation step detail:", err);
        setError("Failed to load implementation step details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    standardSlug,
    controlSlug,
    safeguardSlug,
    techniqueSlug,
    implementationSlug,
    getStandards,
    getControlsByStandardId,
    getSafeguardsByControlId,
    getTechniquesBySafeguardId,
    getImplementationStepsByTechniqueId,
  ]);

  const handleBack = () => {
    if (standard && control && safeguard && technique) {
      const urls = generateSecurityProcedureUrls(
        standard,
        control,
        safeguard,
        technique
      );
      router.push(urls.techniqueUrl!);
    } else {
      router.back();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("common.error")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
              {error}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("common.retry")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
        <div className="container mx-auto px-4 py-8 max-w-full 2xl:max-w-[1600px]">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const title =
    language === "ar"
      ? implementationStep?.implementationStep.implementationStepName
      : implementationStep?.implementationStep.nameEn;
  const description =
    language === "ar"
      ? implementationStep?.implementationStep.implementationStepDescription
      : implementationStep?.implementationStep.descriptionEn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 max-w-full 2xl:max-w-[1600px]">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {implementationStep?.implementationStep?.approval && (
                        <Badge
                          variant="secondary"
                          className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                        >
                          {t("common.approved")}
                        </Badge>
                      )}
                      {implementationStep?.implementationStep?.online && (
                        <Badge
                          variant="outline"
                          className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                        >
                          {t("common.online")}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="border-gray-200 dark:border-gray-700"
                      >
                        {`${t("common.order")}: ${
                          implementationStep?.implementationStep?.order || 0
                        }`}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t("common.description")}
                  </h3>
                  <div
                    className="prose prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: description || "" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Metadata Card */}
            <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {t("common.details")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t("common.order")}
                    </span>
                    <Badge variant="outline">
                      {implementationStep?.implementationStep?.order || 0}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t("common.status")}
                    </span>
                    <div className="flex gap-1">
                      {implementationStep?.implementationStep?.approval ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                        >
                          {t("common.approved")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300"
                        >
                          {t("common.pending")}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t("common.availability")}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        implementationStep?.implementationStep?.online
                          ? "border-green-200 dark:border-green-700 text-green-700 dark:text-green-300"
                          : "border-gray-200 dark:border-gray-700"
                      }
                    >
                      {implementationStep?.implementationStep?.online
                        ? t("common.online")
                        : t("common.offline")}
                    </Badge>
                  </div>

                  {implementationStep?.implementationStep?.approvalDate && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {t("common.approvalDate")}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(
                            implementationStep.implementationStep.approvalDate
                          ).toLocaleDateString(
                            language === "ar" ? "ar-SA" : "en-US"
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hierarchy Card */}
            <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("common.hierarchy")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("securityProcedures.standard")}:
                    </span>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {language === "ar"
                        ? standard?.standardName
                        : standard?.nameEn}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("securityProcedures.control")}:
                    </span>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {language === "ar"
                        ? control?.controlTitle
                        : control?.nameEn}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("securityProcedures.safeguard")}:
                    </span>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {language === "ar"
                        ? safeguard?.safeGuardTitle
                        : safeguard?.nameEn}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("securityProcedures.technique")}:
                    </span>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {language === "ar"
                        ? technique?.techniqueName
                        : technique?.nameEn}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
