import { Activity } from "lucide-react";
import type { TasksResponse } from "@/services/protocolAPI";

interface QueueStatusMonitorProps {
  statusCount: TasksResponse["statusCount"] | null;
  isLoading: boolean;
}

export function QueueStatusMonitor({ statusCount, isLoading }: QueueStatusMonitorProps) {
  const totalQueued = statusCount?.queued || 0;
  const totalRunning = statusCount?.running || 0;

  // Estimate wait time (assuming each task takes ~30 seconds)
  const estimatedWaitMinutes = Math.ceil((totalQueued * 0.5) / 60);

  const queueMetrics = [
    {
      label: "Queued",
      count: totalQueued,
      color: "from-yellow-500/20 to-yellow-600/20",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-300",
      dotColor: "bg-yellow-500",
      icon: "⏳",
    },
    {
      label: "Running",
      count: totalRunning,
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-300",
      dotColor: "bg-blue-500",
      icon: "⚙️",
    },
    {
      label: "Completed",
      count: statusCount?.completed || 0,
      color: "from-emerald-500/20 to-emerald-600/20",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-300",
      dotColor: "bg-emerald-500",
      icon: "✓",
    },
    {
      label: "Failed",
      count: statusCount?.failed || 0,
      color: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-500/30",
      textColor: "text-red-300",
      dotColor: "bg-red-500",
      icon: "✕",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Queue Status Card */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Network Queue Status
            </h3>
            <p className="text-slate-400 text-sm">
              Real-time execution queue monitoring
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <svg className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-400">Loading queue status...</p>
          </div>
        ) : (
          <>
            {/* Queue Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {queueMetrics.map((metric, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${metric.color} border ${metric.borderColor} rounded-lg p-4 backdrop-blur-sm`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-slate-400 text-sm font-medium">{metric.label}</p>
                    <span className="text-lg">{metric.icon}</span>
                  </div>
                  <p className={`text-3xl font-bold ${metric.textColor}`}>
                    {isLoading ? "..." : metric.count}
                  </p>
                  <div className="mt-3 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${metric.dotColor} animate-pulse`}></span>
                    <span className="text-xs text-slate-500">Live</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Estimated Wait Time */}
            {totalQueued > 0 && (
              <div className="bg-slate-800/50 border border-yellow-500/20 rounded-lg p-4 mb-6">
                <p className="text-slate-400 text-sm mb-2">Estimated Wait Time</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-yellow-300">
                    {estimatedWaitMinutes}
                  </p>
                  <p className="text-slate-400 text-sm">minutes</p>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Based on {totalQueued} queued tasks ahead
                </p>
              </div>
            )}

            {/* Network Activity */}
            <div className="space-y-3">
              <p className="text-slate-400 text-sm font-medium">Network Activity</p>
              
              {/* Active Tasks Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Active Tasks</span>
                  <span>{totalRunning} running</span>
                </div>
                <div className="w-full bg-slate-900/50 border border-blue-500/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                    style={{
                      width: `${Math.min((totalRunning / (totalQueued + totalRunning + 1)) * 100, 100)}%`,
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Queue Load Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Queue Load</span>
                  <span>{totalQueued} queued</span>
                </div>
                <div className="w-full bg-slate-900/50 border border-yellow-500/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                    style={{
                      width: `${Math.min((totalQueued / (totalQueued + totalRunning + 1)) * 100, 100)}%`,
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>

            {/* Status Message */}
            {totalQueued === 0 && totalRunning === 0 ? (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-sm">
                ✓ Network is idle. Submit a task to get started!
              </div>
            ) : totalQueued > 10 ? (
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-sm">
                ⚠️ High queue load. Estimated wait time is approximately {estimatedWaitMinutes} minutes.
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
