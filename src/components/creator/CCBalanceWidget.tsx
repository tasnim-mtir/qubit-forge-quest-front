import { Zap } from "lucide-react";
import type { UserCCStatus } from "@/services/protocolAPI";

interface CCBalanceWidgetProps {
  ccStatus: UserCCStatus | null;
  isLoading: boolean;
}

export function CCBalanceWidget({ ccStatus, isLoading }: CCBalanceWidgetProps) {
  const utilizationPercent = ccStatus
    ? Math.round((ccStatus.usedCC / ccStatus.totalCC) * 100)
    : 0;

  return (
    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-8 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-2">Total Compute Credits</p>
          <p className="text-4xl font-bold text-blue-300">
            {isLoading ? (
              <span className="text-slate-500 animate-pulse">...</span>
            ) : (
              ccStatus?.totalCC.toLocaleString() || "0"
            )}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-blue-500/30">
          <Zap className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/30 border border-blue-500/20 rounded-lg p-4">
          <p className="text-slate-500 text-xs font-medium mb-1">Used CC</p>
          <p className="text-lg font-bold text-blue-300">
            {isLoading ? "..." : ccStatus?.usedCC.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-slate-900/30 border border-blue-500/20 rounded-lg p-4">
          <p className="text-slate-500 text-xs font-medium mb-1">Available CC</p>
          <p className="text-lg font-bold text-emerald-300">
            {isLoading ? "..." : ccStatus?.availableCC.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-slate-900/30 border border-blue-500/20 rounded-lg p-4">
          <p className="text-slate-500 text-xs font-medium mb-1">Utilization</p>
          <p className="text-lg font-bold text-orange-300">{utilizationPercent}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-slate-900/50 border border-blue-500/20 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
            style={{ width: `${utilizationPercent}%` } as React.CSSProperties}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {ccStatus && ccStatus.totalCC > 0
            ? `${((ccStatus.usedCC / ccStatus.totalCC) * 100).toFixed(1)}% utilization`
            : "No data"}
        </p>
      </div>

      {/* Action Button */}
      <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all border border-blue-400/30">
        💳 Stake More QX to Get CC
      </button>

      {/* Live Indicator */}
      <div className="mt-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs text-slate-400">Real-time balance updates</span>
      </div>
    </div>
  );
}
