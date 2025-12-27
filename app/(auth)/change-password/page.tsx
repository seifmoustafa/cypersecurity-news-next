"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useClientAuth } from "@/contexts/client-auth-context";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, KeyRound, ArrowLeft, ArrowRight, Eye, EyeOff, AlertTriangle, Lock, ShieldCheck, Globe, Sun, Moon, Check, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Password validation rules
const passwordRules = [
      { key: "minLength", test: (p: string) => p.length >= 8, labelEn: "At least 8 characters", labelAr: "8 أحرف على الأقل" },
      { key: "uppercase", test: (p: string) => /[A-Z]/.test(p), labelEn: "One uppercase letter", labelAr: "حرف كبير واحد" },
      { key: "lowercase", test: (p: string) => /[a-z]/.test(p), labelEn: "One lowercase letter", labelAr: "حرف صغير واحد" },
      { key: "number", test: (p: string) => /[0-9]/.test(p), labelEn: "One number", labelAr: "رقم واحد" },
      { key: "special", test: (p: string) => /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/.test(p), labelEn: "One special character (!@#$%...)", labelAr: "رمز خاص (!@#$%...)" },
];

export default function ChangePasswordPage() {
      const { client, isLoading, isAuthenticated, mustChangePassword, changePassword, error, clearError } = useClientAuth();
      const { t, language, setLanguage, isRtl } = useLanguage();
      const { theme, setTheme } = useTheme();
      const router = useRouter();

      const [currentPassword, setCurrentPassword] = useState("");
      const [newPassword, setNewPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [showCurrentPassword, setShowCurrentPassword] = useState(false);
      const [showNewPassword, setShowNewPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [isSaving, setIsSaving] = useState(false);
      const [validationError, setValidationError] = useState<string | null>(null);

      // Redirect if not authenticated
      useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                  router.push("/login");
            }
      }, [isLoading, isAuthenticated, router]);

      // Password strength validation
      const passwordValidation = useMemo(() => {
            return passwordRules.map(rule => ({
                  ...rule,
                  passed: rule.test(newPassword),
                  label: language === "ar" ? rule.labelAr : rule.labelEn,
            }));
      }, [newPassword, language]);

      const allRulesPassed = passwordValidation.every(r => r.passed);
      const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            clearError();
            setValidationError(null);

            // Check all password rules
            if (!allRulesPassed) {
                  setValidationError(language === "ar"
                        ? "كلمة المرور لا تستوفي جميع المتطلبات"
                        : "Password does not meet all requirements");
                  return;
            }

            if (!passwordsMatch) {
                  setValidationError(t("auth.passwordsDoNotMatch"));
                  return;
            }

            setIsSaving(true);

            const success = await changePassword({
                  currentPassword,
                  newPassword,
                  confirmPassword,
            });

            if (!success) {
                  setIsSaving(false);
            }
            // If success, the auth context will redirect to login
      };

      const toggleLanguage = () => {
            setLanguage(language === "ar" ? "en" : "ar");
      };

      const toggleTheme = () => {
            setTheme(theme === "dark" ? "light" : "dark");
      };

      const BackArrow = isRtl ? ArrowRight : ArrowLeft;
      const isDark = theme === "dark";
      const mustChange = mustChangePassword;

      // Show loading only while actually loading
      if (isLoading) {
            return (
                  <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100"}`}>
                        <div className="flex flex-col items-center gap-4">
                              <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{t("common.loading")}</p>
                        </div>
                  </div>
            );
      }

      return (
            <div
                  className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300"
                  dir={isRtl ? "rtl" : "ltr"}
            >
                  {/* Background */}
                  <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100"}`} />

                  {/* Animated Background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${isDark ? "bg-gradient-to-br from-amber-500/15 to-orange-600/10" : "bg-gradient-to-br from-amber-400/30 to-orange-500/20"}`} />
                        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${isDark ? "bg-gradient-to-tr from-orange-500/15 to-amber-600/10" : "bg-gradient-to-tr from-orange-400/30 to-amber-500/20"}`} />
                        <div className={`absolute inset-0 ${isDark ? "bg-[linear-gradient(rgba(251,191,36,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.02)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(251,191,36,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.08)_1px,transparent_1px)]"} bg-[size:50px_50px]`} />
                  </div>

                  <div className="relative w-full max-w-md z-10">
                        {/* Top Bar - Back, Theme & Language Toggle */}
                        {!mustChange && (
                              <div className="absolute -top-14 w-full flex items-center justify-between">
                                    <Link
                                          href="/profile"
                                          className={`flex items-center gap-2 transition-all duration-300 group ${isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
                                    >
                                          <BackArrow className="h-4 w-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                                          <span className="text-sm font-medium">{t("common.back")}</span>
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
                        )}

                        {/* If mustChange, show toggles on right */}
                        {mustChange && (
                              <div className="absolute -top-14 inset-x-0 flex justify-end gap-2">
                                    <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={toggleTheme}
                                          className={`gap-2 rounded-xl transition-all ${isDark ? "text-slate-400 hover:text-white hover:bg-slate-800/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
                                    >
                                          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    </Button>
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
                        )}

                        {/* Card with Glow */}
                        <div className="relative">
                              <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-50 ${isDark ? "bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20" : "bg-gradient-to-r from-amber-400/30 via-orange-400/30 to-amber-400/30"}`} />

                              <Card className={`relative backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden ${isDark ? "bg-slate-900/80 border-slate-700/50" : "bg-white/90 border-slate-200"}`}>
                                    <CardHeader className="text-center pt-8 pb-4">
                                          {/* App Logo */}
                                          <div className="flex justify-center mb-6">
                                                <div className="relative">
                                                      <div className="absolute -inset-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl blur opacity-40 animate-pulse" />
                                                      <div className={`relative p-3 rounded-2xl shadow-lg border ${isDark ? "bg-slate-800/80 border-slate-700/50" : "bg-white border-slate-200"}`}>
                                                            <Image
                                                                  src="/assets/app-icon"
                                                                  alt="Cybersecurity Portal"
                                                                  width={56}
                                                                  height={56}
                                                                  className="h-14 w-14 object-contain"
                                                            />
                                                      </div>
                                                </div>
                                          </div>

                                          <CardTitle className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                                                {t("profile.changePassword")}
                                          </CardTitle>
                                          <CardDescription className={`mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                                {mustChange
                                                      ? t("auth.mustChangePasswordDescription")
                                                      : t("profile.changePasswordDescription")}
                                          </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-6 md:p-8">
                                          {/* Warning for first login */}
                                          {mustChange && (
                                                <div className={`mb-6 p-4 border rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200"}`}>
                                                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isDark ? "bg-amber-500/20" : "bg-amber-100"}`}>
                                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                      </div>
                                                      <p className={`text-sm leading-relaxed ${isDark ? "text-amber-200" : "text-amber-700"}`}>
                                                            {t("auth.firstLoginWarning")}
                                                      </p>
                                                </div>
                                          )}

                                          {/* Error Messages */}
                                          {(error || validationError) && (
                                                <div className={`mb-6 p-4 border rounded-xl text-sm text-center animate-in fade-in slide-in-from-top-2 ${isDark ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>
                                                      {validationError || error}
                                                </div>
                                          )}

                                          <form onSubmit={handleSubmit} className="space-y-5">
                                                {/* Current Password */}
                                                <div className="space-y-2">
                                                      <Label htmlFor="currentPassword" className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                            <Lock className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                                            {t("auth.currentPassword")}
                                                      </Label>
                                                      <div className="relative">
                                                            <Input
                                                                  id="currentPassword"
                                                                  type={showCurrentPassword ? "text" : "password"}
                                                                  value={currentPassword}
                                                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                                                  placeholder={t("auth.currentPasswordPlaceholder")}
                                                                  className={`h-12 rounded-xl transition-all ${isRtl ? "pl-12" : "pr-12"} ${isDark
                                                                        ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                                                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"}`}
                                                                  disabled={isSaving}
                                                                  autoComplete="current-password"
                                                            />
                                                            <button
                                                                  type="button"
                                                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                  className={`absolute inset-y-0 ${isRtl ? "left-0 pl-4" : "right-0 pr-4"} flex items-center transition-colors ${isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}
                                                            >
                                                                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                            </button>
                                                      </div>
                                                </div>

                                                {/* New Password */}
                                                <div className="space-y-2">
                                                      <Label htmlFor="newPassword" className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                            <ShieldCheck className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                                            {t("auth.newPassword")}
                                                      </Label>
                                                      <div className="relative">
                                                            <Input
                                                                  id="newPassword"
                                                                  type={showNewPassword ? "text" : "password"}
                                                                  value={newPassword}
                                                                  onChange={(e) => setNewPassword(e.target.value)}
                                                                  placeholder={t("auth.newPasswordPlaceholder")}
                                                                  className={`h-12 rounded-xl transition-all ${isRtl ? "pl-12" : "pr-12"} ${isDark
                                                                        ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                                                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"}`}
                                                                  disabled={isSaving}
                                                                  autoComplete="new-password"
                                                            />
                                                            <button
                                                                  type="button"
                                                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                                                  className={`absolute inset-y-0 ${isRtl ? "left-0 pl-4" : "right-0 pr-4"} flex items-center transition-colors ${isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}
                                                            >
                                                                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                            </button>
                                                      </div>
                                                </div>

                                                {/* Password Strength Rules */}
                                                {newPassword.length > 0 && (
                                                      <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-800/30 border-slate-700/50" : "bg-slate-50 border-slate-200"}`}>
                                                            <p className={`text-xs font-semibold mb-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                                                  {language === "ar" ? "متطلبات كلمة المرور:" : "Password requirements:"}
                                                            </p>
                                                            <div className="grid grid-cols-1 gap-2">
                                                                  {passwordValidation.map((rule) => (
                                                                        <div
                                                                              key={rule.key}
                                                                              className={`flex items-center gap-2 text-xs transition-all duration-200 ${rule.passed
                                                                                    ? "text-green-500"
                                                                                    : isDark ? "text-slate-500" : "text-slate-400"}`}
                                                                        >
                                                                              {rule.passed ? (
                                                                                    <Check className="h-3.5 w-3.5" />
                                                                              ) : (
                                                                                    <X className="h-3.5 w-3.5" />
                                                                              )}
                                                                              <span>{rule.label}</span>
                                                                        </div>
                                                                  ))}
                                                            </div>

                                                            {/* Strength Bar */}
                                                            <div className="mt-3">
                                                                  <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                                                                        <div
                                                                              className={`h-full transition-all duration-300 ${passwordValidation.filter(r => r.passed).length <= 1 ? "bg-red-500" :
                                                                                    passwordValidation.filter(r => r.passed).length <= 2 ? "bg-orange-500" :
                                                                                          passwordValidation.filter(r => r.passed).length <= 3 ? "bg-yellow-500" :
                                                                                                passwordValidation.filter(r => r.passed).length <= 4 ? "bg-lime-500" :
                                                                                                      "bg-green-500"
                                                                                    }`}
                                                                              style={{ width: `${(passwordValidation.filter(r => r.passed).length / passwordValidation.length) * 100}%` }}
                                                                        />
                                                                  </div>
                                                                  <p className={`text-xs mt-1.5 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                                                        {language === "ar" ? "قوة كلمة المرور: " : "Password strength: "}
                                                                        <span className={
                                                                              passwordValidation.filter(r => r.passed).length <= 1 ? "text-red-500" :
                                                                                    passwordValidation.filter(r => r.passed).length <= 2 ? "text-orange-500" :
                                                                                          passwordValidation.filter(r => r.passed).length <= 3 ? "text-yellow-600" :
                                                                                                passwordValidation.filter(r => r.passed).length <= 4 ? "text-lime-600" :
                                                                                                      "text-green-500 font-semibold"
                                                                        }>
                                                                              {passwordValidation.filter(r => r.passed).length <= 1 ? (language === "ar" ? "ضعيفة جداً" : "Very Weak") :
                                                                                    passwordValidation.filter(r => r.passed).length <= 2 ? (language === "ar" ? "ضعيفة" : "Weak") :
                                                                                          passwordValidation.filter(r => r.passed).length <= 3 ? (language === "ar" ? "متوسطة" : "Medium") :
                                                                                                passwordValidation.filter(r => r.passed).length <= 4 ? (language === "ar" ? "جيدة" : "Good") :
                                                                                                      (language === "ar" ? "قوية" : "Strong")}
                                                                        </span>
                                                                  </p>
                                                            </div>
                                                      </div>
                                                )}

                                                {/* Confirm Password */}
                                                <div className="space-y-2">
                                                      <Label htmlFor="confirmPassword" className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                            <ShieldCheck className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                                            {t("auth.confirmPassword")}
                                                      </Label>
                                                      <div className="relative">
                                                            <Input
                                                                  id="confirmPassword"
                                                                  type={showConfirmPassword ? "text" : "password"}
                                                                  value={confirmPassword}
                                                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                                                  placeholder={t("auth.confirmPasswordPlaceholder")}
                                                                  className={`h-12 rounded-xl transition-all ${isRtl ? "pl-12" : "pr-12"} ${isDark
                                                                        ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                                                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"}`}
                                                                  disabled={isSaving}
                                                                  autoComplete="new-password"
                                                            />
                                                            <button
                                                                  type="button"
                                                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                  className={`absolute inset-y-0 ${isRtl ? "left-0 pl-4" : "right-0 pr-4"} flex items-center transition-colors ${isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}
                                                            >
                                                                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                            </button>
                                                      </div>
                                                </div>

                                                {/* Password Match Indicator */}
                                                {confirmPassword && (
                                                      <div className={`flex items-center gap-2 text-sm ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                                            {passwordsMatch ? (
                                                                  <>
                                                                        <Check className="h-4 w-4" />
                                                                        <span>{language === "ar" ? "كلمات المرور متطابقة" : "Passwords match"}</span>
                                                                  </>
                                                            ) : (
                                                                  <>
                                                                        <X className="h-4 w-4" />
                                                                        <span>{t("auth.passwordsDoNotMatch")}</span>
                                                                  </>
                                                            )}
                                                      </div>
                                                )}

                                                {/* Submit Button */}
                                                <Button
                                                      type="submit"
                                                      className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-base rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
                                                      disabled={isSaving || !currentPassword || !allRulesPassed || !passwordsMatch}
                                                >
                                                      {isSaving ? (
                                                            <span className="flex items-center gap-2">
                                                                  <Loader2 className="h-5 w-5 animate-spin" />
                                                                  {t("common.saving")}
                                                            </span>
                                                      ) : (
                                                            <span className="flex items-center gap-2">
                                                                  <KeyRound className="h-5 w-5" />
                                                                  {t("profile.changePassword")}
                                                            </span>
                                                      )}
                                                </Button>
                                          </form>
                                    </CardContent>
                              </Card>
                        </div>

                        {/* Bottom Decoration */}
                        <div className="flex justify-center mt-8 gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-500/50 animate-pulse" />
                              <div className="w-2 h-2 rounded-full bg-orange-500/50 animate-pulse delay-150" />
                              <div className="w-2 h-2 rounded-full bg-amber-500/50 animate-pulse delay-300" />
                        </div>
                  </div>
            </div>
      );
}
