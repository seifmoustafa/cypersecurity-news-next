"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKeycloak } from "@/contexts/keycloak-context";
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

// Helper to get initials from name
function getInitials(firstName?: string, lastName?: string): string {
      const first = firstName?.charAt(0)?.toUpperCase() || "";
      const last = lastName?.charAt(0)?.toUpperCase() || "";
      return first + last || "U";
}

export function UserMenu() {
      const { user, systemClient, isLoading, isAuthenticated, login, logout } = useKeycloak();
      const { t, isRtl } = useLanguage();
      const router = useRouter();
      const [isOpen, setIsOpen] = useState(false);

      const handleLogout = () => {
            setIsOpen(false);
            logout();
      };

      const handleLogin = () => {
            login();
      };

      // Loading state
      if (isLoading) {
            return (
                  <Button variant="ghost" size="sm" disabled className="gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
            );
      }

      // Not authenticated - show login button
      if (!isAuthenticated) {
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

      // Get user display info from either systemClient (backend) or Keycloak user
      const displayName = systemClient?.name || user?.fullName || user?.username || "User";
      const firstName = systemClient?.username || user?.firstName || user?.username || "User";
      const lastName = user?.lastName || "";
      const avatar = null; // Keycloak doesn't provide avatar by default

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
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold border-2 border-green-500/30">
                                          {getInitials(user?.firstName || firstName, user?.lastName)}
                                    </div>
                                    {/* Online indicator */}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                              </div>

                              {/* Name (hidden on small screens) */}
                              <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                                    {firstName}
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
                                    {displayName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {user?.email || user?.username || "Keycloak User"}
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
