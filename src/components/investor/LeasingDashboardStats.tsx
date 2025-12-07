import { Zap, TrendingUp, Activity } from "lucide-react";
import type { LeaseResponse } from "@/services/protocolAPI";

interface LeasingDashboardStatsProps {
  leaseData: LeaseResponse | null;
  isLoading: boolean;
}

export function LeasingDashboardStats({ leaseData, isLoading }: LeasingDashboardStatsProps) {
  const summary = leaseData?.summary || {
    totalComputeLeased: 0,
    totalCostCC: 0,
    activeLeases: 0,
  };

  // Calculate utilization percentage (assuming max 5000 compute units)
  const utilizationPercent = Math.round((summary.totalComputeLeased / 5000) * 100);

  const cards = [
    {
      label: "Total Compute Leased",
      value: summary.totalComputeLeased,
      unit: "units",
      icon: TrendingUp,
      color: "from-emerald-500/20 to-emerald-600/20",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-300",
      dotColor: "bg-emerald-500",
    },
    {
      label: "Total Cost",
      value: summary.totalCostCC,
      unit: "CC",
      icon: Zap,
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-300",
      dotColor: "bg-blue-500",
    },
    {
      label: "Active Leases",
      value: summary.activeLeases,
      unit: "leases",
      icon: Activity,
      color: "from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-500/30",
      textColor: "text-orange-300",
      dotColor: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-lg p-6 backdrop-blur-sm transition-all hover:border-blue-500/50`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-400 text-sm font-medium mb-2">{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold ${card.textColor}`}>
                      {isLoading ? (
                        <span className="text-slate-500 animate-pulse">...</span>
                      ) : (
                        card.value.toLocaleString()
                      )}
                    </p>
                    <p className="text-slate-400 text-sm">{card.unit}</p>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-slate-900/50 border ${card.borderColor}`}>
                  <Icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${card.dotColor} animate-pulse`}></span>
                <span className="text-xs text-slate-400">Live</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Utilization Meter */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Utilization Rate</h3>
          <p className={`text-2xl font-bold ${utilizationPercent > 80 ? "text-orange-400" : utilizationPercent > 50 ? "text-yellow-400" : "text-emerald-400"}`}>
            {utilizationPercent}%
          </p>
        </div>

        <div className="w-full bg-slate-900/50 border border-blue-500/20 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              utilizationPercent > 80
                ? "bg-gradient-to-r from-orange-500 to-orange-400"
                : utilizationPercent > 50
                ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                : "bg-gradient-to-r from-emerald-500 to-emerald-400"
            }`}
            style={{ width: `${Math.min(utilizationPercent, 100)}%` } as React.CSSProperties}
          />
        </div>

        <p className="text-xs text-slate-400 mt-3">
          {summary.totalComputeLeased} / 5,000 compute units utilized
        </p>
      </div>
    </div>
  );
}
