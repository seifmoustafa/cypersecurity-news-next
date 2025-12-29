"use client";

import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { Users, Eye, Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "./language-provider";

export function RealtimeStatsFooter() {
  const { stats, isConnected } = useRealtimeStats();
  const { t, language } = useLanguage();

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
    <div >
      <div className="absolute inset-0 opacity-5 dark:opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.03)_50%,transparent_75%)] dark:bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>
      <div style={{display:"flex",flexDirection:"column", alignItems:"center"}}>
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          {t("footer.siteVisits")}
        </h3>
        {/* Connection status */}
        <div style={{display:"flex",flexDirection:"row",gap:"16px",alignItems:"center"}}>
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
            <span className="text-xs text-slate-400">{t("footer.connectedNow")}</span>
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
            <span className="text-xs text-slate-400">{t("footer.visit")}</span>
          </div>
        </div>
        </div>
        <div style={{height:"100px"}}></div>
      </div>
    </div>
  );
}
