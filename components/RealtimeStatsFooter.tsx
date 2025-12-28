"use client";

import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { Users, Eye, Wifi, WifiOff } from "lucide-react";

export function RealtimeStatsFooter() {
      const { stats, isConnected } = useRealtimeStats();

      // Format large numbers with Arabic numerals
      const formatNumber = (num: number): string => {
            if (num >= 1000000) {
                  return (num / 1000000).toFixed(1).replace(".", "٫") + " مليون";
            }
            if (num >= 1000) {
                  return (num / 1000).toFixed(1).replace(".", "٫") + " ألف";
            }
            return num.toLocaleString("ar-EG");
      };

      return (
            <div className="flex items-center justify-center gap-8 py-4 px-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-slate-700/50">
                  {/* Connection status */}
                  <div className="flex items-center gap-2">
                        {isConnected ? (
                              <Wifi className="h-4 w-4 text-green-400 animate-pulse" />
                        ) : (
                              <WifiOff className="h-4 w-4 text-gray-500" />
                        )}
                  </div>

                  {/* Active users - Big and prominent */}
                  <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-full bg-green-500/20 border border-green-500/30">
                              <Users className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="flex flex-col">
                              <span className="text-2xl font-bold text-white tabular-nums">
                                    {formatNumber(stats.activeUsers)}
                              </span>
                              <span className="text-xs text-slate-400">متصل الآن</span>
                        </div>
                  </div>

                  {/* Divider */}
                  <div className="h-12 w-px bg-slate-600/50" />

                  {/* Total visits - Big and prominent */}
                  <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                              <Eye className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="flex flex-col">
                              <span className="text-2xl font-bold text-white tabular-nums">
                                    {formatNumber(stats.totalVisits)}
                              </span>
                              <span className="text-xs text-slate-400">زيارة</span>
                        </div>
                  </div>
            </div>
      );
}
