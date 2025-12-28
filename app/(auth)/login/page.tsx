"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useClientAuth } from "@/contexts/client-auth-context";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowLeft, ArrowRight, Lock, User, Globe, Phone, Sun, Moon } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
      const { login, isLoading, error, clearError, isAuthenticated } = useClientAuth();
      const { t, language, setLanguage, isRtl } = useLanguage();
      const { theme, setTheme } = useTheme();
      const router = useRouter();

      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [showPassword, setShowPassword] = useState(false);

      const searchParams = useSearchParams();
      const returnUrl = searchParams?.get("returnUrl");

      // Redirect if already authenticated
      useEffect(() => {
            if (isAuthenticated && !isLoading) {
                  router.replace("/simple");
            }
      }, [isAuthenticated, isLoading, router]);

      // Store returnUrl in sessionStorage for password change flow
      useEffect(() => {
            if (returnUrl) {
                  sessionStorage.setItem("authReturnUrl", decodeURIComponent(returnUrl));
            }
      }, [returnUrl]);

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            clearError();

            if (!username.trim() || !password.trim()) {
                  return;
            }

            const result = await login(username, password);

            if (result.success && !result.mustChangePassword) {
                  // Get stored return URL or default to home
                  const storedReturnUrl = sessionStorage.getItem("authReturnUrl");
                  sessionStorage.removeItem("authReturnUrl");

                  // Navigate to return URL or home page - use replace to remove /login from history
                  const redirectTo = storedReturnUrl || "/simple";
                  router.replace(redirectTo);
            }
            // If mustChangePassword, context already redirected to /change-password
      };

      const toggleLanguage = () => {
            setLanguage(language === "ar" ? "en" : "ar");
      };

      const toggleTheme = () => {
            setTheme(theme === "dark" ? "light" : "dark");
      };

      const BackArrow = isRtl ? ArrowRight : ArrowLeft;
      const isDark = theme === "dark";

      return (
            <div
                  className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300"
                  dir={isRtl ? "rtl" : "ltr"}
            >
                  {/* Background - adapts to theme */}
                  <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100"}`} />

                  {/* Animated Background Effects */}
                  <div className="absolute inset-0 overflow-hidden">
                        {/* Gradient Orbs */}
                        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${isDark ? "bg-gradient-to-br from-green-500/20 to-emerald-600/10" : "bg-gradient-to-br from-green-400/30 to-emerald-500/20"}`} />
                        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${isDark ? "bg-gradient-to-tr from-emerald-500/20 to-green-600/10" : "bg-gradient-to-tr from-emerald-400/30 to-green-500/20"}`} />

                        {/* Grid Pattern */}
                        <div className={`absolute inset-0 ${isDark ? "bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(34,197,94,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.08)_1px,transparent_1px)]"} bg-[size:50px_50px]`} />

                        {/* Cyber Lines */}
                        <div className={`absolute top-0 left-1/4 w-px h-full ${isDark ? "bg-gradient-to-b from-transparent via-green-500/20 to-transparent" : "bg-gradient-to-b from-transparent via-green-500/30 to-transparent"}`} />
                        <div className={`absolute top-0 right-1/4 w-px h-full ${isDark ? "bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" : "bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent"}`} />
                  </div>

                  <div className="relative w-full max-w-md z-10">
                        {/* Top Bar - Back, Theme & Language Toggle */}
                        <div className="absolute -top-14 w-full flex items-center justify-between">
                              <button
                                    onClick={() => router.back()}
                                    className={`flex items-center gap-2 transition-all duration-300 group ${isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
                              >
                                    <BackArrow className="h-4 w-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                                    <span className="text-sm font-medium">{t("common.back")}</span>
                              </button>

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

                        {/* Login Card */}
                        <div className="relative">
                              {/* Card Glow Effect */}
                              <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-50 ${isDark ? "bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20" : "bg-gradient-to-r from-green-400/30 via-emerald-400/30 to-green-400/30"}`} />

                              <div className={`relative backdrop-blur-2xl border rounded-3xl shadow-2xl p-8 md:p-10 ${isDark ? "bg-slate-900/80 border-slate-700/50" : "bg-white/90 border-slate-200"}`}>
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                          {/* App Logo */}
                                          <div className="flex justify-center mb-6">
                                                <div className="relative">
                                                      <div className="absolute -inset-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur opacity-40 animate-pulse" />
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

                                          {/* Welcome Text */}
                                          <h1 className={`text-2xl md:text-3xl font-bold mb-2 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                                                {t("auth.welcomeBack")}
                                          </h1>
                                          <p className={`text-sm md:text-base ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                                {t("auth.loginDescription")}
                                          </p>
                                    </div>

                                    {/* Security Badge */}
                                    <div className={`flex items-center justify-center gap-2 mb-6 py-2 px-4 border rounded-full mx-auto w-fit ${isDark ? "bg-green-500/10 border-green-500/20" : "bg-green-50 border-green-200"}`}>
                                          <Lock className="h-3.5 w-3.5 text-green-500" />
                                          <span className="text-xs font-medium text-green-500">{t("auth.secureLogin")}</span>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                          <div className={`mb-6 p-4 rounded-xl text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300 ${isDark ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-red-50 border border-red-200 text-red-600"}`}>
                                                {error}
                                          </div>
                                    )}

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                          {/* Username Field */}
                                          <div className="space-y-2">
                                                <Label htmlFor="username" className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                      <User className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                                      {t("auth.username")}
                                                </Label>
                                                <Input
                                                      id="username"
                                                      type="text"
                                                      value={username}
                                                      onChange={(e) => setUsername(e.target.value)}
                                                      placeholder={t("auth.usernamePlaceholder")}
                                                      className={`h-12 rounded-xl transition-all duration-300 ${isDark
                                                            ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"}`}
                                                      disabled={isLoading}
                                                      autoComplete="username"
                                                />
                                          </div>

                                          {/* Password Field */}
                                          <div className="space-y-2">
                                                <Label htmlFor="password" className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                      <Lock className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                                      {t("auth.password")}
                                                </Label>
                                                <div className="relative">
                                                      <Input
                                                            id="password"
                                                            type={showPassword ? "text" : "password"}
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            placeholder={t("auth.passwordPlaceholder")}
                                                            className={`h-12 rounded-xl transition-all duration-300 ${isRtl ? "pl-12" : "pr-12"} ${isDark
                                                                  ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"}`}
                                                            disabled={isLoading}
                                                            autoComplete="current-password"
                                                      />
                                                      <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className={`absolute inset-y-0 ${isRtl ? "left-0 pl-4" : "right-0 pr-4"} flex items-center transition-colors duration-200 ${isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}
                                                      >
                                                            {showPassword ? (
                                                                  <EyeOff className="h-5 w-5" />
                                                            ) : (
                                                                  <Eye className="h-5 w-5" />
                                                            )}
                                                      </button>
                                                </div>
                                          </div>

                                          {/* Submit Button */}
                                          <Button
                                                type="submit"
                                                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-base rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                disabled={isLoading || !username.trim() || !password.trim()}
                                          >
                                                {isLoading ? (
                                                      <span className="flex items-center gap-2">
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                            {t("common.loading")}
                                                      </span>
                                                ) : (
                                                      t("auth.login")
                                                )}
                                          </Button>
                                    </form>

                                    {/* Footer - Contact Info */}
                                    <div className="mt-8 text-center space-y-2">
                                          <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                                {t("auth.needHelp")}
                                          </p>
                                          <div className="flex items-center justify-center gap-2 text-green-500">
                                                <Phone className="h-4 w-4" />
                                                <span className="text-sm font-medium">76272</span>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        {/* Bottom Decoration */}
                        <div className="flex justify-center mt-8 gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
                              <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse delay-150" />
                              <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse delay-300" />
                        </div>
                  </div>
            </div>
      );
}
