"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useClientAuth, getInitials, UpdateClientProfileDto } from "@/contexts/client-auth-context";
import { container } from "@/core/di/container";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, ArrowRight, Lock, Edit2, Save, X, User, Shield, Sparkles, Phone, Building, Hash, Globe, Sun, Moon, Camera, Upload } from "lucide-react";
import Link from "next/link";

// Military ranks
const RANKS = [
      "جندي",
      "جندي أول",
      "عريف",
      "وكيل رقيب",
      "رقيب",
      "رقيب أول",
      "رئيس رقباء",
      "ملازم",
      "ملازم أول",
      "نقيب",
      "رائد",
      "مقدم",
      "عقيد",
      "عميد",
      "لواء",
      "فريق",
      "فريق أول",
];

export default function ProfilePage() {
      const { client, isLoading, isAuthenticated, updateProfile, error, clearError } = useClientAuth();
      const { t, language, setLanguage, isRtl } = useLanguage();
      const { theme, setTheme } = useTheme();
      const router = useRouter();
      const fileInputRef = useRef<HTMLInputElement>(null);

      const [isEditing, setIsEditing] = useState(false);
      const [isSaving, setIsSaving] = useState(false);
      const [formData, setFormData] = useState<UpdateClientProfileDto>({});
      const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

      const isDark = theme === "dark";

      // Redirect if not authenticated
      useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                  router.push("/login");
            }
      }, [isLoading, isAuthenticated, router]);

      // Initialize form data when client loads
      useEffect(() => {
            if (client) {
                  setFormData({
                        firstName: client.firstName,
                        lastName: client.lastName,
                        personalPhone: client.personalPhone,
                        rank: client.rank,
                        itBranch: client.itBranch,
                        cdm: client.cdm || "",
                        strategicNumber: client.strategicNumber || "",
                  });
                  setAvatarPreview(client.avatar || null);
            }
      }, [client]);

      const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

      const handleAvatarClick = () => {
            // Allow avatar upload anytime (not just in edit mode)
            fileInputRef.current?.click();
      };

      const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Show preview immediately
            const reader = new FileReader();
            reader.onload = (event) => {
                  setAvatarPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to backend immediately using the service
            setIsUploadingAvatar(true);
            try {
                  const response = await container.services.clientAuth.uploadAvatar(file);
                  if (response) {
                        // Update preview with the actual server URL (already transformed by repository)
                        setAvatarPreview(response.avatarUrl);
                  }
            } catch (error) {
                  console.error("Avatar upload error:", error);
                  setAvatarPreview(client?.avatar || null);
            } finally {
                  setIsUploadingAvatar(false);
            }
      };

      const handleSave = async () => {
            setIsSaving(true);
            clearError();

            const success = await updateProfile(formData);

            if (success) {
                  setIsEditing(false);
            }

            setIsSaving(false);
      };

      const handleCancel = () => {
            if (client) {
                  setFormData({
                        firstName: client.firstName,
                        lastName: client.lastName,
                        personalPhone: client.personalPhone,
                        rank: client.rank,
                        itBranch: client.itBranch,
                        cdm: client.cdm || "",
                        strategicNumber: client.strategicNumber || "",
                  });
                  setAvatarPreview(client.avatar || null);
            }
            setIsEditing(false);
            clearError();
      };

      const toggleLanguage = () => {
            setLanguage(language === "ar" ? "en" : "ar");
      };

      const toggleTheme = () => {
            setTheme(theme === "dark" ? "light" : "dark");
      };

      const BackArrow = isRtl ? ArrowRight : ArrowLeft;

      if (isLoading || !client) {
            return (
                  <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100"}`}>
                        <div className="flex flex-col items-center gap-4">
                              <Loader2 className="h-10 w-10 animate-spin text-green-500" />
                              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{t("common.loading")}</p>
                        </div>
                  </div>
            );
      }

      return (
            <div
                  className={`min-h-screen p-4 md:p-8 relative overflow-hidden transition-colors duration-300`}
                  dir={isRtl ? "rtl" : "ltr"}
            >
                  {/* Background */}
                  <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100"}`} />

                  {/* Animated Background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-gradient-to-br from-green-500/10 to-emerald-600/5" : "bg-gradient-to-br from-green-400/20 to-emerald-500/10"}`} />
                        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-gradient-to-tr from-emerald-500/10 to-green-600/5" : "bg-gradient-to-tr from-emerald-400/20 to-green-500/10"}`} />
                        <div className={`absolute inset-0 ${isDark ? "bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)]"} bg-[size:50px_50px]`} />
                  </div>

                  <div className="relative max-w-3xl mx-auto z-10">
                        {/* Top Bar */}
                        <div className="flex items-center justify-between mb-6">
                              <Link
                                    href="/simple"
                                    className={`inline-flex items-center gap-2 transition-all duration-300 group ${isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
                              >
                                    <BackArrow className="h-4 w-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                                    <span className="font-medium">{t("common.back")}</span>
                              </Link>

                              <div className="flex items-center gap-2">
                                    {/* Theme Toggle */}
                                    <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={toggleTheme}
                                          className={`gap-2 rounded-xl transition-all ${isDark ? "text-slate-400 hover:text-white hover:bg-slate-800/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
                                    >
                                          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    </Button>

                                    {/* Language Toggle */}
                                    <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={toggleLanguage}
                                          className={`gap-2 rounded-xl transition-all ${isDark ? "text-slate-400 hover:text-white hover:bg-slate-800/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
                                    >
                                          <Globe className="h-4 w-4" />
                                          <span className="text-sm font-medium">{language === "ar" ? "EN" : "ع"}</span>
                                    </Button>
                              </div>
                        </div>

                        {/* Profile Card */}
                        <div className="relative">
                              {/* Card Glow */}
                              <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-50 ${isDark ? "bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10" : "bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20"}`} />

                              <Card className={`relative backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden ${isDark ? "bg-slate-900/80 border-slate-700/50" : "bg-white/90 border-slate-200"}`}>
                                    {/* Header Section */}
                                    <CardHeader className="text-center pb-0 pt-8">
                                          {/* Avatar with Upload */}
                                          <div className="flex justify-center mb-6">
                                                <div className="relative group">
                                                      {/* Hidden file input */}
                                                      <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleAvatarChange}
                                                            className="hidden"
                                                      />

                                                      {/* Avatar Glow */}
                                                      <div className="absolute -inset-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />

                                                      {avatarPreview ? (
                                                            <img
                                                                  src={avatarPreview}
                                                                  alt={client.firstName}
                                                                  onClick={handleAvatarClick}
                                                                  className={`relative h-28 w-28 rounded-full object-cover border-4 shadow-xl cursor-pointer hover:opacity-80 transition-opacity ${isDark ? "border-slate-700" : "border-slate-200"}`}
                                                            />
                                                      ) : (
                                                            <div
                                                                  onClick={handleAvatarClick}
                                                                  className={`relative h-28 w-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold border-4 shadow-xl cursor-pointer hover:opacity-80 transition-opacity ${isDark ? "border-slate-700" : "border-slate-200"}`}
                                                            >
                                                                  {getInitials(client.firstName, client.lastName)}
                                                            </div>
                                                      )}

                                                      {/* Upload overlay - always visible on hover */}
                                                      <div
                                                            onClick={handleAvatarClick}
                                                            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                      >
                                                            {isUploadingAvatar ? (
                                                                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                                                            ) : (
                                                                  <Camera className="h-8 w-8 text-white" />
                                                            )}
                                                      </div>

                                                      {/* Status Badge */}
                                                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 flex items-center justify-center ${isDark ? "border-slate-900" : "border-white"}`}>
                                                            <Sparkles className="h-3 w-3 text-white" />
                                                      </div>
                                                </div>
                                          </div>

                                          <CardTitle className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                                                {client.firstName} {client.lastName}
                                          </CardTitle>
                                          <CardDescription className={`flex items-center justify-center gap-2 mt-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                <Shield className="h-4 w-4" />
                                                {client.rank} • {client.itBranch}
                                          </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-6 md:p-8 space-y-8">
                                          {/* Error Message */}
                                          {error && (
                                                <div className={`p-4 rounded-xl text-sm text-center animate-in fade-in slide-in-from-top-2 ${isDark ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-red-50 border border-red-200 text-red-600"}`}>
                                                      {error}
                                                </div>
                                          )}

                                          {/* Read-Only Fields Section */}
                                          <div className="space-y-4">
                                                <div className="flex items-center gap-3 pb-2">
                                                      <div className={`p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                                                            <Lock className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                                      </div>
                                                      <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                            {t("profile.lockedFields")}
                                                      </h3>
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-3">
                                                      <div className="space-y-2">
                                                            <Label className={`text-xs font-medium flex items-center gap-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                                                  <Hash className="h-3 w-3" />
                                                                  {t("profile.sNumber")}
                                                            </Label>
                                                            <Input
                                                                  value={client.sNumber}
                                                                  disabled
                                                                  className={`h-11 cursor-not-allowed rounded-xl ${isDark ? "bg-slate-800/30 border-slate-700/30 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"}`}
                                                            />
                                                      </div>
                                                      <div className="space-y-2">
                                                            <Label className={`text-xs font-medium flex items-center gap-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                                                  <Hash className="h-3 w-3" />
                                                                  {t("profile.mNumber")}
                                                            </Label>
                                                            <Input
                                                                  value={client.mNumber}
                                                                  disabled
                                                                  className={`h-11 cursor-not-allowed rounded-xl ${isDark ? "bg-slate-800/30 border-slate-700/30 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"}`}
                                                            />
                                                      </div>
                                                      <div className="space-y-2">
                                                            <Label className={`text-xs font-medium flex items-center gap-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                                                  <User className="h-3 w-3" />
                                                                  {t("profile.username")}
                                                            </Label>
                                                            <Input
                                                                  value={client.userName}
                                                                  disabled
                                                                  className={`h-11 cursor-not-allowed rounded-xl ${isDark ? "bg-slate-800/30 border-slate-700/30 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"}`}
                                                            />
                                                      </div>
                                                </div>
                                          </div>

                                          <Separator className={isDark ? "bg-slate-700/50" : "bg-slate-200"} />

                                          {/* Editable Fields Section */}
                                          <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${isDark ? "bg-green-500/10" : "bg-green-50"}`}>
                                                                  <Edit2 className="h-4 w-4 text-green-500" />
                                                            </div>
                                                            <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                                                  {t("profile.editableFields")}
                                                            </h3>
                                                      </div>
                                                      {!isEditing && (
                                                            <Button
                                                                  size="sm"
                                                                  onClick={() => setIsEditing(true)}
                                                                  className="rounded-xl transition-all bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-md hover:shadow-lg"
                                                            >
                                                                  <Edit2 className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                                                                  {t("common.edit")}
                                                            </Button>
                                                      )}
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                      {/* First Name */}
                                                      <div className="space-y-2">
                                                            <Label className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t("profile.firstName")}</Label>
                                                            <Input
                                                                  value={formData.firstName || ""}
                                                                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                                  disabled={!isEditing}
                                                                  className={`h-11 rounded-xl transition-all duration-300 ${isEditing
                                                                        ? isDark
                                                                              ? "bg-slate-800/50 border-slate-600 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                              : "bg-white border-slate-300 text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                        : isDark
                                                                              ? "bg-slate-800/30 border-slate-700/50 text-slate-300"
                                                                              : "bg-slate-50 border-slate-200 text-slate-700"
                                                                        }`}
                                                            />
                                                      </div>

                                                      {/* Last Name */}
                                                      <div className="space-y-2">
                                                            <Label className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t("profile.lastName")}</Label>
                                                            <Input
                                                                  value={formData.lastName || ""}
                                                                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                                  disabled={!isEditing}
                                                                  className={`h-11 rounded-xl transition-all duration-300 ${isEditing
                                                                        ? isDark
                                                                              ? "bg-slate-800/50 border-slate-600 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                              : "bg-white border-slate-300 text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                        : isDark
                                                                              ? "bg-slate-800/30 border-slate-700/50 text-slate-300"
                                                                              : "bg-slate-50 border-slate-200 text-slate-700"
                                                                        }`}
                                                            />
                                                      </div>

                                                      {/* Rank Dropdown */}
                                                      <div className="space-y-2">
                                                            <Label className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                                  <Shield className={`h-3.5 w-3.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                                                  {t("profile.rank")}
                                                            </Label>
                                                            <Select
                                                                  value={formData.rank}
                                                                  onValueChange={(value) => setFormData({ ...formData, rank: value })}
                                                                  disabled={!isEditing}
                                                            >
                                                                  <SelectTrigger className={`h-11 rounded-xl transition-all duration-300 ${isEditing
                                                                        ? isDark
                                                                              ? "bg-slate-800/50 border-slate-600 text-white"
                                                                              : "bg-white border-slate-300 text-slate-900"
                                                                        : isDark
                                                                              ? "bg-slate-800/30 border-slate-700/50 text-slate-300"
                                                                              : "bg-slate-50 border-slate-200 text-slate-700"
                                                                        }`}>
                                                                        <SelectValue />
                                                                  </SelectTrigger>
                                                                  <SelectContent className={`rounded-xl ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                                                                        {RANKS.map((rank) => (
                                                                              <SelectItem key={rank} value={rank} className={`rounded-lg ${isDark ? "text-white hover:bg-slate-700" : "text-slate-900 hover:bg-slate-100"}`}>
                                                                                    {rank}
                                                                              </SelectItem>
                                                                        ))}
                                                                  </SelectContent>
                                                            </Select>
                                                      </div>

                                                      {/* Phone */}
                                                      <div className="space-y-2">
                                                            <Label className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                                  <Phone className={`h-3.5 w-3.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                                                  {t("profile.phone")}
                                                            </Label>
                                                            <Input
                                                                  value={formData.personalPhone || ""}
                                                                  onChange={(e) => setFormData({ ...formData, personalPhone: e.target.value })}
                                                                  disabled={!isEditing}
                                                                  className={`h-11 rounded-xl transition-all duration-300 ${isEditing
                                                                        ? isDark
                                                                              ? "bg-slate-800/50 border-slate-600 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                              : "bg-white border-slate-300 text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                        : isDark
                                                                              ? "bg-slate-800/30 border-slate-700/50 text-slate-300"
                                                                              : "bg-slate-50 border-slate-200 text-slate-700"
                                                                        }`}
                                                            />
                                                      </div>

                                                      {/* IT Branch - Full Width */}
                                                      <div className="space-y-2 md:col-span-2">
                                                            <Label className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                                  <Building className={`h-3.5 w-3.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                                                  {t("profile.itBranch")}
                                                            </Label>
                                                            <Input
                                                                  value={formData.itBranch || ""}
                                                                  onChange={(e) => setFormData({ ...formData, itBranch: e.target.value })}
                                                                  disabled={!isEditing}
                                                                  className={`h-11 rounded-xl transition-all duration-300 ${isEditing
                                                                        ? isDark
                                                                              ? "bg-slate-800/50 border-slate-600 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                              : "bg-white border-slate-300 text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                        : isDark
                                                                              ? "bg-slate-800/30 border-slate-700/50 text-slate-300"
                                                                              : "bg-slate-50 border-slate-200 text-slate-700"
                                                                        }`}
                                                            />
                                                      </div>

                                                      {/* CDM */}
                                                      <div className="space-y-2">
                                                            <Label className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t("profile.cdm")}</Label>
                                                            <Input
                                                                  value={formData.cdm || ""}
                                                                  onChange={(e) => setFormData({ ...formData, cdm: e.target.value })}
                                                                  disabled={!isEditing}
                                                                  placeholder={t("profile.optional")}
                                                                  className={`h-11 rounded-xl transition-all duration-300 ${isEditing
                                                                        ? isDark
                                                                              ? "bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                              : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                        : isDark
                                                                              ? "bg-slate-800/30 border-slate-700/50 text-slate-300"
                                                                              : "bg-slate-50 border-slate-200 text-slate-700"
                                                                        }`}
                                                            />
                                                      </div>

                                                      {/* Strategic Number */}
                                                      <div className="space-y-2">
                                                            <Label className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t("profile.strategicNumber")}</Label>
                                                            <Input
                                                                  value={formData.strategicNumber || ""}
                                                                  onChange={(e) => setFormData({ ...formData, strategicNumber: e.target.value })}
                                                                  disabled={!isEditing}
                                                                  placeholder={t("profile.optional")}
                                                                  className={`h-11 rounded-xl transition-all duration-300 ${isEditing
                                                                        ? isDark
                                                                              ? "bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                              : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                        : isDark
                                                                              ? "bg-slate-800/30 border-slate-700/50 text-slate-300"
                                                                              : "bg-slate-50 border-slate-200 text-slate-700"
                                                                        }`}
                                                            />
                                                      </div>
                                                </div>

                                                {/* Save/Cancel Buttons */}
                                                {isEditing && (
                                                      <div className="flex gap-3 mt-6 pt-4">
                                                            <Button
                                                                  onClick={handleCancel}
                                                                  disabled={isSaving}
                                                                  className={`rounded-xl transition-all font-medium ${isDark
                                                                        ? "bg-slate-700 text-white border border-slate-600 hover:bg-slate-600"
                                                                        : "bg-slate-200 text-slate-800 border border-slate-300 hover:bg-slate-300"}`}
                                                            >
                                                                  <X className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                                                                  {t("common.cancel")}
                                                            </Button>
                                                            <Button
                                                                  onClick={handleSave}
                                                                  disabled={isSaving}
                                                                  className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]"
                                                            >
                                                                  {isSaving ? (
                                                                        <>
                                                                              <Loader2 className={`h-4 w-4 animate-spin ${isRtl ? "ml-2" : "mr-2"}`} />
                                                                              {t("common.saving")}
                                                                        </>
                                                                  ) : (
                                                                        <>
                                                                              <Save className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                                                                              {t("common.save")}
                                                                        </>
                                                                  )}
                                                            </Button>
                                                      </div>
                                                )}
                                          </div>

                                          <Separator className={isDark ? "bg-slate-700/50" : "bg-slate-200"} />

                                          {/* Change Password Link */}
                                          <div className="text-center pt-2">
                                                <Link
                                                      href="/change-password"
                                                      className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors text-sm font-medium hover:underline"
                                                >
                                                      <Lock className="h-4 w-4" />
                                                      {t("profile.changePassword")}
                                                </Link>
                                          </div>
                                    </CardContent>
                              </Card>
                        </div>
                  </div>
            </div>
      );
}
