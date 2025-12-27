"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth, getInitials } from "@/contexts/client-auth-context";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, ChevronDown, Loader2, LogIn } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
      const { client, isLoading, isAuthenticated, logout } = useClientAuth();
      const { t, isRtl } = useLanguage();
      const router = useRouter();
      const [isOpen, setIsOpen] = useState(false);

      const handleLogout = async () => {
            setIsOpen(false);
            await logout();
      };

      // Not authenticated - show login button
      if (!isAuthenticated) {
            const handleLogin = () => {
                  const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
                  window.location.href = `/login?returnUrl=${returnUrl}`;
            };

            return (
                  <Button
                        variant="default"
                        size="sm"
                        onClick={handleLogin}
                        className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                        <LogIn className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("auth.login")}</span>
                  </Button>
            );
      }

      // Loading state
      if (isLoading || !client) {
            return (
                  <Button variant="ghost" size="sm" disabled className="gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
            );
      }

      return (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger asChild>
                        <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 px-2 py-1.5 h-auto rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                              {/* Avatar */}
                              <div className="relative">
                                    {client.avatar ? (
                                          <img
                                                src={client.avatar}
                                                alt={client.firstName}
                                                className="h-8 w-8 rounded-full object-cover border-2 border-green-500/30"
                                          />
                                    ) : (
                                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold border-2 border-green-500/30">
                                                {getInitials(client.firstName, client.lastName)}
                                          </div>
                                    )}
                                    {/* Online indicator */}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                              </div>

                              {/* Name (hidden on small screens) */}
                              <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                                    {client.firstName}
                              </span>

                              <ChevronDown className="h-4 w-4 text-slate-500" />
                        </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                        align={isRtl ? "start" : "end"}
                        className="w-56 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl"
                  >
                        {/* User Info Header */}
                        <div className="px-3 py-2 mb-2">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {client.firstName} {client.lastName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {client.rank} • {client.itBranch}
                              </p>
                        </div>

                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

                        {/* Profile Link */}
                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                              <a
                                    href="/profile"
                                    onClick={(e) => { e.preventDefault(); window.location.href = "/profile"; }}
                                    className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                    <User className="h-4 w-4" />
                                    <span>{t("nav.profile")}</span>
                              </a>
                        </DropdownMenuItem>

                        {/* Settings Link */}
                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                              <a
                                    href="/change-password"
                                    onClick={(e) => { e.preventDefault(); window.location.href = "/change-password"; }}
                                    className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                    <Settings className="h-4 w-4" />
                                    <span>{t("profile.changePassword")}</span>
                              </a>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

                        {/* Logout */}
                        <DropdownMenuItem
                              onClick={handleLogout}
                              className="cursor-pointer rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
                        >
                              <div className="flex items-center gap-3 px-3 py-2">
                                    <LogOut className="h-4 w-4" />
                                    <span>{t("auth.logout")}</span>
                              </div>
                        </DropdownMenuItem>
                  </DropdownMenuContent>
            </DropdownMenu>
      );
}
