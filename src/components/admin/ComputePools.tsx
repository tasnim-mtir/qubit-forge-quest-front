import { TrendingUp, Database, Zap, Users } from "lucide-react";
import type { VaultStats } from "@/services/protocolAPI";

interface ComputePoolsProps {
  vaultStats: VaultStats | null;
  isLoading: boolean;
}

export function ComputePools({ vaultStats, isLoading }: ComputePoolsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-12 h-12 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-400">Loading compute pools...</p>
        </div>
      </div>
    );
  }

  if (!vaultStats) {
    return <p className="text-slate-400 text-center py-8">No vault stats available</p>;
  }

  const vault = vaultStats.vault || {
    totalLockedQX: 0,
    totalComputeCredits: 0,
    totalTasksExecuted: 0,
    rewardPool: 0,
  };

  const stats = vaultStats.stats || {
    totalStakers: 0,
    activeStakes: 0,
    totalTasksQueued: 0,
    totalTasksCompleted: 0,
    ccPerQX: 100,
    ccUtilization: 0,
    poolHealth: "Healthy",
  };

  // Use ccUtilization and poolHealth from API response
  const ccUtilization = stats.ccUtilization || 0;
  const poolHealth = stats.poolHealth?.toLowerCase() || "healthy";

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-lg p-5 hover:border-red-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Locked QX</p>
              <p className="text-3xl font-bold text-red-300 mt-3">
                {vault.totalLockedQX.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-2">staking pool</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Database className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg p-5 hover:border-emerald-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Compute Credits</p>
              <p className="text-3xl font-bold text-emerald-300 mt-3">
                {(vault.totalComputeCredits / 1000).toLocaleString("en-US", { maximumFractionDigits: 0 })}K
              </p>
              <p className="text-xs text-slate-500 mt-2">in circulation</p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-5 hover:border-blue-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Tasks Executed</p>
              <p className="text-3xl font-bold text-yellow-300 mt-2">
                {vault.totalTasksExecuted.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-2">total</p>
            </div>
            <TrendingUp className="w-5 h-5 text-yellow-400 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm">Reward Pool</p>
              <p className="text-3xl font-bold text-purple-300 mt-2">
                {vault.rewardPool.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-2">CC available</p>
            </div>
            <Zap className="w-5 h-5 text-purple-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm">Total Stakers</p>
              <p className="text-2xl font-bold text-blue-300 mt-2">{stats.totalStakers.toLocaleString()}</p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Active:</span>
                  <span className="text-blue-300 font-semibold">{stats.activeStakes}</span>
                </div>
              </div>
            </div>
            <Users className="w-5 h-5 text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-yellow-500/20 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm">Tasks Status</p>
              <p className="text-2xl font-bold text-yellow-300 mt-2">{stats.totalTasksQueued}</p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Queued:</span>
                  <span className="text-yellow-300 font-semibold">{stats.totalTasksQueued}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Completed:</span>
                  <span className="text-emerald-300 font-semibold">{stats.totalTasksCompleted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-emerald-500/20 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm">CC Conversion</p>
              <p className="text-2xl font-bold text-emerald-300 mt-2">
                1 QX = {stats.ccPerQX} CC
              </p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Avg Stake:</span>
                  <span className="text-emerald-300 font-semibold">
                    {(vault.totalLockedQX / stats.totalStakers).toFixed(2)} QX
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CC Utilization */}
        <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-slate-400 text-sm font-semibold">CC Utilization</p>
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${
                ccUtilization > 80
                  ? "bg-red-500/20 text-red-300"
                  : ccUtilization > 50
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {ccUtilization.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                ccUtilization > 80
                  ? "bg-gradient-to-r from-red-500 to-red-400"
                  : ccUtilization > 50
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-400"
              }`}
              style={{ width: `${Math.min(ccUtilization, 100)}%` } as React.CSSProperties}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">of total compute credits</p>
        </div>

        {/* Pool Health */}
        <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-slate-400 text-sm font-semibold">Pool Health</p>
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${
                poolHealth === "critical"
                  ? "bg-red-500/20 text-red-300"
                  : poolHealth === "warning"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {poolHealth.charAt(0).toUpperCase() + poolHealth.slice(1)}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className={poolHealth === "healthy" ? "text-emerald-300" : poolHealth === "warning" ? "text-yellow-300" : "text-red-300"}>
                {poolHealth === "healthy" ? "✓ Healthy" : poolHealth === "warning" ? "⚠ Warning" : "✗ Critical"}
              </span>
            </div>
          </div>
        </div>

        {/* Network Activity */}
        <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-slate-400 text-sm font-semibold">Network Activity</p>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Active
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Pending:</span>
              <span className="text-blue-300 font-semibold">{stats.totalTasksQueued}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Success Rate:</span>
              <span className="text-emerald-300 font-semibold">
                {stats.totalTasksCompleted + stats.totalTasksQueued > 0
                  ? ((stats.totalTasksCompleted / (stats.totalTasksCompleted + stats.totalTasksQueued)) * 100).toFixed(1)
                  : "0"}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pool Allocation */}
      <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Pool Allocation</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400 text-sm">Staking Pool</span>
              <span className="text-blue-300 font-semibold">{vault.totalLockedQX.toLocaleString()} QX</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                style={{ width: "60%" } as React.CSSProperties}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400 text-sm">Reward Pool</span>
              <span className="text-emerald-300 font-semibold">{vault.rewardPool.toLocaleString()} CC</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: "25%" } as React.CSSProperties}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400 text-sm">Active Leases Pool</span>
              <span className="text-yellow-300 font-semibold">
                {(vault.totalComputeCredits * 0.15).toLocaleString("en-US", { maximumFractionDigits: 0 })} CC
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                style={{ width: "15%" } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
