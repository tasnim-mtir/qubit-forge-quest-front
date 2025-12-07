import { useProcessorStatus } from "@/hooks/useProcessorMonitoring";
import { Activity, CheckCircle2, Clock, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessorStatusWidgetProps {
  className?: string;
  refreshInterval?: number;
}

export function ProcessorStatusWidget({
  className,
  refreshInterval = 5000,
}: ProcessorStatusWidgetProps) {
  const { data, loading, error } = useProcessorStatus({
    refreshInterval,
    enabled: true,
  });

  if (error) {
    return (
      <div className={cn("bg-red-500/10 border border-red-500/30 rounded-lg p-4", className)}>
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Failed to load processor status</span>
        </div>
      </div>
    );
  }

  const processor = data?.processor;
  const queue = data?.queue;
  const stats = data?.stats;
  const refreshRate = `${(refreshInterval / 1000).toFixed(0)}s`;

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Processor Monitor</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Updates every {refreshRate}</span>
          {loading && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {/* Processor Active */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Processor Active
          </p>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                processor?.isRunning ? "bg-green-500" : "bg-red-500"
              )}
            />
            <span className="text-sm font-semibold text-white">
              {processor?.isRunning ? "✓ Running" : "✗ Offline"}
            </span>
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Health
          </p>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                processor?.isHealthy ? "bg-green-500" : "bg-yellow-500"
              )}
            />
            <span className="text-sm font-semibold text-white">
              {processor?.isHealthy ? "Healthy" : "Warning"}
            </span>
          </div>
        </div>

        {/* Running Tasks */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Running
          </p>
          <p className="text-2xl font-bold text-blue-400">{queue?.runningCount || 0}</p>
        </div>

        {/* Queued Tasks */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-2">Queued</p>
          <p className="text-2xl font-bold text-yellow-400">{queue?.queuedCount || 0}</p>
        </div>

        {/* Completed Tasks */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-2">Completed</p>
          <p className="text-2xl font-bold text-green-400">{queue?.completedCount || 0}</p>
        </div>

        {/* Failed Tasks */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-2">Failed</p>
          <p className="text-2xl font-bold text-red-400">{queue?.failedCount || 0}</p>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="border-t border-slate-700/50 pt-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Success Rate</span>
            <span className="font-semibold text-green-400">
              {(stats.successRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Avg Processing Time</span>
            <span className="font-semibold text-blue-400">
              {(stats.avgProcessingTime / 1000).toFixed(2)}s
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Total Processed</span>
            <span className="font-semibold text-white">{stats.totalProcessed}</span>
          </div>
        </div>
      )}

      {/* Engine Info */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 flex items-center gap-2">
          <Clock className="w-3 h-3" />
          <span>
            Execution Engine: <span className="text-slate-300 font-medium">Running</span>
            <span className="text-slate-600"> (interval = {processor?.interval}ms)</span>
          </span>
        </p>
      </div>
    </div>
  );
}
